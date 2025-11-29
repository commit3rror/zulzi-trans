import React, { useState, useEffect, useMemo } from 'react';
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
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    // Konfigurasi Axios yang Aman
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: '/', // Sesuaikan jika ada prefix
            withCredentials: true,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                'Accept': 'application/json', // PENTING: Mencegah redirect ke login page saat error, memaksa response JSON
                'Content-Type': 'application/json'
            }
        });

        // Interceptor untuk menangani error 419 (Token Expired) secara otomatis reload
        instance.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 419) {
                    alert('Sesi Anda telah berakhir. Halaman akan dimuat ulang.');
                    window.location.reload();
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, []);

    const fetchPayments = async () => {
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

    const handleDelete = (id) => {
        api.delete(`/api/admin/pembayaran/${id}`)
            .then(() => {
                fetchPayments();
                setDeleteConfirm(null);
            })
            .catch(err => {
                console.error("Gagal Menghapus : ", err);
                alert("Gagal Menghapus Pembayaran.");
            })
    };

    const handleVerify = (id, action) => {
        api.post(`/api/admin/pembayaran/${id}/verify`, { action })
            .then(() => {
                fetchPayments(); // refresh daftar pembayaran untuk mengambil status terbaru
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

    const getStatusBadge = (status) => {
    const statusConfig = {
        'Menunggu': 'bg-yellow-100 text-yellow-800',
        'Terverifikasi': 'bg-green-100 text-green-800',
        'Ditolak': 'bg-red-100 text-red-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
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
                <table className="w-full text-left table-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-4 px-3 text-center w-20 ">ID Pesanan</th>
                            <th className="py-4 px-4 text-center">Nama Pelanggan</th>
                            <th className="py-4 px-4 text-center">Jumlah</th>
                            <th className="py-4 px-4 text-center">Tanggal</th>
                            <th className="py-4 px-4 text-center">Metode</th>
                            <th className="py-4 px-4 text-center">Status</th>
                            <th className="py-4 px-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan="7" className="text-center py-12 text-slate-400">Memuat data...</td></tr>
                        ) : payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.id_pembayaran} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3.5 px-4 text-center font-medium text-slate-600 w-10">{payment.id_pemesanan}</td>
                                    <td className="py-3.5 px-4 text-center text-slate-600">{payment.nama}</td>
                                    <td className="py-3.5 px-4 text-center text-slate-600">{formatRupiah(payment.jumlah_bayar)}</td>
                                    <td className="py-3.5 px-4 text-center text-slate-600">{formatDate(payment.tgl_bayar)}</td>
                                    <td className="py-3.5 px-4 text-center text-slate-600">{payment.metode_bayar}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                                            {payment.status}
                                        </span>

                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Tombol Detail / Edit */}
                                            <ActionButton
                                                type="edit2"  // ikon UserPen dari ReusableUI
                                                onClick={() => setDetailModal(payment)} // fungsi membuka modal detail
                                                title="Detail"
                                            />

                                            {/* Tombol Delete */}
                                            <ActionButton
                                                type="delete"    // ikon Trash dari ReusableUI
                                                onClick={() => setDeleteConfirm(payment)} // fungsi menghapus
                                                title="Hapus"
                                            />
                                        </div>
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
                            <div className="grid grid-cols-2 gap-6 mb-6 mx-auto w-[80%]">
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
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(detailModal.status)}`}>
                                        {detailModal.status}
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

            {/* Delete Confirmation Modal */}
                        <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Pemesanan">
                            <div className="p-6">
                                <p className="text-sm text-slate-600">
                                    Anda yakin ingin menghapus Pembayaran dari <strong>{deleteConfirm?.nama}</strong>?
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(deleteConfirm.id_pembayaran)}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Hapus
                                </button>
                            </div>
                        </Modal>
        </>
    );
};

export default PembayaranPage;
