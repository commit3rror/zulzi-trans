<?php

namespace App\Models;

use App\User; // Asumsi model User ada di namespace App
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

    /**
     * Atribut yang dapat diisi secara massal (termasuk kolom baru).
     */
    protected $fillable = [
        'id_pengguna',
        'id_armada',
        'id_layanan',
        'id_supir',
        'tgl_pesan',
        'tgl_mulai',
        'tgl_selesai',
        'lokasi_jemput',
        'lokasi_tujuan',
        'total_biaya',
        'status_pemesanan',
        'deskripsi_barang',
        'est_berat_ton',
        'foto_barang', // Untuk semua file upload
        'jumlah_orang',
        'lama_rental',
        'jenis_sampah', // Kolom baru dari Form Sampah
        'perkiraan_volume', // Kolom baru dari Form Sampah
        'catatan', // Dari Form Rental
    ];

    /**
     * Tipe data untuk atribut.
     */
    protected $casts = [
        'tgl_pesan' => 'date',
        'tgl_mulai' => 'date',
        'tgl_selesai' => 'date',
        'total_biaya' => 'float',
        'est_berat_ton' => 'float',
        'jumlah_orang' => 'integer',
        'lama_rental' => 'integer',
    ];

    public $timestamps = false; // Sesuai ERD

    // --- RELASI SESUAI ERD ---

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