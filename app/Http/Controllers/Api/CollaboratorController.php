<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FamilyTree;
use App\Models\TreeCollaborator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollaboratorController extends Controller
{
    public function index(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $collaborators = $familyTree->treeCollaborators()
            ->with('user:id,name,email')
            ->get();

        return response()->json([
            'owner' => $familyTree->owner->only(['id', 'name', 'email']),
            'collaborators' => $collaborators,
        ]);
    }

    public function invite(Request $request, FamilyTree $familyTree)
    {
        if (!$familyTree->isAdmin($request->user())) {
            return response()->json(['message' => 'Only admins can invite'], 403);
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:viewer,editor,admin',
        ]);

        $email = strtolower($validated['email']);

        // Check if this is the owner's email
        if ($familyTree->owner->email === $email) {
            return response()->json(['message' => 'Cannot invite the owner'], 422);
        }

        $user = \App\Models\User::where('email', $email)->first();

        if ($user) {
            // User exists — invite them directly
            if ($familyTree->owner_id === $user->id) {
                return response()->json(['message' => 'Cannot invite the owner'], 422);
            }

            $existing = TreeCollaborator::where('family_tree_id', $familyTree->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existing) {
                $existing->update([
                    'role' => $validated['role'],
                    'email' => $email,
                    'invited_at' => now(),
                    'invite_token' => Str::random(32),
                ]);
                $collaborator = $existing;
            } else {
                $collaborator = TreeCollaborator::create([
                    'family_tree_id' => $familyTree->id,
                    'user_id' => $user->id,
                    'email' => $email,
                    'role' => $validated['role'],
                    'invited_at' => now(),
                    'invite_token' => Str::random(32),
                ]);
            }
        } else {
            // User does NOT exist — create a pending email-only invite
            $existing = TreeCollaborator::where('family_tree_id', $familyTree->id)
                ->where('email', $email)
                ->whereNull('user_id')
                ->first();

            if ($existing) {
                $existing->update([
                    'role' => $validated['role'],
                    'invited_at' => now(),
                    'invite_token' => Str::random(32),
                ]);
                $collaborator = $existing;
            } else {
                $collaborator = TreeCollaborator::create([
                    'family_tree_id' => $familyTree->id,
                    'user_id' => null,
                    'email' => $email,
                    'role' => $validated['role'],
                    'invited_at' => now(),
                    'invite_token' => Str::random(32),
                ]);
            }
        }

        return response()->json([
            'message' => $user ? 'Invitation sent' : 'Invitation sent! They will get access when they register.',
            'collaborator' => $collaborator->load('user:id,name,email'),
        ]);
    }

    public function acceptInvite(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        $collaborator = TreeCollaborator::where('invite_token', $validated['token'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$collaborator) {
            return response()->json(['message' => 'Invalid or expired invitation'], 404);
        }

        $collaborator->update([
            'accepted_at' => now(),
            'invite_token' => null,
        ]);

        return response()->json([
            'message' => 'Invitation accepted',
            'tree' => $collaborator->familyTree,
        ]);
    }

    public function updateRole(Request $request, FamilyTree $familyTree, TreeCollaborator $collaborator)
    {
        if (!$familyTree->isAdmin($request->user())) {
            return response()->json(['message' => 'Only admins can change roles'], 403);
        }

        $validated = $request->validate([
            'role' => 'required|in:viewer,editor,admin',
        ]);

        $collaborator->update($validated);

        return response()->json($collaborator->load('user:id,name,email'));
    }

    public function remove(Request $request, FamilyTree $familyTree, TreeCollaborator $collaborator)
    {
        if (!$familyTree->isAdmin($request->user())) {
            return response()->json(['message' => 'Only admins can remove collaborators'], 403);
        }

        $collaborator->delete();

        return response()->json(['message' => 'Collaborator removed']);
    }

    public function pendingInvites(Request $request)
    {
        $invites = TreeCollaborator::where('user_id', $request->user()->id)
            ->whereNull('accepted_at')
            ->whereNotNull('invite_token')
            ->with('familyTree:id,name,description')
            ->get();

        return response()->json($invites);
    }
}
