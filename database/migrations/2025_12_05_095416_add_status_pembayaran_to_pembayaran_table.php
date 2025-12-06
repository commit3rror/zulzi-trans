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
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->enum('status_pembayaran', ['Pending', 'Verified', 'Rejected'])
                  ->default('Pending')
                  ->after('bukti_transfer')
                  ->comment('Status: Pending (menunggu verifikasi), Verified (disetujui), Rejected (ditolak)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->dropColumn('status_pembayaran');
        });
    }
};
