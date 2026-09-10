'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  getBeritaList,
  getKategoriList,
  deleteBerita,
  updateBerita,
} from '@/lib/supabase';
import { Berita, Kategori, StatusBerita } from '@/types/database';
import { useToast } from '@/components/ui/toast';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

function AdminBeritaContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('kategori') || 'all';

  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [beritaToDelete, setBeritaToDelete] = useState<Berita | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [beritaData, catData] = await Promise.all([
        getBeritaList({ status: 'all', orderBy: 'dibuat_pada', ascending: false }),
        getKategoriList(),
      ]);
      setBeritaList(beritaData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
      toastError('Gagal memuat daftar berita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!beritaToDelete) return;
    setDeleting(true);
    try {
      await deleteBerita(beritaToDelete.id);
      success(`Berita "${beritaToDelete.judul}" berhasil dihapus`);
      setDeleteModalOpen(false);
      setBeritaToDelete(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Gagal menghapus berita');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (berita: Berita, newStatus: StatusBerita) => {
    try {
      await updateBerita(berita.id, { status: newStatus });
      success(`Status berita diubah menjadi ${newStatus}`);
      loadData();
    } catch (err: any) {
      console.error(err);
      toastError('Gagal mengubah status berita');
    }
  };

  // Filter logic
  const filteredBerita = beritaList.filter((b) => {
    const matchesSearch =
      b.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.penulis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ringkasan?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      (b.kategori && b.kategori.slug.toLowerCase() === selectedCategory.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || b.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6E6E6]">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1D1D1D]">
            Manajemen Berita
          </h1>
          <p className="text-xs sm:text-sm text-[#696969]">
            Kelola, saring, publikasikan, atau edit berita di website SoloHitz.
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="btn-pill-primary text-sm !bg-[#4A154B] hover:!bg-[#611F69] self-start sm:self-auto shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Berita</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6E6E6] flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari judul atau penulis berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="terbit">Terbit (Live)</option>
            <option value="draft">Draft</option>
            <option value="arsip">Arsip</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#E6E6E6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#696969]">
            Memuat data berita...
          </div>
        ) : filteredBerita.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FA] text-[#696969] text-xs font-bold uppercase tracking-wider border-b border-[#E6E6E6]">
                <tr>
                  <th className="py-3.5 px-4">Judul & Kategori</th>
                  <th className="py-3.5 px-4">Penulis</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Dilihat</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E6]">
                {filteredBerita.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 max-w-xs">
                      <div className="space-y-1">
                        <Link
                          href={`/admin/berita/${item.id}/edit`}
                          className="font-bold text-[#1D1D1D] hover:text-[#4A154B] line-clamp-2"
                        >
                          {item.judul}
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#4A154B] bg-[#F9F0FF] px-2 py-0.5 rounded">
                            {item.kategori?.nama || 'Tanpa Kategori'}
                          </span>
                          {item.status === 'terbit' && (
                            <Link
                              href={`/berita/${item.slug}`}
                              target="_blank"
                              className="text-[11px] text-gray-400 hover:text-[#1264A3] flex items-center gap-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Lihat</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-[#1D1D1D]">
                      {item.penulis || 'Redaksi'}
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item, e.target.value as StatusBerita)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                          item.status === 'terbit'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'draft'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="terbit">Terbit</option>
                        <option value="arsip">Arsip</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-[#696969]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        {item.jumlah_dilihat || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-[#696969]">
                      {item.tanggal_publish
                        ? new Date(item.tanggal_publish).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : new Date(item.dibuat_pada).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/berita/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#4A154B] transition-colors"
                          title="Edit Berita"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setBeritaToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#1D1D1D]">
              Tidak ada berita yang sesuai
            </p>
            <p className="text-xs text-[#696969]">
              Coba sesuaikan kata kunci pencarian atau filter yang dipilih.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Delete Dialog */}
      {deleteModalOpen && beritaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1D]">Hapus Berita?</h3>
            </div>

            <p className="text-sm text-[#696969] leading-relaxed">
              Apakah kamu yakin ingin menghapus artikel{' '}
              <strong className="text-[#1D1D1D]">&ldquo;{beritaToDelete.judul}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBeritaToDelete(null);
                }}
                className="btn-pill-outline text-xs !py-2 !px-4"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="btn-pill-primary !bg-red-600 hover:!bg-red-700 text-xs !py-2 !px-4"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBeritaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-[#696969]">
          Memuat halaman manajemen berita...
        </div>
      }
    >
      <AdminBeritaContent />
    </Suspense>
  );
}
