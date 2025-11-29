<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';
    protected $primaryKey = 'id_pembayaran';
    
    // Matikan timestamps otomatis karena tabel tidak punya created_at/updated_at
    public $timestamps = false; 

    // Daftar kolom yang boleh diisi oleh Controller (Mass Assignment)
    protected $fillable = [
        'id_pemesanan',
        'id_admin',
        'tgl_bayar',
        'jumlah_bayar',
        'metode_bayar',
        'jenis_pembayaran',
        'bukti_transfer',
    ];

    // Konversi tipe data otomatis saat diambil dari DB
    protected $casts = [
        'jumlah_bayar' => 'decimal:2',
        'tgl_bayar' => 'date',
    ];

    // --- RELASI ---

    /**
     * Relasi ke tabel Pemesanan
     */
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan', 'id_pemesanan');
    }

    /**
     * Relasi ke tabel User (sebagai Admin)
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'id_admin', 'id_pengguna');
    }

    // --- ACCESSOR (Helper untuk Frontend) ---

    /**
     * Mendapatkan URL lengkap untuk gambar bukti transfer
     * Cara pakai di frontend/controller: $pembayaran->bukti_transfer_url
     */
    public function getBuktiTransferUrlAttribute()
    {
        return $this->bukti_transfer ? asset($this->bukti_transfer) : null;
    }

    /**
     * Mendapatkan status verifikasi (Otomatis cek id_admin)
     * Cara pakai: $pembayaran->status_verifikasi
     */
    public function getStatusVerifikasiAttribute()
    {
        return $this->id_admin ? 'Terverifikasi' : 'Menunggu';
    }
    
    /**
     * Helper format rupiah
     * Cara pakai: $pembayaran->jumlah_bayar_format
     */
    public function getJumlahBayarFormatAttribute()
    {
        return 'Rp ' . number_format($this->jumlah_bayar, 0, ',', '.');
    }
}