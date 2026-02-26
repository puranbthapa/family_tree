<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\FamilyTree;
use App\Models\Person;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Dashboard overview statistics.
     */
    public function dashboard()
    {
        $totalUsers = User::count();
        $totalTrees = FamilyTree::count();
        $totalPersons = Person::count();
        $totalActivity = ActivityLog::count();

        // New users this month
        $newUsersThisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();
        $newUsersLastMonth = User::whereBetween('created_at', [
            now()->subMonth()->startOfMonth(),
            now()->subMonth()->endOfMonth(),
        ])->count();

        // New trees this month
        $newTreesThisMonth = FamilyTree::where('created_at', '>=', now()->startOfMonth())->count();

        // Users by role
        $usersByRole = Role::withCount('users')->get()->map(fn($r) => [
            'name' => $r->name,
            'display_name' => $r->display_name,
            'count' => $r->users_count,
        ]);

        // Recent registrations (last 7 days grouped by date)
        $recentRegistrations = User::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Trees by privacy
        $treesByPrivacy = FamilyTree::selectRaw('privacy, COUNT(*) as count')
            ->groupBy('privacy')
            ->pluck('count', 'privacy');

        // Top trees by person count
        $topTrees = FamilyTree::withCount('persons')
            ->with('owner:id,name,email')
            ->orderByDesc('persons_count')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'owner' => $t->owner->name ?? 'Unknown',
                'persons_count' => $t->persons_count,
                'created_at' => $t->created_at,
            ]);

        // Recent activity
        $recentActivity = ActivityLog::with('user:id,name')
            ->latest()
            ->limit(10)
            ->get();

        // Most active users
        $activeUsers = User::withCount(['ownedTrees'])
            ->orderByDesc('owned_trees_count')
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_trees' => $totalTrees,
                'total_persons' => $totalPersons,
                'total_activity' => $totalActivity,
                'new_users_this_month' => $newUsersThisMonth,
                'new_users_last_month' => $newUsersLastMonth,
                'new_trees_this_month' => $newTreesThisMonth,
            ],
            'users_by_role' => $usersByRole,
            'recent_registrations' => $recentRegistrations,
            'trees_by_privacy' => $treesByPrivacy,
            'top_trees' => $topTrees,
            'recent_activity' => $recentActivity,
            'active_users' => $activeUsers,
        ]);
    }

    /**
     * List all users with detailed info.
     */
    public function users(Request $request)
    {
        $query = User::with('roles')->withCount('ownedTrees');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->whereHas('roles', fn($q) => $q->where('name', $role));
        }

        if ($request->input('sort') === 'oldest') {
            $query->orderBy('created_at', 'asc');
        } elseif ($request->input('sort') === 'name') {
            $query->orderBy('name');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return response()->json($query->paginate(15));
    }

    /**
     * Get single user details.
     */
    public function showUser(User $user)
    {
        $user->load('roles');
        $user->loadCount('ownedTrees');

        $recentActivity = ActivityLog::where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get();

        $trees = FamilyTree::where('owner_id', $user->id)
            ->withCount('persons')
            ->get();

        return response()->json([
            'user' => $user,
            'recent_activity' => $recentActivity,
            'trees' => $trees,
        ]);
    }

    /**
     * Update user details (admin).
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        $user->load('roles');

        return response()->json(['message' => 'User updated.', 'user' => $user]);
    }

    /**
     * Delete a user (cannot delete self).
     */
    public function deleteUser(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Cannot delete your own account.'], 422);
        }

        // Delete user's trees 
        $user->ownedTrees()->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted.']);
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

        if ($request->user()->id === $user->id && !in_array('admin', $validated['roles'])) {
            if ($user->hasRole('admin')) {
                return response()->json(['message' => 'You cannot remove your own admin role.'], 422);
            }
        }

        $user->syncRoles($validated['roles']);
        $user->load('roles');

        return response()->json(['message' => 'Roles updated.', 'user' => $user]);
    }

    /**
     * List all family trees (admin view).
     */
    public function trees(Request $request)
    {
        $query = FamilyTree::with('owner:id,name,email')->withCount('persons');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('owner', fn($oq) => $oq->where('name', 'like', "%{$search}%"));
            });
        }

        if ($privacy = $request->input('privacy')) {
            $query->where('privacy', $privacy);
        }

        if ($request->input('sort') === 'members') {
            $query->orderByDesc('persons_count');
        } elseif ($request->input('sort') === 'oldest') {
            $query->orderBy('created_at');
        } elseif ($request->input('sort') === 'name') {
            $query->orderBy('name');
        } else {
            $query->orderByDesc('created_at');
        }

        return response()->json($query->paginate(15));
    }

    /**
     * Delete a tree (admin override).
     */
    public function deleteTree(FamilyTree $familyTree)
    {
        $familyTree->delete();
        return response()->json(['message' => 'Tree deleted.']);
    }

    /**
     * Global activity log.
     */
    public function activityLog(Request $request)
    {
        $query = ActivityLog::with(['user:id,name', 'familyTree:id,name']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('subject_type', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($uq) => $uq->where('name', 'like', "%{$search}%"));
            });
        }

        if ($action = $request->input('action')) {
            $query->where('action', $action);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        return response()->json($query->latest()->paginate(20));
    }

    /**
     * Roles management - list all with users count.
     */
    public function roles()
    {
        return response()->json(Role::withCount('users')->orderBy('name')->get());
    }

    /**
     * Create a role.
     */
    public function createRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:roles,name|alpha_dash',
            'display_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        return response()->json(Role::create($validated), 201);
    }

    /**
     * Update a role.
     */
    public function updateRole(Request $request, Role $role)
    {
        $validated = $request->validate([
            'display_name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $role->update($validated);
        return response()->json($role);
    }

    /**
     * Delete a role.
     */
    public function deleteRole(Role $role)
    {
        if (in_array($role->name, ['admin', 'moderator', 'user'])) {
            return response()->json(['message' => 'Cannot delete built-in role.'], 422);
        }

        $role->users()->detach();
        $role->delete();

        return response()->json(['message' => 'Role deleted.']);
    }
}
