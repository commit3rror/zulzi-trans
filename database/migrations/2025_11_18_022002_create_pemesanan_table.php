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
        // Pastikan nama tabel adalah 'pemesanan'
        Schema::create('pemesanan', function (Blueprint $table) {
            $table->id('id_pemesanan');
            
            // Foreign Keys (id_pengguna & id_layanan wajib)
            $table->foreignId('id_pengguna')->constrained('user', 'id_pengguna')->onDelete('cascade');
            $table->foreignId('id_layanan')->constrained('layanan', 'id_layanan')->onDelete('restrict');
            
            // Foreign Keys Opsional
            $table->foreignId('id_armada')->nullable()->constrained('armada', 'id_armada')->onDelete('set null');
            $table->foreignId('id_supir')->nullable()->constrained('supir', 'id_supir')->onDelete('set null');

            // Detail Pemesanan Wajib
            $table->date('tgl_pesan');
            $table->date('tgl_mulai');
            $table->string('lokasi_jemput');
            $table->string('status_pemesanan', 20);
            $table->float('total_biaya')->default(0); 
            
            // Detail Opsional (WAJIB DIBUAT NULLABLE untuk mengatasi error)
            $table->date('tgl_selesai')->nullable();
            $table->string('lokasi_tujuan')->nullable();
            $table->string('deskripsi_barang')->nullable();
            $table->float('est_berat_ton')->nullable();
            $table->string('foto_barang')->nullable(); 
            $table->integer('jumlah_orang')->nullable();
            $table->integer('lama_rental')->nullable();

            // Kolom Tambahan
            $table->string('catatan')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemesanan');
    }
};