<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\FamilyTree;
use App\Models\Person;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comments = $person->comments()
            ->whereNull('parent_id')
            ->with(['user:id,name', 'replies.user:id,name'])
            ->latest()
            ->paginate(20);

        return response()->json($comments);
    }

    public function store(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $person->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        $comment->load('user:id,name');

        return response()->json($comment, 201);
    }

    public function update(Request $request, FamilyTree $familyTree, Person $person, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'You can only edit your own comments'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $comment->update($validated);

        return response()->json($comment);
    }

    public function destroy(Request $request, FamilyTree $familyTree, Person $person, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id && !$familyTree->isAdmin($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
