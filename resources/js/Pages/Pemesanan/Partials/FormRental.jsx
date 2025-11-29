import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Truck, User, FileText } from 'lucide-react';

const FormRental = ({ onBack, onSuccess }) => {
    // State untuk menampung semua input form
    const [formData, setFormData] = useState({
        layanan: 'rental',
        id_armada: '',
        tgl_mulai: '',
        lama_rental: 1,
        opsi_supir: 'with_driver',
        catatan: '',
        lokasi_jemput: 'Cengkareng, Jakarta Barat',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // --- PERBAIKAN UTAMA: TIDAK ADA LAGI USE EFFECT UNTUK MEMANGGIL API ---

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Pastikan input angka tetap menjadi tipe number
        const normalized = (type === 'number') ? (value === '' ? '' : Number(value)) : value;
        
        setFormData(prev => ({ ...prev, [name]: normalized }));
        
        // Hapus pesan error saat user mulai mengetik ulang
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // Siapkan data untuk dikirim ke Backend
            const data = new FormData();
            data.append('layanan', formData.layanan);
            data.append('id_armada', formData.id_armada ?? '');
            data.append('tgl_mulai', formData.tgl_mulai);
            data.append('lama_rental', formData.lama_rental ?? '');
            data.append('opsi_supir', formData.opsi_supir ?? '');
            data.append('catatan', formData.catatan ?? '');
            data.append('lokasi_jemput', formData.lokasi_jemput ?? '');
            
            // Isi nilai default untuk field yang tidak dipakai di form ini (agar validasi backend aman)
            data.append('lokasi_tujuan', '-');
            data.append('deskripsi_barang', '-');
            data.append('est_berat_ton', 0);

            // Kirim ke API
            const response = await axios.post('/api/pemesanan', data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            
            // Jika sukses, panggil fungsi onSuccess dari parent (Index.jsx)
            if (onSuccess) {
                onSuccess(response.data.data);
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    // Error Validasi (Misal: Tanggal kosong)
                    setErrors(error.response.data.errors || {});
                } else if (error.response.status === 401) {
                    alert('Anda harus login terlebih dahulu!');
                    window.location.href = '/login';
                } else {
                    // Error Server (Misal: Database mati)
                    alert(`Gagal: ${error.response.data.message || 'Terjadi kesalahan server'}`);
                }
            } else {
                alert('Tidak dapat terhubung ke server.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Helper untuk styling input biar rapi
    const inputStyle = (fieldName) =>
        `w-full pl-10 p-3 border rounded-xl focus:ring-2 outline-none transition ${
            errors[fieldName] ? 'border-red-500' : 'border-gray-200 focus:ring-blue-500'
        }`;

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                
                {/* Header Form */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-blue-900">Form Rental Mobil</h3>
                        <p className="text-sm text-gray-500">Isi detail penyewaan kendaraan Anda</p>
                    </div>
                    <button 
                        onClick={onBack} 
                        className="text-sm font-semibold text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                    >
                        Ubah Layanan
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* --- BAGIAN UTAMA: PILIH ARMADA (KEMBALI KE HARDCODE) --- */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Armada</label>
                        <div className="relative">
                            <Truck className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select
                                name="id_armada"
                                value={formData.id_armada}
                                onChange={handleChange}
                                className={inputStyle('id_armada') + ' bg-gray-50'}
                            >
                                <option value="">Pilih jenis mobil...</option>
                                {/* ID ini HARUS sesuai dengan ID di database (hasil seeding) */}
                                <option value="1">Large (4 Seat)</option>
                                <option value="2">Extra Large (6 Seat)</option>
                            </select>
                        </div>
                        {/* Menampilkan pesan error jika user lupa pilih */}
                        {errors.id_armada && <p className="text-red-500 text-xs mt-1">{errors.id_armada[0]}</p>}
                    </div>
                    {/* ------------------------------------------------------- */}

                    {/* Tanggal & Durasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="date"
                                    name="tgl_mulai"
                                    value={formData.tgl_mulai}
                                    onChange={handleChange}
                                    className={inputStyle('tgl_mulai')}
                                />
                            </div>
                            {errors.tgl_mulai && <p className="text-red-500 text-xs mt-1">{errors.tgl_mulai[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Durasi (Hari)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    name="lama_rental"
                                    min="1"
                                    value={formData.lama_rental}
                                    onChange={handleChange}
                                    className={inputStyle('lama_rental')}
                                />
                            </div>
                            {errors.lama_rental && <p className="text-red-500 text-xs mt-1">{errors.lama_rental[0]}</p>}
                        </div>
                    </div>

                    {/* Opsi Supir & Lokasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Layanan Supir</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select
                                    name="opsi_supir"
                                    value={formData.opsi_supir}
                                    onChange={handleChange}
                                    className={inputStyle('opsi_supir') + ' bg-white'}
                                >
                                    <option value="with_driver">Dengan Supir</option>
                                    <option value="lepas_kunci">Lepas Kunci</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi Jemput</label>
                            <input
                                type="text"
                                name="lokasi_jemput"
                                value={formData.lokasi_jemput}
                                onChange={handleChange}
                                className={inputStyle('lokasi_jemput')}
                                placeholder="Alamat lengkap..."
                            />
                            {errors.lokasi_jemput && <p className="text-red-500 text-xs mt-1">{errors.lokasi_jemput[0]}</p>}
                        </div>
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Tambahan</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                            <textarea
                                rows="3"
                                name="catatan"
                                value={formData.catatan}
                                onChange={handleChange}
                                className={inputStyle('catatan')}
                                placeholder="Contoh: Jemput di lobby hotel..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-1 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Memproses...' : 'Lanjut Pembayaran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormRental;