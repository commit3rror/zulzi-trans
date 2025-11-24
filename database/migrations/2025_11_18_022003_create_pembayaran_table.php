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
            $table->id('id_pembayaran'); // Primary Key

            // Foreign Keys
            $table->foreignId('id_pemesanan')
                  ->constrained('pemesanan', 'id_pemesanan')
                  ->onDelete('cascade');

            $table->foreignId('id_admin')
                  ->nullable() // Boleh kosong (sebelum diverifikasi)
                  ->constrained('user', 'id_pengguna')
                  ->onDelete('set null');

            // Detail Pembayaran
            $table->date('tgl_bayar');
            $table->double('jumlah_bayar', 15, 2);
            
            // PERUBAHAN: Menggunakan STRING agar fleksibel menampung info bank pengirim
            $table->string('metode_bayar'); 
            $table->string('jenis_pembayaran'); 
            
            $table->string('bukti_transfer', 255)->nullable();
            
            // Tidak menggunakan $table->timestamps() karena di model kamu dimatikan
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