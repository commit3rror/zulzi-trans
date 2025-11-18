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
        Schema::create('pemesanan', function (Blueprint $table) {
            $table->id('id_pemesanan');
            
            // Foreign Keys
            $table->foreignId('id_pengguna')->constrained('user', 'id_pengguna')->onDelete('cascade');
            $table->foreignId('id_armada')->nullable()->constrained('armada', 'id_armada')->onDelete('set null');
            $table->foreignId('id_layanan')->constrained('layanan', 'id_layanan')->onDelete('restrict');
            $table->foreignId('id_supir')->nullable()->constrained('supir', 'id_supir')->onDelete('set null');

            // Detail Pemesanan
            $table->date('tgl_pesan');
            $table->date('tgl_mulai');
            $table->date('tgl_selesai');
            $table->string('lokasi_jemput');
            $table->string('lokasi_tujuan');
            $table->float('total_biaya');
            $table->string('status_pemesanan', 20);

            // Kolom Opsional (nullable)
            $table->string('deskripsi_barang')->nullable();
            $table->float('est_berat_ton')->nullable();
            $table->string('foto_barang')->nullable();
            $table->integer('jumlah_orang')->nullable();
            $table->integer('lama_rental')->nullable();
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