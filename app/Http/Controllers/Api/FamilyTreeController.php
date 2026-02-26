<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FamilyTree;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class FamilyTreeController extends Controller
{
    /**
     * Browse public trees (no auth required).
     */
    public function publicIndex(Request $request)
    {
        $query = FamilyTree::where('privacy', 'public')
            ->with('owner:id,name')
            ->withCount('persons');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $trees = $query->latest()->paginate(20);

        return response()->json($trees);
    }

    /**
     * View a single public tree (no auth required).
     */
    public function publicShow(FamilyTree $familyTree)
    {
        if (!$familyTree->isPublic()) {
            return response()->json(['message' => 'This tree is not public'], 403);
        }

        $familyTree->load([
            'owner:id,name',
            'persons' => fn($q) => $q->withCount('media'),
            'relationships.person1:id,first_name,last_name,gender',
            'relationships.person2:id,first_name,last_name,gender',
        ]);
        $familyTree->loadCount('persons');

        return response()->json($familyTree);
    }

    public function index(Request $request)
    {
        $trees = $request->user()->allAccessibleTrees()
            ->with('owner:id,name')
            ->withCount('persons')
            ->latest()
            ->paginate(20);

        return response()->json($trees);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'privacy' => 'in:public,private,shared',
        ]);

        $tree = FamilyTree::create([
            ...$validated,
            'owner_id' => $request->user()->id,
        ]);

        ActivityLog::log($tree->id, $request->user()->id, 'created', 'FamilyTree', $tree->id, null, $tree->toArray(), 'Created family tree');

        return response()->json($tree, 201);
    }

    public function show(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $familyTree->load([
            'owner:id,name',
            'persons' => fn($q) => $q->withCount('media'),
            'relationships.person1:id,first_name,last_name,gender',
            'relationships.person2:id,first_name,last_name,gender',
        ]);
        $familyTree->loadCount('persons');

        // Include the user's role for this tree
        $user = $request->user();
        $userRole = 'viewer'; // default for public trees
        if ($familyTree->owner_id === $user->id) {
            $userRole = 'owner';
        } else {
            $collab = $familyTree->treeCollaborators()
                ->where('user_id', $user->id)
                ->whereNotNull('accepted_at')
                ->first();
            if ($collab) {
                $userRole = $collab->role;
            }
        }
        $familyTree->setAttribute('user_role', $userRole);

        return response()->json($familyTree);
    }

    public function update(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'privacy' => 'in:public,private,shared',
        ]);

        $old = $familyTree->toArray();
        $familyTree->update($validated);

        ActivityLog::log($familyTree->id, $request->user()->id, 'updated', 'FamilyTree', $familyTree->id, $old, $familyTree->toArray());

        return response()->json($familyTree);
    }

    public function destroy(Request $request, FamilyTree $familyTree)
    {
        if ($familyTree->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the owner can delete a tree'], 403);
        }

        $familyTree->delete();

        return response()->json(['message' => 'Tree deleted']);
    }

    public function statistics(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $persons = $familyTree->persons;
        $relationships = $familyTree->relationships;

        return response()->json([
            'total_persons' => $persons->count(),
            'living' => $persons->where('is_living', true)->count(),
            'deceased' => $persons->where('is_living', false)->count(),
            'male' => $persons->where('gender', 'male')->count(),
            'female' => $persons->where('gender', 'female')->count(),
            'relationships' => $relationships->count(),
            'marriages' => $relationships->where('type', 'spouse')->count(),
            'average_age' => round($persons->where('date_of_birth', '!=', null)->avg('age'), 1),
            'oldest_person' => $persons->sortByDesc('age')->first()?->only(['id', 'first_name', 'last_name', 'age']),
            'youngest_person' => $persons->where('date_of_birth', '!=', null)->sortBy('age')->first()?->only(['id', 'first_name', 'last_name', 'age']),
            'birth_places' => $persons->whereNotNull('birth_place')->groupBy('birth_place')->map->count()->sortDesc()->take(10),
            'occupations' => $persons->whereNotNull('occupation')->groupBy('occupation')->map->count()->sortDesc()->take(10),
        ]);
    }
}
