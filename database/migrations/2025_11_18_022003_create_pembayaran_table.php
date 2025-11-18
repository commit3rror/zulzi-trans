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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id('id_pembayaran');
            
            // Foreign Keys
            $table->foreignId('id_pemesanan')->constrained('pemesanan', 'id_pemesanan')->onDelete('cascade');
            $table->foreignId('id_admin')->nullable()->constrained('user', 'id_pengguna')->onDelete('set null'); // Admin adalah Pengguna

            // Detail Pembayaran
            $table->date('tgl_bayar');
            $table->float('jumlah_bayar');
            $table->string('metode_bayar', 20);
            $table->string('jenis_pembayaran', 20);
            $table->string('bukti_transfer')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};