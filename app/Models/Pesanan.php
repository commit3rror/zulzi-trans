<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model untuk Pesanan
 * Menggantikan model 'Order'
 */
class Pesanan extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan oleh model.
     *
     * @var string
     */
    protected $table = 'pesanan';

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_code',
        'user_id',
        'armada_id',
        'origin_address',
        'destination_address',
        'destination_city',
        'status',
    ];

    /**
     * Relasi ke model User (Customer)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke model Armada
     */
    public function armada()
    {
        return $this->belongsTo(Armada::class, 'armada_id', 'id_armada');
    }
}