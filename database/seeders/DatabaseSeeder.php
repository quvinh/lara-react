<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;

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

        User::create([
            'name' => 'Ngô Quang Vinh',
            'username' => 'admin',
            'email' => 'vinhhp2620@gmail.com',
            'password' => bcrypt('admin123@'),
            'mobile' => '0962334135',
            'address' => 'Hải Phòng'
        ]);
    }
}
