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
        Schema::create('armada', function (Blueprint $table) {
            $table->id('id_armada');
            $table->string('no_plat')->unique();
            $table->string('jenis_kendaraan');
            $table->string('model');
            $table->string('kapasitas');
            $table->float('harga_sewa_per_hari');
            $table->string('status_ketersediaan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('armada');
    }
};