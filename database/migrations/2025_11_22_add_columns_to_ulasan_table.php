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
        Schema::table('ulasan', function (Blueprint $table) {
            // Tambah kolom jika belum ada
            if (!Schema::hasColumn('ulasan', 'is_displayed')) {
                $table->boolean('is_displayed')->default(false)->after('tanggapan_admin');
            }
            if (!Schema::hasColumn('ulasan', 'tanggapan_admin')) {
                $table->text('tanggapan_admin')->nullable()->after('komentar');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ulasan', function (Blueprint $table) {
            $table->dropColumn(['is_displayed', 'tanggapan_admin']);
        });
    }
};
