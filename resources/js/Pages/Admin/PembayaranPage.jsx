import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ActionButton,
    SearchInput,
    Modal
} from '@/Components/ReusableUI';

const PembayaranPage = ({ setHeaderAction }) => {
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState('');
    const [detailModal, setDetailModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatuses, setPaymentStatuses] = useState({});

    const api = axios.create({
        baseURL: '/', // pastikan request diarahkan ke root domain
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') }
    });


    const fetchPayments = () => {
        setIsLoading(true);
        api.get(`/api/admin/pembayaran?search=${search}`)
            .then(res => {
                setPayments(res.data);
            })
            .catch(err => {
                console.error("Gagal mengambil data pembayaran:", err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchPayments();
    }, [search]);

    useEffect(() => {
        setHeaderAction(null);
        return () => setHeaderAction(null);
    }, [setHeaderAction]);

    const handleVerify = (id, action) => {
        api.post(`/api/admin/pembayaran/${id}/verify`, { action })
            .then(() => {
                setPaymentStatuses(prev => ({
                    ...prev,
                    [id]: action === 'approve' ? 'Terverifikasi' : 'Ditolak'
                }));
                setDetailModal(null);
                alert(`Pembayaran berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}`);
            })
            .catch(err => {
                console.error("Gagal memverifikasi pembayaran:", err.response?.data || err.message);
                alert("Gagal memverifikasi pembayaran. Cek console untuk detail.");
            });
    };



    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getStatusBadge = (id) => {
        const status = paymentStatuses[id] || 'Menunggu';
        const statusConfig = {
            'Menunggu': 'bg-yellow-100 text-yellow-800',
            'Terverifikasi': 'bg-green-100 text-green-800',
            'Ditolak': 'bg-red-100 text-red-800'
        };
        return statusConfig[status];
    };

    return (
        <>
            <div className="mb-6">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari pembayaran..."
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-4">ID Pesanan</th>
                            <th className="py-4 px-4">Nama Pelanggan</th>
                            <th className="py-4 px-4">Jumlah</th>
                            <th className="py-4 px-4">Tanggal</th>
                            <th className="py-4 px-4">Metode</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan="7" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
                        ) : payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.id_pembayaran} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-slate-900">{payment.id_pemesanan}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{payment.nama}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{formatRupiah(payment.jumlah_bayar)}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{formatDate(payment.tgl_bayar)}</td>
                                    <td className="py-3.5 px-4 text-slate-600">{payment.metode_bayar}</td>
                                    <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.id_pembayaran)}`}>
                                            {paymentStatuses[payment.id_pembayaran] || 'Menunggu'}
                                        </span>

                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            onClick={() => setDetailModal(payment)}
                                            className="text-slate-600 hover:text-slate-900 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center py-12 text-slate-400 italic">Tidak ada data pembayaran ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Detail Pembayaran">
                {detailModal && (
                    <>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">ID Pesanan</p>
                                    <p className="text-sm font-semibold text-slate-900">{detailModal.id_pemesanan}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Nama Pelanggan</p>
                                    <p className="text-sm font-semibold text-slate-900">{detailModal.nama}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Jumlah</p>
                                    <p className="text-sm font-semibold text-slate-900">{formatRupiah(detailModal.jumlah_bayar)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Tanggal</p>
                                    <p className="text-sm font-semibold text-slate-900">{formatDate(detailModal.tgl_bayar)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Metode Pembayaran</p>
                                    <p className="text-sm font-semibold text-slate-900">{detailModal.metode_bayar}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Rekening Tujuan</p>
                                    <p className="text-sm font-semibold text-slate-900">{detailModal.rekening_tujuan || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Waktu Transfer</p>
                                    <p className="text-sm font-semibold text-slate-900">{detailModal.waktu_transfer || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(detailModal.id_pembayaran)}`}>
                                        {paymentStatuses[detailModal.id_pembayaran] || 'Menunggu'}
                                    </span>

                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs text-slate-500 mb-3">Bukti Pembayaran</p>
                                <div className="bg-black rounded-lg overflow-hidden">
                                    {detailModal.bukti_transfer ? (
                                        <img
                                            src={`/storage/${detailModal.bukti_transfer}`}
                                            alt="Bukti Pembayaran"
                                            className="w-full h-auto object-contain"
                                        />
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            Tidak ada bukti transfer
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleVerify(detailModal.id_pembayaran, 'reject');
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Tolak Pembayaran
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleVerify(detailModal.id_pembayaran, 'approve');
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Setujui Pembayaran
                            </button>

                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default PembayaranPage;
