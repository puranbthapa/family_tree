<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * List all available roles.
     */
    public function index()
    {
        return response()->json(Role::withCount('users')->get());
    }

    /**
     * List all users with their roles (admin only).
     */
    public function users(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            $roleName = $request->input('role');
            $query->whereHas('roles', fn($q) => $q->where('name', $roleName));
        }

        $users = $query->orderBy('name')->paginate(20);

        return response()->json($users);
    }

    /**
     * Assign roles to a user.
     */
    public function assignRoles(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        // Prevent removing your own admin role
        if ($request->user()->id === $user->id && !in_array('admin', $validated['roles'])) {
            if ($user->hasRole('admin')) {
                return response()->json([
                    'message' => 'You cannot remove your own admin role.',
                ], 422);
            }
        }

        $user->syncRoles($validated['roles']);
        $user->load('roles');

        return response()->json([
            'message' => 'Roles updated successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Remove a specific role from a user.
     */
    public function removeRole(Request $request, User $user, Role $role)
    {
        // Prevent removing your own admin role
        if ($request->user()->id === $user->id && $role->name === 'admin') {
            return response()->json([
                'message' => 'You cannot remove your own admin role.',
            ], 422);
        }

        $user->removeRole($role->name);
        $user->load('roles');

        return response()->json([
            'message' => 'Role removed successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Create a new role (super admin feature).
     */
    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:roles,name|alpha_dash',
            'display_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $role = Role::create($validated);

        return response()->json($role, 201);
    }

    /**
     * Delete a role (cannot delete built-in roles).
     */
    public function destroyRole(Role $role)
    {
        $protected = ['admin', 'moderator', 'user'];

        if (in_array($role->name, $protected)) {
            return response()->json([
                'message' => 'Cannot delete built-in role.',
            ], 422);
        }

        $role->users()->detach();
        $role->delete();

        return response()->json(['message' => 'Role deleted.']);
    }
}
