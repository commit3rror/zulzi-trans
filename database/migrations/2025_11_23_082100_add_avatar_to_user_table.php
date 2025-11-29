<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user', function (Blueprint $table) {
            // Menambahkan kolom 'google_id' untuk OAuth authentication
            $table->string('google_id')->nullable()->unique()->after('email');
            
            // Menambahkan kolom 'avatar'. Karena ini dari Google,
            // kita gunakan 'string' dan 'nullable' (URL bisa kosong jika user login manual)
            $table->string('avatar')->nullable()->after('google_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user', function (Blueprint $table) {
            // Menghapus kolom 'avatar' dan 'google_id' saat di rollback
            $table->dropColumn(['avatar', 'google_id']);
        });
    }
};