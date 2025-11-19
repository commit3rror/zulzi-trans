<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk PEMESANAN
 */
class Pemesanan extends Model
{
    use HasFactory;

    protected $table = 'pemesanan';
    protected $primaryKey = 'id_pemesanan';

    protected $fillable = [
        'id_pengguna',
        'id_armada',
        'id_layanan',
        'tgl_pesan',
        'tgl_mulai',
        'tgl_selesai',
        'lokasi_jemput',
        'lokasi_tujuan',
        'total_biaya',
        'status_pemesanan',
        'id_supir',
        'deskripsi_barang',
        'est_berat_ton',
        'foto_barang',
        'jumlah_orang',
        'lama_rental',
    ];

    protected $casts = [
        'tgl_pesan' => 'date',
        'tgl_mulai' => 'date',
        'tgl_selesai' => 'date',
        'total_biaya' => 'float',
        'est_berat_ton' => 'float',
        'jumlah_orang' => 'integer',
        'lama_rental' => 'integer',
    ];

    public $timestamps = false;

    // --- RELASI ---

    public function pengguna()
    {
        return $this->belongsTo(User::class, 'id_pengguna', 'id_pengguna');
    }

    public function armada()
    {
        return $this->belongsTo(Armada::class, 'id_armada', 'id_armada');
    }

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id_layanan');
    }

    public function supir()
    {
        return $this->belongsTo(Supir::class, 'id_supir', 'id_supir');
    }

    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_pemesanan', 'id_pemesanan');
    }

    public function ulasan()
    {
        return $this->hasMany(Ulasan::class, 'id_pemesanan', 'id_pemesanan');
    }
}