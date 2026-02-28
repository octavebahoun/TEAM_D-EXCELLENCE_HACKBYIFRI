<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'nom' => 'ADMIN',
            'prenom' => 'Super',
            'email' => 'admin@academix.com',
            'password' => Hash::make('admin2026'),
            'is_active' => true,
        ]);
        Admin::create([
            'nom' => 'BIAOU',
            'prenom' => 'Hana',
            'email' => 'kavt@academix.com',
            'password' => Hash::make('kavt2026'),
            'is_active' => true,
        ]);
    }
}
