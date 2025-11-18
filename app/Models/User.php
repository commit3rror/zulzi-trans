<?php

namespace App; // Lokasi default model User.php
// Jika Anda punya folder app/Models, ganti namespace menjadi: namespace App\Models;

use App\Models\Pembayaran;
use App\Models\Pemesanan;
use App\Models\Ulasan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Tetap gunakan ini untuk Auth
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Model untuk PENGGUNA (Menggantikan User.php)
 *
 * @property int $id_pengguna
 * @property string $role_pengguna
 * @property string $nama
 * @property string $email
 * @property string $no_telepon
 * @property string $tgl_daftar
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Nama tabel yang digunakan oleh model.
     *
     * @var string
     */
    protected $table = 'pengguna';

    /**
     * Primary key untuk model ini.
     *
     * @var string
     */
    protected $primaryKey = 'id_pengguna';

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'role_pengguna',
        'nama',
        'email',
        'password',
        'no_telepon',
        'tgl_daftar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Tipe data untuk atribut.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tgl_daftar' => 'date',
        'email_verified_at' => 'datetime', // Tetap ada untuk Laravel Auth
    ];

    /**
     * Nonaktifkan timestamps (created_at, updated_at) jika tidak ada di ERD.
     * Jika Anda ingin menggunakannya, hapus baris ini dan tambahkan di migrasi.
     *
     * @var bool
     */
    public $timestamps = false; // ERD tidak menunjukkannya, tapi tgl_daftar ada

    // --- RELASI SESUAI ERD ---

    /**
     * Relasi ke Pemesanan (Pengguna bisa punya banyak Pemesanan)
     */
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan:: class, 'id_pengguna', 'id_pengguna');
    }

    /**
     * Relasi ke Ulasan (Pengguna bisa memberi banyak Ulasan)
     */
    public function ulasan()
    {
        return $this->hasMany(Ulasan::class, 'id_pengguna', 'id_pengguna');
    }

    /**
     * Relasi ke Pembayaran (Admin memverifikasi banyak Pembayaran)
     */
    public function pembayaranDiverifikasi()
    {
        return $this->hasMany(Pembayaran::class, 'id_admin', 'id_pengguna');
    }
}