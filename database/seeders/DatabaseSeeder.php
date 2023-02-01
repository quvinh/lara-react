<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(50)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $admin = User::create([
            'name' => 'Ngô Quang Vinh',
            'username' => 'admin',
            'email' => 'vinhhp2620@gmail.com',
            'password' => bcrypt('admin123@'),
            'mobile' => '0962334135',
            'address' => 'Hải Phòng'
        ]);

        // Permission
        DB::table('permissions')->insert([
            // Account
            ['name' => 'account.add', 'guard_name' => 'web'],
            ['name' => 'account.edit', 'guard_name' => 'web'],
            ['name' => 'account.delete', 'guard_name' => 'web'],
            ['name' => 'account.view', 'guard_name' => 'web'],
            ['name' => 'account.confirm', 'guard_name' => 'web'],

            // Invoice
            ['name' => 'invoice.add', 'guard_name' => 'web'],
            ['name' => 'invoice.edit', 'guard_name' => 'web'],
            ['name' => 'invoice.delete', 'guard_name' => 'web'],
            ['name' => 'invoice.view', 'guard_name' => 'web'],
            ['name' => 'invoice.confirm', 'guard_name' => 'web'],

            // Log system
            ['name' => 'log.delete', 'guard_name' => 'web'],
            ['name' => 'log.view', 'guard_name' => 'web'],

            // Role
            ['name' => 'role.add', 'guard_name' => 'web'],
            ['name' => 'role.edit', 'guard_name' => 'web'],
            ['name' => 'role.delete', 'guard_name' => 'web'],
            ['name' => 'role.view', 'guard_name' => 'web'],
            ['name' => 'role.confirm', 'guard_name' => 'web'],

            // Company
            ['name' => 'company.add', 'guard_name' => 'web'],
            ['name' => 'company.edit', 'guard_name' => 'web'],
            ['name' => 'company.delete', 'guard_name' => 'web'],
            ['name' => 'company.view', 'guard_name' => 'web'],
            ['name' => 'company.confirm', 'guard_name' => 'web'],
        ]);

        // Role
        $roleAdmin = Role::create(['name' => 'Administrator', 'guard_name' => 'web']);

        // Give permission
        $roleAdmin->givePermissionTo(Permission::all());

        // Assign role
        $admin->assignRole($roleAdmin);
    }
}
