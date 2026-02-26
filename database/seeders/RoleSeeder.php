<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create default roles
        $admin = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'display_name' => 'Administrator',
                'description' => 'Full system access. Can manage users, roles, and all application settings.',
            ]
        );

        Role::firstOrCreate(
            ['name' => 'moderator'],
            [
                'display_name' => 'Moderator',
                'description' => 'Can moderate content, manage comments, and assist with user issues.',
            ]
        );

        Role::firstOrCreate(
            ['name' => 'user'],
            [
                'display_name' => 'User',
                'description' => 'Standard user. Can create and manage their own family trees.',
            ]
        );

        // Assign admin role to the first user (if exists and has no roles)
        $firstUser = User::first();
        if ($firstUser && $firstUser->roles()->count() === 0) {
            $firstUser->roles()->attach($admin);
        }
    }
}
