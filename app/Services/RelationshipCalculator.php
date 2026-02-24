<?php

namespace App\Services;

use App\Models\Person;
use App\Models\Relationship;
use Illuminate\Support\Collection;

class RelationshipCalculator
{
    /**
     * Calculate how Person A is related to Person B using BFS
     */
    public function calculate(Person $personA, Person $personB): ?string
    {
        if ($personA->id === $personB->id) {
            return 'Same person';
        }

        $treeId = $personA->family_tree_id;
        if ($treeId !== $personB->family_tree_id) {
            return null;
        }

        // BFS to find path
        $path = $this->findPath($personA->id, $personB->id, $treeId);

        if (empty($path)) {
            return 'No relation found';
        }

        return $this->describeRelationship($path, $personB->gender);
    }

    private function findPath(int $startId, int $endId, int $treeId): array
    {
        $relationships = Relationship::where('family_tree_id', $treeId)->get();

        // Build adjacency list
        $graph = [];
        foreach ($relationships as $rel) {
            $graph[$rel->person1_id][] = ['person_id' => $rel->person2_id, 'type' => $rel->type, 'direction' => 'forward'];
            $graph[$rel->person2_id][] = ['person_id' => $rel->person1_id, 'type' => $rel->type, 'direction' => 'reverse'];
        }

        // BFS
        $visited = [$startId => true];
        $queue = [['id' => $startId, 'path' => []]];

        while (!empty($queue)) {
            $current = array_shift($queue);

            if (!isset($graph[$current['id']])) continue;

            foreach ($graph[$current['id']] as $edge) {
                if (isset($visited[$edge['person_id']])) continue;

                $newPath = $current['path'];
                $newPath[] = [
                    'type' => $edge['type'],
                    'direction' => $edge['direction'],
                    'from' => $current['id'],
                    'to' => $edge['person_id'],
                ];

                if ($edge['person_id'] === $endId) {
                    return $newPath;
                }

                $visited[$edge['person_id']] = true;
                $queue[] = ['id' => $edge['person_id'], 'path' => $newPath];
            }
        }

        return [];
    }

    private function describeRelationship(array $path, string $targetGender): string
    {
        $steps = [];
        foreach ($path as $step) {
            if (in_array($step['type'], ['parent_child', 'step_parent_child', 'adoptive_parent_child'])) {
                if ($step['direction'] === 'forward') {
                    $steps[] = 'child'; // person1 is parent, going to child
                } else {
                    $steps[] = 'parent'; // person2 going to parent
                }
            } elseif (in_array($step['type'], ['spouse', 'partner', 'ex_spouse'])) {
                $steps[] = 'spouse';
            } elseif (in_array($step['type'], ['sibling', 'half_sibling'])) {
                $steps[] = 'sibling';
            }
        }

        return $this->stepsToLabel($steps, $targetGender);
    }

    private function stepsToLabel(array $steps, string $gender): string
    {
        $isMale = $gender === 'male';
        $count = count($steps);

        if ($count === 1) {
            return match ($steps[0]) {
                'parent' => $isMale ? 'Father' : 'Mother',
                'child' => $isMale ? 'Son' : 'Daughter',
                'spouse' => $isMale ? 'Husband' : 'Wife',
                'sibling' => $isMale ? 'Brother' : 'Sister',
                default => 'Related',
            };
        }

        if ($count === 2) {
            $combo = implode('-', $steps);
            return match ($combo) {
                'parent-parent' => $isMale ? 'Grandfather' : 'Grandmother',
                'child-child' => $isMale ? 'Grandson' : 'Granddaughter',
                'parent-child' => $isMale ? 'Brother' : 'Sister',
                'parent-sibling' => $isMale ? 'Uncle' : 'Aunt',
                'sibling-child' => $isMale ? 'Nephew' : 'Niece',
                'parent-spouse' => $isMale ? 'Father' : 'Mother',
                'spouse-child' => $isMale ? 'Stepson' : 'Stepdaughter',
                'spouse-parent' => $isMale ? 'Father-in-law' : 'Mother-in-law',
                'spouse-sibling' => $isMale ? 'Brother-in-law' : 'Sister-in-law',
                'sibling-spouse' => $isMale ? 'Brother-in-law' : 'Sister-in-law',
                'child-spouse' => $isMale ? 'Son-in-law' : 'Daughter-in-law',
                default => 'Related (' . $combo . ')',
            };
        }

        if ($count === 3) {
            $combo = implode('-', $steps);
            return match ($combo) {
                'parent-parent-parent' => $isMale ? 'Great-Grandfather' : 'Great-Grandmother',
                'child-child-child' => $isMale ? 'Great-Grandson' : 'Great-Granddaughter',
                'parent-parent-child' => $isMale ? 'Uncle' : 'Aunt',
                'parent-sibling-child' => 'Cousin',
                'parent-parent-sibling' => $isMale ? 'Great-Uncle' : 'Great-Aunt',
                default => 'Distant relative',
            };
        }

        // For longer paths, compute generational distance
        $ups = count(array_filter($steps, fn($s) => $s === 'parent'));
        $downs = count(array_filter($steps, fn($s) => $s === 'child'));

        if ($ups > 0 && $downs > 0) {
            $cousinDegree = min($ups, $downs) - 1;
            $removed = abs($ups - $downs);
            if ($cousinDegree === 0 && $removed > 0) {
                return "Cousin {$removed}x removed";
            }
            $ordinal = $this->ordinal($cousinDegree);
            if ($removed === 0) {
                return "{$ordinal} Cousin";
            }
            return "{$ordinal} Cousin {$removed}x removed";
        }

        return 'Distant relative';
    }

    private function ordinal(int $n): string
    {
        $suffixes = ['th', 'st', 'nd', 'rd'];
        $v = $n % 100;
        return $n . ($suffixes[($v - 20) % 10] ?? $suffixes[$v] ?? $suffixes[0]);
    }
}
