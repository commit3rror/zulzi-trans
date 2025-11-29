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
        Schema::create('ulasan', function (Blueprint $table) {
            $table->id('id_ulasan');

            // Foreign Keys (TANPA CONSTRAINT - fleksibel untuk testing)
            // Nanti saat integration dengan pemesanan, tambahkan constraint
            $table->unsignedBigInteger('id_pengguna');
            $table->unsignedBigInteger('id_armada');
            $table->unsignedBigInteger('id_pemesanan');

            // Detail Ulasan
            $table->integer('rating_driver');
            $table->integer('rating_kendaraan');
            $table->integer('rating_pelayanan');
            $table->text('komentar')->nullable();
            $table->text('tanggapan_admin')->nullable();
            $table->boolean('is_displayed')->default(false);
            $table->date('tgl_ulasan');
            $table->timestamps();
            
            // Index untuk performa query
            $table->index('id_pengguna');
            $table->index('id_armada');
            $table->index('id_pemesanan');
            $table->index('is_displayed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ulasan');
    }
};