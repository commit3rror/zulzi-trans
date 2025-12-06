import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, CreditCard, Upload, ChevronRight, Copy, User, Home, AlertCircle, Car, MessageCircle, RefreshCw, AlertTriangle, XCircle } from 'lucide-react';

const PaymentWizard = ({ orderData, refreshOrder }) => {
    const [screen, setScreen] = useState('invoice'); 
    
    // Form Data - Default DP
    const [form, setForm] = useState({
        jenis_pembayaran: 'DP',
        bukti_transfer: null,
        metode_bayar: 'BCA' // Default BCA
    });
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // State untuk screen methods (dipindahkan ke atas agar tidak melanggar Rules of Hooks)
    const [selectedMethod, setSelectedMethod] = useState('BCA');
    const [copied, setCopied] = useState(false);

    // --- LOGIKA STATUS & HARGA ---
    const status = orderData.status_pemesanan;
    
    // Hitung Nominal
    const totalTagihan = Number(orderData.total_biaya) || 0;
    const nominalDP = Number(orderData.nominal_dp) || 0;
    
    // Cek sudah bayar berapa (dari tabel pembayaran) - HANDLE JIKA BUKAN ARRAY
    const pembayaranList = Array.isArray(orderData.pembayaran) 
        ? orderData.pembayaran 
        : (orderData.pembayaran ? [orderData.pembayaran] : []);
    
    // LOGIKA PEMBAYARAN BERDASARKAN STATUS PEMESANAN:
    // - "Menunggu" / "Dikonfirmasi" / "Pembayaran Ditolak" = Belum ada pembayaran verified (0)
    // - "Menunggu Verifikasi" = Ada pembayaran sedang diverifikasi (belum count)
    // - "DP Dibayar" = DP sudah verified (count DP saja)
    // - "Lunas" / "Selesai" = Semua pembayaran sudah verified
    
    let sudahDibayar = 0;
    
    if (status === 'DP Dibayar') {
        // Hanya hitung DP yang sudah diverifikasi
        sudahDibayar = nominalDP;
    } else if (status === 'Lunas' || status === 'Selesai') {
        // Hitung semua pembayaran
        sudahDibayar = pembayaranList.reduce((sum, p) => sum + Number(p.jumlah_bayar || 0), 0);
        console.log('🔍 DEBUG LUNAS - Pembayaran List:', pembayaranList);
        console.log('🔍 Total dari reduce:', sudahDibayar);
    }
    // Untuk status lainnya, sudahDibayar = 0
    
    const sisaPembayaran = Math.max(0, totalTagihan - sudahDibayar);
    
    // Tentukan nominal yang harus dibayar
    const nominalBayar = form.jenis_pembayaran === 'DP' ? nominalDP : sisaPembayaran;

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    const adminPhone = "6281234567890"; 
    const waLink = `https://wa.me/${adminPhone}?text=${encodeURIComponent(`Halo Admin, saya ingin diskusi harga untuk Order #${orderData.id_pemesanan}`)}`;

    // --- EFEK SET JENIS PEMBAYARAN BERDASARKAN KONDISI ---
    useEffect(() => {
        // LOGIKA:
        // 1. Jika status "DP Dibayar" -> Set ke LUNAS (untuk pelunasan)
        // 2. Jika status "Pembayaran Ditolak" -> Cek pembayaran terakhir, gunakan jenis yang sama
        // 3. Jika status "Dikonfirmasi" -> Default DP (bisa pilih)
        
        if (status === 'DP Dibayar') {
            // DP sudah dibayar, sekarang harus bayar LUNAS
            setForm(prev => ({
                ...prev,
                jenis_pembayaran: 'LUNAS'
            }));
        } else if (status === 'Pembayaran Ditolak') {
            // Gunakan jenis pembayaran yang sama dengan yang ditolak
            const pembayaranTerakhir = pembayaranList[pembayaranList.length - 1];
            if (pembayaranTerakhir) {
                setForm(prev => ({
                    ...prev,
                    jenis_pembayaran: pembayaranTerakhir.jenis_pembayaran
                }));
            }
        } else if (status === 'Dikonfirmasi') {
            // Default DP untuk pembayaran pertama
            setForm(prev => ({
                ...prev,
                jenis_pembayaran: 'DP'
            }));
        }
    }, [status]);

    // --- EFEK OTOMATIS GANTI LAYAR BERDASARKAN STATUS ---
    useEffect(() => {
        // Jika status 'Lunas' atau 'Selesai', otomatis pindah ke layar sukses
        if (status === 'Lunas' || status === 'Selesai') {
            setScreen('success');
        } 
        // Jika status 'Menunggu Verifikasi', tetap di invoice tapi show message
        else if (status === 'Menunggu Verifikasi') {
            setScreen('invoice');
        }
        // Jika status 'Pembayaran Ditolak', user harus melihat invoice lagi
        else if (status === 'Pembayaran Ditolak') {
            setScreen('invoice');
        }
        // Jika status 'Dikonfirmasi' atau 'DP Dibayar', tetap di invoice agar user bisa bayar
        else if (status === 'Dikonfirmasi' || status === 'DP Dibayar') {
            setScreen('invoice');
        }
    }, [status]);

    // --- SCREEN 1: INVOICE / STATUS ---
    if (screen === 'invoice') {
        // Debug: Log status untuk memastikan valuenya
        console.log('Current Status:', status);
        console.log('Order Data:', orderData);
        
        // Tentukan apakah tombol bayar harus muncul
        const showPayButton = status === 'Dikonfirmasi' || status === 'Pembayaran Ditolak';
        
        // Tombol pelunasan hanya muncul jika:
        // 1. Status = "DP Dibayar" DAN
        // 2. Ada pembayaran DP yang sudah diverifikasi (sudahDibayar > 0)
        const showPelunasanButton = status === 'DP Dibayar' && sudahDibayar > 0;
        
        const showDiscussButton = status === 'Menunggu';
        const showVerifyMessage = status === 'Menunggu Verifikasi';
        
        console.log('Show Pay Button:', showPayButton);
        console.log('Show Pelunasan Button:', showPelunasanButton);
        console.log('Show Discuss Button:', showDiscussButton);

        return (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto animate-fade-in-up">
                {/* HEADER STATUS DINAMIS */}
                <div className={`p-4 text-center flex flex-col items-center justify-center gap-1 font-bold ${
                    status === 'Dikonfirmasi' ? 'bg-green-50 text-green-700' :
                    status === 'DP Dibayar' ? 'bg-blue-50 text-blue-700' :
                    status === 'Pembayaran Ditolak' ? 'bg-red-50 text-red-700' :
                    status === 'Menunggu Verifikasi' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-orange-50 text-orange-700'
                }`}>
                    {status === 'Dikonfirmasi' && (
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18}/> Pesanan Dikonfirmasi - Silakan Bayar
                        </div>
                    )}
                    {status === 'DP Dibayar' && (
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18}/> DP Sudah Dibayar - Silakan Lunasi
                        </div>
                    )}
                    {status === 'Pembayaran Ditolak' && (
                        <div className="flex items-center gap-2">
                            <XCircle size={18}/> Pembayaran Ditolak - Silakan Upload Ulang
                        </div>
                    )}
                    {status === 'Menunggu Verifikasi' && (
                        <>
                            <div className="flex items-center gap-2">
                                <Clock size={18}/> Sedang Diverifikasi Admin
                            </div>
                            {pembayaranList.length > 0 && (
                                <div className="text-xs font-normal opacity-90 mt-1">
                                    Pembayaran {pembayaranList[pembayaranList.length - 1].jenis_pembayaran} sebesar {formatRupiah(pembayaranList[pembayaranList.length - 1].jumlah_bayar)}
                                </div>
                            )}
                        </>
                    )}
                    {status === 'Menunggu' && (
                        <>
                            <div className="flex items-center gap-2">
                                <Clock size={18}/> Menunggu Konfirmasi Pemesanan
                            </div>
                            <div className="text-xs font-normal opacity-90 mt-1">
                                Admin sedang memeriksa detail pesanan Anda
                            </div>
                        </>
                    )}
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

                        {/* TAMBAHAN: Informasi Supir */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-3">Supir</h4>
                            {orderData.supir ? (
                                <div className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                            {orderData.supir.nama.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{orderData.supir.nama}</p>
                                            <p className="text-xs text-gray-500">{orderData.supir.no_telepon}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 text-sm italic bg-gray-50">
                                    <User className="mx-auto mb-1 opacity-20" size={20}/>
                                    Supir akan ditentukan oleh Admin.
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

                        {/* LOGIKA TOMBOL */}
                        <div className="mt-6 space-y-3">
                            
                            {/* 1. TOMBOL LANJUT BAYAR (Muncul jika Dikonfirmasi/Ditolak) */}
                            {showPayButton && (
                                <button 
                                    onClick={() => {
                                        if(status === 'Pembayaran Ditolak') {
                                            // Upload ulang dengan jenis pembayaran yang sama
                                            setScreen('upload');
                                        } else {
                                            // Pembayaran baru, mulai dari pilih metode
                                            setScreen('methods');
                                        }
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex justify-center items-center gap-2"
                                >
                                    {status === 'Pembayaran Ditolak' ? 'Upload Ulang Bukti' : 'Lanjut Pembayaran'} 
                                    <ChevronRight size={18}/>
                                </button>
                            )}

                            {/* 1B. TOMBOL PELUNASAN (Khusus untuk DP Dibayar) */}
                            {showPelunasanButton && (
                                <div className="space-y-4">
                                    {/* Info Box DP Dibayar */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            DP Anda telah diverifikasi!
                                        </p>
                                        <div className="text-xs text-blue-700 space-y-1">
                                            <div className="flex justify-between">
                                                <span>DP yang sudah dibayar:</span>
                                                <span className="font-bold">{formatRupiah(sudahDibayar)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-orange-600">
                                                <span>Sisa yang harus dibayar:</span>
                                                <span className="text-lg">{formatRupiah(sisaPembayaran)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Button Bayar Pelunasan */}
                                    <button 
                                        onClick={() => setScreen('methods')}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold shadow-lg transition flex justify-center items-center gap-2 text-lg"
                                    >
                                        <CreditCard size={20}/>
                                        Bayar Sisa Pelunasan ({formatRupiah(sisaPembayaran)})
                                    </button>
                                </div>
                            )}

                            {/* 2. PESAN MENUNGGU VERIFIKASI */}
                            {showVerifyMessage && (
                                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center text-sm font-bold animate-pulse">
                                    Sedang diverifikasi Admin...
                                </div>
                            )}

                            {/* 3. TOMBOL DISKUSI WA (Muncul jika Menunggu) */}
                            {showDiscussButton && (
                                <button 
                                    onClick={() => window.open(waLink, '_blank')}
                                    className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition flex justify-center items-center gap-2"
                                >
                                    <MessageCircle size={20} />
                                    Diskusi Harga via WhatsApp
                                </button>
                            )}

                            {/* 4. TOMBOL REFRESH (Selalu muncul kecuali Lunas) */}
                            {status !== 'Lunas' && status !== 'Selesai' && (
                                <button 
                                    onClick={refreshOrder}
                                    className="w-full bg-white border border-blue-200 text-blue-600 py-2 rounded-xl font-medium text-sm hover:bg-blue-50 flex justify-center items-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    Cek Update Status (Refresh)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- SCREEN 2: METODE PEMBAYARAN ---
    if (screen === 'methods') {
        const rekening_bca = '1234567890';

        const handleCopyRekening = () => {
            navigator.clipboard.writeText(rekening_bca);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 max-w-4xl mx-auto p-8 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Pilih Metode Pembayaran</h3>
                <p className="text-gray-500 text-center mb-8 text-sm">Pilih salah satu metode di bawah untuk melanjutkan</p>
                
                {/* TAB SELECTOR */}
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setSelectedMethod('BCA')}
                        className={`flex-1 py-4 rounded-xl font-bold transition border-2 ${
                            selectedMethod === 'BCA' 
                            ? 'bg-blue-50 border-blue-500 text-blue-700' 
                            : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">BCA</div>
                            Transfer Bank
                        </div>
                    </button>
                    <button 
                        onClick={() => setSelectedMethod('QRIS')}
                        className={`flex-1 py-4 rounded-xl font-bold transition border-2 ${
                            selectedMethod === 'QRIS' 
                            ? 'bg-green-50 border-green-500 text-green-700' 
                            : 'bg-white border-gray-200 text-gray-500 hover:border-green-300'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">QR</div>
                            Scan QRIS
                        </div>
                    </button>
                </div>

                {/* KONTEN METODE PEMBAYARAN */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 min-h-[300px] border border-gray-100">
                    {selectedMethod === 'BCA' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-blue-700 font-extrabold text-2xl">BCA</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mb-2">Transfer ke Rekening BCA</h4>
                                <p className="text-sm text-gray-500">Silakan transfer ke nomor rekening di bawah</p>
                            </div>

                            <div className="bg-white rounded-xl p-5 border-2 border-blue-200">
                                <p className="text-xs text-gray-500 mb-1 text-center">Nomor Rekening</p>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-2xl font-mono font-bold text-blue-800 tracking-wider">{rekening_bca}</span>
                                    <button 
                                        onClick={handleCopyRekening}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                    >
                                        {copied ? <CheckCircle size={16}/> : <Copy size={16}/>}
                                        {copied ? 'Tersalin!' : 'Salin'}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-3 text-center">a.n <span className="font-bold">PT Zulzi Trans Indonesia</span></p>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-xs font-bold text-blue-900 mb-2">💡 Cara Transfer:</p>
                                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                                    <li>Buka aplikasi mobile banking atau ATM</li>
                                    <li>Pilih menu Transfer ke BCA</li>
                                    <li>Masukkan nomor rekening di atas</li>
                                    <li>Masukkan nominal: <span className="font-bold">{formatRupiah(nominalBayar)}</span></li>
                                    <li>Screenshot bukti transfer untuk diupload</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {selectedMethod === 'QRIS' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center">
                                <h4 className="font-bold text-gray-800 text-lg mb-2">Scan QR Code</h4>
                                <p className="text-sm text-gray-500">Gunakan aplikasi e-wallet Anda untuk scan</p>
                            </div>

                            {/* QR CODE IMAGE */}
                            <div className="flex justify-center">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200">
                                    {/* Placeholder QR - Ganti dengan gambar QR asli */}
                                    <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                                        <div className="text-center">
                                            <div className="text-6xl mb-2">📱</div>
                                            <p className="text-sm text-gray-500 font-medium">QR Code QRIS</p>
                                            <p className="text-xs text-gray-400 mt-1">Zulzi Trans</p>
                                        </div>
                                        {/* TODO: Ganti dengan <img src="/images/qris-code.png" /> */}
                                    </div>
                                    <p className="text-center mt-4 text-xs text-gray-600">Nominal: <span className="font-bold text-green-700">{formatRupiah(nominalBayar)}</span></p>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                <p className="text-xs font-bold text-green-900 mb-2">✅ Aplikasi yang Didukung:</p>
                                <div className="flex gap-3 flex-wrap justify-center">
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border">GoPay</span>
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border">OVO</span>
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border">DANA</span>
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border">LinkAja</span>
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border">ShopeePay</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* BUTTON ACTIONS */}
                <div className="flex gap-4">
                    <button onClick={() => setScreen('invoice')} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition border border-gray-200">
                        Kembali
                    </button>
                    <button 
                        onClick={() => {
                            setForm({...form, metode_bayar: selectedMethod});
                            setScreen('upload');
                        }}
                        className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition flex items-center justify-center gap-2"
                    >
                        Lanjut Upload Bukti
                        <ChevronRight size={18}/>
                    </button>
                </div>
            </div>
        );
    }

    // --- SCREEN 3: KONFIRMASI / UPLOAD ---
    if (screen === 'upload') {
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!form.bukti_transfer) return alert("Mohon upload bukti transfer!");

            setIsLoading(true);
            const data = new FormData();
            data.append('id_pemesanan', orderData.id_pemesanan);
            data.append('jumlah_bayar', nominalBayar);
            data.append('jenis_pembayaran', form.jenis_pembayaran);
            data.append('bukti_transfer', form.bukti_transfer);
            data.append('metode_bayar', form.metode_bayar); // Kirim metode yang dipilih (BCA/QRIS) 

            try {
                const token = localStorage.getItem('auth_token');
                await axios.post('/api/pembayaran', data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // Tunggu sebentar sebelum refresh agar user lihat success screen
                await new Promise(resolve => setTimeout(resolve, 500));
                await refreshOrder();
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
                    
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <label className="block text-sm font-bold text-blue-900 mb-3">Jenis Pembayaran</label>
                        
                        {/* Alert jika upload ulang */}
                        {status === 'Pembayaran Ditolak' && pembayaranDitolak && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
                                <p className="font-bold">Upload ulang untuk pembayaran: {pembayaranDitolak.jenis_pembayaran}</p>
                                <p className="text-xs mt-1">Nominal: {formatRupiah(pembayaranDitolak.jumlah_bayar)}</p>
                            </div>
                        )}
                        
                        {/* Info Pembayaran */}
                        <div className="bg-white rounded-lg p-4 mb-4 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Tagihan:</span>
                                <span className="font-bold text-gray-800">{formatRupiah(totalTagihan)}</span>
                            </div>
                            {sudahDibayar > 0 && (
                                <>
                                    <div className="flex justify-between text-green-600">
                                        <span>Sudah Dibayar:</span>
                                        <span className="font-bold">- {formatRupiah(sudahDibayar)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-gray-600">Sisa Pembayaran:</span>
                                        <span className="font-bold text-orange-600">{formatRupiah(sisaPembayaran)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        {/* Radio buttons - disable jika upload ulang */}
                        <div className="flex gap-6 mb-6">
                            {/* Tampilkan opsi DP hanya jika belum pernah bayar dan nominalDP > 0 */}
                            {sudahDibayar === 0 && nominalDP > 0 && (
                                <label className={`flex items-center gap-2 ${status === 'Pembayaran Ditolak' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                    <input 
                                        type="radio" 
                                        name="jenis_pembayaran" 
                                        value="DP" 
                                        checked={form.jenis_pembayaran === 'DP'} 
                                        onChange={e => setForm({...form, jenis_pembayaran: e.target.value})}
                                        disabled={status === 'Pembayaran Ditolak'}
                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700 font-medium">DP ({formatRupiah(nominalDP)})</span>
                                </label>
                            )}
                            <label className={`flex items-center gap-2 ${status === 'Pembayaran Ditolak' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                <input 
                                    type="radio" 
                                    name="jenis_pembayaran" 
                                    value="LUNAS" 
                                    checked={form.jenis_pembayaran === 'LUNAS'} 
                                    onChange={e => setForm({...form, jenis_pembayaran: e.target.value})}
                                    disabled={status === 'Pembayaran Ditolak'}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 font-medium">
                                    {sudahDibayar > 0 ? 'Pelunasan' : 'Lunas (Full)'}
                                </span>
                            </label>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                            <span className="text-sm font-medium text-blue-600">Yang harus dibayar sekarang:</span>
                            <span className="font-extrabold text-xl text-blue-800">{formatRupiah(nominalBayar)}</span>
                        </div>
                    </div>

                    {/* Field nama pengirim & bank pengirim dihapus karena tidak disimpan di database */}
                    
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

    // --- SCREEN 4: SUCCESS ---
    if (screen === 'success') {
        // LOGIKA SCREEN SUCCESS:
        // Status "Lunas" atau "Selesai" -> Tampilkan success final
        // Jangan tampilkan "Pembayaran DP Terkirim" kalau sudah lunas!
        
        const isLunas = status === 'Lunas' || status === 'Selesai';
        
        return (
            <div className="bg-white rounded-3xl shadow-xl border border-green-100 max-w-md mx-auto p-8 text-center animate-fade-in-up">
                
                <div className={`w-20 h-20 ${isLunas ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mx-auto mb-6 ${isLunas ? 'animate-bounce' : 'animate-pulse'}`}>
                    {isLunas ? (
                        <CheckCircle className="text-green-600 w-10 h-10" />
                    ) : (
                        <Clock className="text-yellow-600 w-10 h-10" />
                    )}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLunas ? 'Pembayaran Lunas!' : 'Menunggu Verifikasi Admin'}
                </h3>
                
                <p className="text-gray-500 mb-6">
                    {isLunas 
                        ? 'Semua pembayaran telah terverifikasi. Pesanan Anda akan segera diproses!'
                        : 'Bukti pembayaran Anda telah kami terima. Admin akan segera memverifikasi.'
                    }
                </p>
                
                {/* Info Pembayaran */}
                <div className="bg-blue-50 p-5 rounded-xl mb-6 border border-blue-100 text-left">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Tagihan</span>
                            <span className="font-bold text-gray-800">{formatRupiah(totalTagihan)}</span>
                        </div>
                        
                        {/* Detail Pembayaran - Tampilkan jika ada lebih dari 1 pembayaran ATAU jika lunas */}
                        {pembayaranList.length > 0 && (
                            <div className="pt-2 border-t border-blue-200 space-y-2">
                                {pembayaranList.map((p, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">
                                            {p.jenis_pembayaran === 'DP' ? '✓ DP' : 
                                             p.jenis_pembayaran === 'LUNAS' && pembayaranList.some(pay => pay.jenis_pembayaran === 'DP') ? '✓ Pelunasan' : 
                                             '✓ Lunas Langsung'}
                                        </span>
                                        <span className="font-medium text-green-600">{formatRupiah(Number(p.jumlah_bayar))}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                            <span className="text-sm font-bold text-gray-700">
                                {isLunas ? 'Total Terbayar' : 'Sudah Dibayar'}
                            </span>
                            <span className="font-bold text-green-600">{formatRupiah(sudahDibayar)}</span>
                        </div>
                        
                        {!isLunas && sisaPembayaran > 0 && (
                            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                <span className="text-sm font-bold text-blue-600">Sisa yang Harus Dibayar</span>
                                <span className="font-extrabold text-lg text-orange-600">{formatRupiah(sisaPembayaran)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {!isLunas && (
                    <div className="bg-yellow-50 p-4 rounded-xl mb-6 border border-yellow-100">
                        <p className="text-xs text-yellow-700 font-semibold flex items-center justify-center gap-2">
                            <Clock size={16} />
                            Estimasi verifikasi: 10-30 menit
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                    {!isLunas && (
                        <button 
                            onClick={refreshOrder} 
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Cek Status Verifikasi
                        </button>
                    )}
                    
                    <button 
                        onClick={() => window.location.href = '/'} 
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }
};

export default PaymentWizard;