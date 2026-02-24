<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Relationship;
use App\Models\FamilyTree;
use App\Models\ActivityLog;
use App\Services\RelationshipCalculator;
use Illuminate\Http\Request;

class RelationshipController extends Controller
{
    public function index(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $relationships = $familyTree->relationships()
            ->with(['person1:id,first_name,last_name,gender', 'person2:id,first_name,last_name,gender'])
            ->get();

        return response()->json($relationships);
    }

    public function store(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'person1_id' => 'required|exists:persons,id',
            'person2_id' => 'required|exists:persons,id|different:person1_id',
            'type' => 'required|in:parent_child,spouse,ex_spouse,partner,sibling,half_sibling,step_parent_child,adoptive_parent_child,guardian',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'start_place' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $relationship = $familyTree->relationships()->create($validated);
        $relationship->load(['person1', 'person2']);

        ActivityLog::log(
            $familyTree->id, $request->user()->id, 'created', 'Relationship', $relationship->id,
            null, $relationship->toArray(),
            "Created {$relationship->type} relationship between {$relationship->person1->full_name} and {$relationship->person2->full_name}"
        );

        return response()->json($relationship, 201);
    }

    public function update(Request $request, FamilyTree $familyTree, Relationship $relationship)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'sometimes|in:parent_child,spouse,ex_spouse,partner,sibling,half_sibling,step_parent_child,adoptive_parent_child,guardian',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'start_place' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $old = $relationship->toArray();
        $relationship->update($validated);

        ActivityLog::log($familyTree->id, $request->user()->id, 'updated', 'Relationship', $relationship->id, $old, $relationship->toArray());

        return response()->json($relationship);
    }

    public function destroy(Request $request, FamilyTree $familyTree, Relationship $relationship)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $relationship->delete();

        ActivityLog::log($familyTree->id, $request->user()->id, 'deleted', 'Relationship', $relationship->id);

        return response()->json(['message' => 'Relationship deleted']);
    }

    public function calculate(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'person1_id' => 'required|exists:persons,id',
            'person2_id' => 'required|exists:persons,id',
        ]);

        $person1 = $familyTree->persons()->findOrFail($validated['person1_id']);
        $person2 = $familyTree->persons()->findOrFail($validated['person2_id']);

        $calculator = new RelationshipCalculator();
        $result = $calculator->calculate($person1, $person2);

        return response()->json([
            'person1' => $person1->only(['id', 'first_name', 'last_name']),
            'person2' => $person2->only(['id', 'first_name', 'last_name']),
            'relationship' => $result,
        ]);
    }
}
