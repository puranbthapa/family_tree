<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use App\Models\FamilyTree;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class PersonController extends Controller
{
    public function index(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $familyTree->persons()->with('media');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('maiden_name', 'like', "%{$search}%")
                    ->orWhere('nickname', 'like', "%{$search}%")
                    ->orWhere('birth_place', 'like', "%{$search}%")
                    ->orWhere('occupation', 'like', "%{$search}%");
            });
        }

        if ($gender = $request->input('gender')) {
            $query->where('gender', $gender);
        }

        if ($request->boolean('living_only')) {
            $query->where('is_living', true);
        }

        $sortBy = $request->input('sort', 'last_name');
        $sortDir = $request->input('direction', 'asc');
        $query->orderBy($sortBy, $sortDir);

        return response()->json($query->paginate($request->input('per_page', 50)));
    }

    public function store(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'maiden_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'aliases' => 'nullable|string|max:255',
            'gender' => 'in:male,female,other,unknown',
            'date_of_birth' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'birth_latitude' => 'nullable|numeric',
            'birth_longitude' => 'nullable|numeric',
            'date_of_death' => 'nullable|date',
            'death_place' => 'nullable|string|max:255',
            'death_latitude' => 'nullable|numeric',
            'death_longitude' => 'nullable|numeric',
            'is_living' => 'boolean',
            'occupation' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'bio' => 'nullable|string',
            'notes' => 'nullable|string',
            'tree_position_x' => 'nullable|numeric',
            'tree_position_y' => 'nullable|numeric',
        ]);

        $person = $familyTree->persons()->create($validated);

        ActivityLog::log($familyTree->id, $request->user()->id, 'created', 'Person', $person->id, null, $person->toArray(), "Added {$person->full_name}");

        return response()->json($person, 201);
    }

    public function show(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $person->load(['lifeEvents', 'media', 'comments.user']);

        // Get relationships
        $person->parents_list = $person->parents();
        $person->children_list = $person->children();
        $person->spouses_list = $person->spouses();
        $person->siblings_list = $person->siblings();

        return response()->json($person);
    }

    public function update(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'maiden_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'aliases' => 'nullable|string|max:255',
            'gender' => 'in:male,female,other,unknown',
            'date_of_birth' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'birth_latitude' => 'nullable|numeric',
            'birth_longitude' => 'nullable|numeric',
            'date_of_death' => 'nullable|date',
            'death_place' => 'nullable|string|max:255',
            'death_latitude' => 'nullable|numeric',
            'death_longitude' => 'nullable|numeric',
            'is_living' => 'boolean',
            'occupation' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'bio' => 'nullable|string',
            'notes' => 'nullable|string',
            'tree_position_x' => 'nullable|numeric',
            'tree_position_y' => 'nullable|numeric',
        ]);

        $old = $person->toArray();
        $person->update($validated);

        ActivityLog::log($familyTree->id, $request->user()->id, 'updated', 'Person', $person->id, $old, $person->toArray(), "Updated {$person->full_name}");

        return response()->json($person);
    }

    public function destroy(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $name = $person->full_name;
        $person->delete();

        ActivityLog::log($familyTree->id, $request->user()->id, 'deleted', 'Person', $person->id, null, null, "Deleted {$name}");

        return response()->json(['message' => 'Person deleted']);
    }

    public function uploadPhoto(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        // Delete old photo if exists
        if ($person->profile_photo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($person->profile_photo);
        }

        $path = $request->file('photo')->store('profile-photos', 'public');
        $person->update(['profile_photo' => $path]);

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'profile_photo' => $path,
            'url' => asset('storage/' . $path),
        ]);
    }

    public function deletePhoto(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($person->profile_photo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($person->profile_photo);
            $person->update(['profile_photo' => null]);
        }

        return response()->json(['message' => 'Photo removed']);
    }

    public function updatePositions(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'positions' => 'required|array',
            'positions.*.id' => 'required|exists:persons,id',
            'positions.*.x' => 'required|numeric',
            'positions.*.y' => 'required|numeric',
        ]);

        foreach ($validated['positions'] as $pos) {
            Person::where('id', $pos['id'])
                ->where('family_tree_id', $familyTree->id)
                ->update([
                    'tree_position_x' => $pos['x'],
                    'tree_position_y' => $pos['y'],
                ]);
        }

        return response()->json(['message' => 'Positions updated']);
    }

    public function search(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $request->input('q', '');
        $persons = $familyTree->persons()
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                    ->orWhere('last_name', 'like', "%{$query}%")
                    ->orWhere('maiden_name', 'like', "%{$query}%")
                    ->orWhere('nickname', 'like', "%{$query}%");
            })
            ->select('id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'profile_photo')
            ->limit(20)
            ->get();

        return response()->json($persons);
    }

    public function duplicates(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $persons = $familyTree->persons;
        $duplicates = [];

        foreach ($persons as $i => $a) {
            foreach ($persons->slice($i + 1) as $b) {
                $score = 0;
                if (strtolower($a->first_name) === strtolower($b->first_name)) $score += 40;
                if (strtolower($a->last_name) === strtolower($b->last_name)) $score += 30;
                if ($a->date_of_birth && $b->date_of_birth && $a->date_of_birth->eq($b->date_of_birth)) $score += 20;
                if ($a->birth_place && $b->birth_place && strtolower($a->birth_place) === strtolower($b->birth_place)) $score += 10;

                if ($score >= 70) {
                    $duplicates[] = [
                        'person_a' => $a->only(['id', 'first_name', 'last_name', 'date_of_birth', 'birth_place']),
                        'person_b' => $b->only(['id', 'first_name', 'last_name', 'date_of_birth', 'birth_place']),
                        'score' => $score,
                    ];
                }
            }
        }

        return response()->json(collect($duplicates)->sortByDesc('score')->values());
    }
}
