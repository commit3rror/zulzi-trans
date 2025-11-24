import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, CreditCard, Upload, ChevronRight, Copy, User, Home, AlertCircle, Car, MessageCircle, RefreshCw, AlertTriangle, XCircle } from 'lucide-react';

const PaymentWizard = ({ orderData, refreshOrder }) => {
    const [screen, setScreen] = useState('invoice'); 
    
    // Form Data
    const [form, setForm] = useState({
        nama_pengirim: '',
        bank_pengirim: '',
        jenis_pembayaran: 'DP', // Default DP sesuai gambar
        bukti_transfer: null
    });
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- LOGIKA STATUS & HARGA ---
    const status = orderData.status_pemesanan; // 'Menunggu', 'Dikonfirmasi', 'Menunggu Verifikasi', 'Pembayaran Ditolak', 'Selesai'
    
    // Hitung Nominal
    const totalTagihan = Number(orderData.total_biaya);
    const nominalBayar = form.jenis_pembayaran === 'DP' ? (totalTagihan * 0.5) : totalTagihan;

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    const adminPhone = "6281234567890"; 
    const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(`Halo Admin, saya ingin diskusi harga untuk Order #${orderData.id_pemesanan}`)}`;

    // --- EFEK OTOMATIS GANTI LAYAR BERDASARKAN STATUS ---
    useEffect(() => {
        if (status === 'Menunggu Verifikasi') {
            setScreen('success');
        } else if (status === 'Pembayaran Ditolak') {
            setScreen('invoice'); // Balik ke invoice tapi dengan alert merah
        } else if (status === 'Selesai' || status === 'Lunas') {
            setScreen('success');
        }
    }, [status]);

    // --- SCREEN 1: INVOICE / STATUS ---
    if (screen === 'invoice') {
        return (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto animate-fade-in-up">
                {/* HEADER STATUS DINAMIS */}
                <div className={`p-4 text-center flex items-center justify-center gap-2 font-bold ${
                    status === 'Dikonfirmasi' ? 'bg-green-50 text-green-700' :
                    status === 'Pembayaran Ditolak' ? 'bg-red-50 text-red-700' :
                    status === 'Menunggu Verifikasi' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-orange-50 text-orange-700'
                }`}>
                    {status === 'Dikonfirmasi' && <><CheckCircle size={18}/> Pesanan Dikonfirmasi - Silakan Bayar</>}
                    {status === 'Pembayaran Ditolak' && <><XCircle size={18}/> Pembayaran Ditolak - Silakan Upload Ulang</>}
                    {status === 'Menunggu Verifikasi' && <><Clock size={18}/> Menunggu Verifikasi Admin</>}
                    {status === 'Menunggu' && <><Clock size={18}/> Menunggu Konfirmasi Admin</>}
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* KIRI: INFO */}
                    <div className="space-y-6">
                        {/* Jika Ditolak, Munculkan Alert */}
                        {status === 'Pembayaran Ditolak' && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
                                <AlertTriangle className="shrink-0 mt-0.5" size={20}/>
                                <div>
                                    <p className="font-bold">Pembayaran Anda Ditolak</p>
                                    <p>Mohon periksa kembali nominal atau bukti transfer Anda, lalu upload ulang.</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-bold text-gray-800 mb-3">Informasi Pemesan</h4>
                            <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2 border border-gray-100">
                                <div className="flex gap-2"><User size={16} className="text-gray-400"/> <span className="font-medium">Zulzi User (Anda)</span></div>
                                <div className="flex gap-2"><Home size={16} className="text-gray-400"/> <span className="truncate">{orderData.lokasi_jemput}</span></div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-gray-800 mb-3">Armada Terpilih</h4>
                            {orderData.armada ? (
                                <div className="border rounded-xl p-3 flex gap-4 items-center">
                                    <div className="w-20 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                        <Car size={32} className="text-gray-400"/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{orderData.armada.nama_armada}</p>
                                        <p className="text-xs text-gray-500">{orderData.armada.no_plat}</p>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                                            {orderData.armada.jenis_kendaraan}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm italic bg-gray-50">
                                    <Car className="mx-auto mb-2 opacity-20" size={24}/>
                                    Armada & Harga akan ditentukan setelah diskusi via WhatsApp.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KANAN: INVOICE & AKSI */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between h-full">
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Ringkasan Biaya</h4>
                            <div className="space-y-3 text-sm mb-6 border-b border-gray-200 pb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Kode Pesanan</span>
                                    <span className="font-mono font-bold">#{orderData.id_pemesanan}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tanggal Layanan</span>
                                    <span className="font-medium">{orderData.tgl_mulai}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-700">Total Tagihan</span>
                                <span className={`font-extrabold text-xl ${totalTagihan > 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                                    {totalTagihan > 0 ? formatRupiah(totalTagihan) : 'Belum Disepakati'}
                                </span>
                            </div>
                        </div>

                        {/* LOGIKA TOMBOL BERDASARKAN STATUS */}
                        <div className="mt-6 space-y-3">
                            
                            {/* KONDISI 1: SUDAH DIKONFIRMASI ATAU DITOLAK (BISA BAYAR) */}
                            {(status === 'Dikonfirmasi' || status === 'Pembayaran Ditolak') && (
                                <button 
                                    onClick={() => {
                                        // Jika ditolak, langsung ke upload ulang (skip pilih metode jika mau, tapi amannya ke methods dulu atau upload)
                                        // Sesuai request "mengisi ulang lagi", kita arahkan ke form upload langsung jika ditolak agar cepat
                                        if(status === 'Pembayaran Ditolak') setScreen('upload');
                                        else setScreen('methods');
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex justify-center items-center gap-2"
                                >
                                    {status === 'Pembayaran Ditolak' ? 'Upload Ulang Bukti' : 'Lanjut Pembayaran'} 
                                    <ChevronRight size={18}/>
                                </button>
                            )}

                            {/* KONDISI 2: MENUNGGU VERIFIKASI (SUDAH UPLOAD) */}
                            {status === 'Menunggu Verifikasi' && (
                                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center text-sm font-bold animate-pulse">
                                    Sedang diverifikasi Admin...
                                </div>
                            )}

                            {/* KONDISI 3: MENUNGGU (AWAL) */}
                            {status === 'Menunggu' && (
                                <>
                                    <button 
                                        onClick={() => window.open(waLink, '_blank')}
                                        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition flex justify-center items-center gap-2"
                                    >
                                        <MessageCircle size={20} />
                                        Diskusi Harga via WhatsApp
                                    </button>
                                </>
                            )}

                            {/* TOMBOL REFRESH SELALU ADA */}
                            <button 
                                onClick={refreshOrder}
                                className="w-full bg-white border border-blue-200 text-blue-600 py-2 rounded-xl font-medium text-sm hover:bg-blue-50 flex justify-center items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Cek Update Status (Refresh)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- SCREEN 2: METODE PEMBAYARAN ---
    if (screen === 'methods') {
        return (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 max-w-3xl mx-auto p-8 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pilih Metode Pembayaran</h3>
                
                <div className="space-y-4 mb-8">
                    <div className="border rounded-2xl p-5 flex items-center justify-between hover:border-blue-500 transition cursor-pointer group bg-white hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">BCA</div>
                            <div>
                                <p className="font-bold text-gray-800">Transfer Bank BCA</p>
                                <p className="text-sm text-gray-500">123-456-7890 a.n Zulzi Trans</p>
                            </div>
                        </div>
                        <Copy size={18} className="text-gray-400 group-hover:text-blue-500"/>
                    </div>
                    
                    <div className="border rounded-2xl p-5 flex items-center justify-between hover:border-blue-500 transition cursor-pointer group bg-white hover:shadow-md">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold text-xs">QRIS</div>
                            <div>
                                <p className="font-bold text-gray-800">Scan QRIS</p>
                                <p className="text-sm text-gray-500">OVO, GoPay, Dana, LinkAja</p>
                            </div>
                        </div>
                        <Copy size={18} className="text-gray-400 group-hover:text-blue-500"/>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setScreen('invoice')} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Kembali</button>
                    <button 
                        onClick={() => setScreen('upload')}
                        className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg"
                    >
                        Lengkapi Pembayaran
                    </button>
                </div>
            </div>
        );
    }

    // --- SCREEN 3: KONFIRMASI / UPLOAD (SESUAI GAMBAR) ---
    if (screen === 'upload') {
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!form.bukti_transfer) return alert("Mohon upload bukti transfer!");

            setIsLoading(true);
            const data = new FormData();
            data.append('id_pemesanan', orderData.id_pemesanan);
            data.append('jumlah_bayar', nominalBayar);
            data.append('nama_pengirim', form.nama_pengirim);
            data.append('bank_pengirim', form.bank_pengirim);
            data.append('jenis_pembayaran', form.jenis_pembayaran);
            data.append('bukti_transfer', form.bukti_transfer);
            // Kirim metode bayar default jika user skip halaman method (kasus ditolak)
            data.append('metode_bayar', 'BCA'); 

            try {
                await axios.post('/api/pembayaran', data);
                refreshOrder(); // Refresh data agar status berubah di parent
                setScreen('success'); 
            } catch (err) {
                console.error(err);
                alert("Gagal upload. Pastikan ukuran file < 5MB.");
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 max-w-xl mx-auto p-8 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Konfirmasi Pembayaran</h3>
                <p className="text-gray-500 mb-6 text-sm">Silakan pilih jenis pembayaran dan upload bukti.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* BOX BIRU MUDA (Jenis Pembayaran & Total) - Sesuai Gambar */}
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <label className="block text-sm font-bold text-blue-900 mb-3">Jenis Pembayaran</label>
                        <div className="flex gap-6 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="jenis_pembayaran" 
                                    value="LUNAS" 
                                    checked={form.jenis_pembayaran === 'LUNAS'} 
                                    onChange={e => setForm({...form, jenis_pembayaran: e.target.value})}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 font-medium">Lunas (Full)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="jenis_pembayaran" 
                                    value="DP" 
                                    checked={form.jenis_pembayaran === 'DP'} 
                                    onChange={e => setForm({...form, jenis_pembayaran: e.target.value})}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 font-medium">DP (50%)</span>
                            </label>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                            <span className="text-sm font-medium text-blue-600">Yang harus dibayar sekarang:</span>
                            <span className="font-extrabold text-xl text-blue-800">{formatRupiah(nominalBayar)}</span>
                        </div>
                    </div>

                    {/* INPUT PENGIRIM (Grid 2 Kolom) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Nama Pengirim</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" 
                                placeholder="Nama Pemilik Rekening"
                                value={form.nama_pengirim}
                                onChange={e => setForm({...form, nama_pengirim: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Bank Pengirim</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" 
                                placeholder="Contoh: BCA / BRI"
                                value={form.bank_pengirim}
                                onChange={e => setForm({...form, bank_pengirim: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* UPLOAD FOTO */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Upload Bukti Transfer</label>
                        <div className={`border-2 border-dashed rounded-xl p-4 text-center relative transition-all h-48 flex flex-col items-center justify-center ${preview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                            {preview ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img src={preview} className="max-h-full max-w-full rounded object-contain" />
                                    <button 
                                        type="button"
                                        onClick={() => { setPreview(null); setForm({...form, bukti_transfer: null}) }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                    >
                                        <AlertCircle size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                                        <Upload size={24}/>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Klik atau Drop File di Sini</span>
                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                                </>
                            )}
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(file){
                                        setForm({...form, bukti_transfer: file});
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* FOOTER BUTTONS */}
                    <div className="flex justify-between items-center pt-2">
                        <button 
                            type="button" 
                            onClick={() => status === 'Pembayaran Ditolak' ? setScreen('invoice') : setScreen('methods')} 
                            className="text-gray-500 font-bold hover:text-gray-700 transition"
                        >
                            Kembali
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 disabled:bg-gray-400 disabled:shadow-none transition-all transform hover:-translate-y-1"
                        >
                            {isLoading ? 'Mengirim...' : 'Kirim Konfirmasi'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // --- SCREEN 4: SELESAI / MENUNGGU VERIFIKASI ---
    if (screen === 'success') {
        return (
            <div className="bg-white rounded-3xl shadow-xl border border-green-100 max-w-md mx-auto p-8 text-center animate-fade-in-up">
                
                {status === 'Menunggu Verifikasi' ? (
                    <>
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Clock className="text-yellow-600 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Menunggu Verifikasi</h3>
                        <p className="text-gray-500 mb-6">
                            Bukti pembayaran Anda telah kami terima. Admin akan segera memverifikasi data Anda.
                            <br/><span className="text-xs text-gray-400">(Estimasi: 10-30 Menit)</span>
                        </p>
                        
                        <div className="bg-yellow-50 p-4 rounded-xl mb-6 border border-yellow-100">
                            <p className="text-xs text-yellow-700 font-semibold">Silakan refresh berkala atau cek dashboard.</p>
                        </div>

                        <button 
                            onClick={refreshOrder} 
                            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition mb-3"
                        >
                            <RefreshCw size={16} className="inline mr-2"/> Cek Status Terbaru
                        </button>
                    </>
                ) : (
                    <>
                        {/* JIKA SUDAH LUNAS / SELESAI */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h3>
                        <p className="text-gray-500 mb-6">
                            Terima kasih, pesanan Anda telah lunas dan armada siap diberangkatkan sesuai jadwal.
                        </p>
                    </>
                )}

                <button 
                    onClick={() => window.location.href = '/'} 
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition"
                >
                    Kembali ke Beranda
                </button>
            </div>
        );
    }
};

export default PaymentWizard;