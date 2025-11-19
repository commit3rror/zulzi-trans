<?php

namespace App\Models; // <-- PERBAIKAN: Namespace harus App\Models

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'user'; // Pastikan nama tabel sesuai migrasi (biasanya 'users' atau 'user')
    protected $primaryKey = 'id_pengguna';

    protected $fillable = [
        'role_pengguna',
        'nama',
        'email',
        'password',
        'no_telepon',
        'tgl_daftar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'tgl_daftar' => 'date',
        'email_verified_at' => 'datetime',
    ];

    public $timestamps = false;

    // --- RELASI ---
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_pengguna', 'id_pengguna');
    }

    public function ulasan()
    {
        return $this->hasMany(Ulasan::class, 'id_pengguna', 'id_pengguna');
    }
}