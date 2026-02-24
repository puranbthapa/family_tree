<?php

namespace App\Services;

use App\Models\FamilyTree;
use App\Models\Person;
use App\Models\Relationship;
use App\Models\LifeEvent;

class GedcomService
{
    /**
     * Export a family tree to GEDCOM format
     */
    public function export(FamilyTree $tree): string
    {
        $persons = $tree->persons()->with('lifeEvents')->get();
        $relationships = $tree->relationships;

        $lines = [];
        $lines[] = '0 HEAD';
        $lines[] = '1 SOUR FamilyTreeManager';
        $lines[] = '2 VERS 1.0';
        $lines[] = '1 GEDC';
        $lines[] = '2 VERS 5.5.1';
        $lines[] = '2 FORM LINEAGE-LINKED';
        $lines[] = '1 CHAR UTF-8';

        // Export individuals
        foreach ($persons as $person) {
            $lines[] = "0 @I{$person->id}@ INDI";
            $lines[] = "1 NAME {$person->first_name} /{$person->last_name}/";
            if ($person->nickname) {
                $lines[] = "2 NICK {$person->nickname}";
            }
            $lines[] = "1 SEX " . strtoupper(substr($person->gender, 0, 1));

            if ($person->date_of_birth) {
                $lines[] = '1 BIRT';
                $lines[] = '2 DATE ' . $person->date_of_birth->format('d M Y');
                if ($person->birth_place) {
                    $lines[] = "2 PLAC {$person->birth_place}";
                }
            }

            if ($person->date_of_death) {
                $lines[] = '1 DEAT';
                $lines[] = '2 DATE ' . $person->date_of_death->format('d M Y');
                if ($person->death_place) {
                    $lines[] = "2 PLAC {$person->death_place}";
                }
            }

            if ($person->occupation) {
                $lines[] = "1 OCCU {$person->occupation}";
            }
            if ($person->religion) {
                $lines[] = "1 RELI {$person->religion}";
            }
            if ($person->notes) {
                $lines[] = "1 NOTE {$person->notes}";
            }
        }

        // Export families (marriage relationships)
        $familyId = 1;
        $spouseRelationships = $relationships->whereIn('type', ['spouse', 'ex_spouse', 'partner']);
        foreach ($spouseRelationships as $rel) {
            $lines[] = "0 @F{$familyId}@ FAM";
            $lines[] = "1 HUSB @I{$rel->person1_id}@";
            $lines[] = "1 WIFE @I{$rel->person2_id}@";

            if ($rel->start_date) {
                $lines[] = '1 MARR';
                $lines[] = '2 DATE ' . $rel->start_date->format('d M Y');
                if ($rel->start_place) {
                    $lines[] = "2 PLAC {$rel->start_place}";
                }
            }

            if ($rel->type === 'ex_spouse' && $rel->end_date) {
                $lines[] = '1 DIV';
                $lines[] = '2 DATE ' . $rel->end_date->format('d M Y');
            }

            // Find children of this couple
            $children = $relationships->where('type', 'parent_child')
                ->where('person1_id', $rel->person1_id)
                ->whereIn('person2_id',
                    $relationships->where('type', 'parent_child')
                        ->where('person1_id', $rel->person2_id)
                        ->pluck('person2_id')
                );
            foreach ($children as $child) {
                $lines[] = "1 CHIL @I{$child->person2_id}@";
            }

            $familyId++;
        }

        $lines[] = '0 TRLR';

        return implode("\n", $lines);
    }

    /**
     * Import a GEDCOM file into a family tree
     */
    public function import(FamilyTree $tree, string $content): array
    {
        $lines = explode("\n", str_replace("\r\n", "\n", $content));
        $individuals = [];
        $families = [];
        $currentRecord = null;
        $currentSubRecord = null;
        $stats = ['persons' => 0, 'relationships' => 0];

        // Parse GEDCOM
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            preg_match('/^(\d+)\s+(@\w+@\s+)?(\w+)\s?(.*)$/', $line, $matches);
            if (empty($matches)) continue;

            $level = (int)$matches[1];
            $tag = $matches[3];
            $value = $matches[4] ?? '';

            if ($level === 0) {
                if ($tag === 'INDI') {
                    $id = trim($matches[2], '@ ');
                    $currentRecord = ['type' => 'INDI', 'id' => $id, 'data' => []];
                    $individuals[$id] = &$currentRecord['data'];
                } elseif ($tag === 'FAM') {
                    $id = trim($matches[2], '@ ');
                    $currentRecord = ['type' => 'FAM', 'id' => $id, 'data' => []];
                    $families[$id] = &$currentRecord['data'];
                } else {
                    $currentRecord = null;
                }
                $currentSubRecord = null;
                continue;
            }

            if (!$currentRecord) continue;

            if ($level === 1) {
                $currentSubRecord = $tag;
                $currentRecord['data'][$tag] = $value;
            } elseif ($level === 2 && $currentSubRecord) {
                $key = "{$currentSubRecord}_{$tag}";
                $currentRecord['data'][$key] = $value;
            }
        }

        // Create persons
        $idMap = []; // GEDCOM ID -> DB ID
        foreach ($individuals as $gedId => $data) {
            $name = $data['NAME'] ?? 'Unknown';
            preg_match('/^(.*?)\s*\/(.*?)\//', $name, $nameMatch);
            $firstName = trim($nameMatch[1] ?? $name);
            $lastName = trim($nameMatch[2] ?? '');

            $person = Person::create([
                'family_tree_id' => $tree->id,
                'first_name' => $firstName ?: 'Unknown',
                'last_name' => $lastName ?: 'Unknown',
                'nickname' => $data['NICK'] ?? null,
                'gender' => match(strtoupper($data['SEX'] ?? 'U')) {
                    'M' => 'male', 'F' => 'female', default => 'unknown'
                },
                'date_of_birth' => $this->parseGedcomDate($data['BIRT_DATE'] ?? null),
                'birth_place' => $data['BIRT_PLAC'] ?? null,
                'date_of_death' => $this->parseGedcomDate($data['DEAT_DATE'] ?? null),
                'death_place' => $data['DEAT_PLAC'] ?? null,
                'is_living' => !isset($data['DEAT_DATE']),
                'occupation' => $data['OCCU'] ?? null,
                'religion' => $data['RELI'] ?? null,
                'notes' => $data['NOTE'] ?? null,
            ]);

            $idMap[$gedId] = $person->id;
            $stats['persons']++;
        }

        // Create relationships from families
        foreach ($families as $famData) {
            $husbGed = str_replace(['@', 'I'], '', $famData['HUSB'] ?? '');
            $wifeGed = str_replace(['@', 'I'], '', $famData['WIFE'] ?? '');

            $husbId = $idMap["I{$husbGed}"] ?? ($idMap[$husbGed] ?? null);
            $wifeId = $idMap["I{$wifeGed}"] ?? ($idMap[$wifeGed] ?? null);

            if ($husbId && $wifeId) {
                $type = isset($famData['DIV']) ? 'ex_spouse' : 'spouse';
                Relationship::create([
                    'family_tree_id' => $tree->id,
                    'person1_id' => $husbId,
                    'person2_id' => $wifeId,
                    'type' => $type,
                    'start_date' => $this->parseGedcomDate($famData['MARR_DATE'] ?? null),
                    'start_place' => $famData['MARR_PLAC'] ?? null,
                    'end_date' => $this->parseGedcomDate($famData['DIV_DATE'] ?? null),
                ]);
                $stats['relationships']++;
            }

            // Handle children
            foreach ($famData as $key => $value) {
                if (str_starts_with($key, 'CHIL')) {
                    $childGed = str_replace(['@', 'I'], '', $value);
                    $childId = $idMap["I{$childGed}"] ?? ($idMap[$childGed] ?? null);
                    if ($childId) {
                        if ($husbId) {
                            Relationship::firstOrCreate([
                                'family_tree_id' => $tree->id,
                                'person1_id' => $husbId,
                                'person2_id' => $childId,
                                'type' => 'parent_child',
                            ]);
                            $stats['relationships']++;
                        }
                        if ($wifeId) {
                            Relationship::firstOrCreate([
                                'family_tree_id' => $tree->id,
                                'person1_id' => $wifeId,
                                'person2_id' => $childId,
                                'type' => 'parent_child',
                            ]);
                            $stats['relationships']++;
                        }
                    }
                }
            }
        }

        return $stats;
    }

    private function parseGedcomDate(?string $dateStr): ?string
    {
        if (!$dateStr) return null;
        try {
            return \Carbon\Carbon::parse($dateStr)->format('Y-m-d');
        } catch (\Exception) {
            return null;
        }
    }
}
