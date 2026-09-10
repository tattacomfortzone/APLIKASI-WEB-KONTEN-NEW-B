'use client';

import React, { useState, useEffect } from 'react';
import {
  getKategoriList,
  createKategori,
  updateKategori,
  deleteKategori,
} from '@/lib/supabase';
import { Kategori } from '@/types/database';
import { useToast } from '@/components/ui/toast';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  AlertTriangle,
  FolderPlus,
  Save,
  X,
} from 'lucide-react';

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Kategori | null>(null);
  const [nama, setNama] = useState('');
  const [slug, setSlug] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Kategori | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getKategoriList();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toastError('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setNama('');
    setSlug('');
    setDeskripsi('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Kategori) => {
    setEditingCategory(cat);
    setNama(cat.nama);
    setSlug(cat.slug);
    setDeskripsi(cat.deskripsi || '');
    setIsModalOpen(true);
  };

  const handleNamaChange = (val: string) => {
    setNama(val);
    if (!editingCategory) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !slug.trim()) {
      toastError('Nama dan Slug kategori wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateKategori(editingCategory.id, {
          nama: nama.trim(),
          slug: slug.trim(),
          deskripsi: deskripsi.trim() || undefined,
        });
        success('Kategori berhasil diperbarui');
      } else {
        await createKategori({
          nama: nama.trim(),
          slug: slug.trim(),
          deskripsi: deskripsi.trim() || undefined,
        });
        success('Kategori baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Gagal menyimpan kategori');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await deleteKategori(categoryToDelete.id);
      success(`Kategori "${categoryToDelete.nama}" berhasil dihapus`);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Gagal menghapus kategori. Pastikan kategori tidak digunakan pada berita.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6E6E6]">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1D1D1D]">
            Manajemen Kategori
          </h1>
          <p className="text-xs sm:text-sm text-[#696969]">
            Kelola topik dan kategori berita untuk website SoloHitz.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-pill-primary text-sm !bg-[#4A154B] hover:!bg-[#611F69] self-start sm:self-auto shadow-md"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories Table / Cards */}
      <div className="bg-white border border-[#E6E6E6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#696969]">
            Memuat daftar kategori...
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FA] text-[#696969] text-xs font-bold uppercase tracking-wider border-b border-[#E6E6E6]">
                <tr>
                  <th className="py-3.5 px-4">Nama Kategori</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E6]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#1D1D1D]">
                      {cat.nama}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#4A154B] bg-purple-50/40">
                      /{cat.slug}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#696969] max-w-sm truncate">
                      {cat.deskripsi || '-'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#4A154B] transition-colors"
                          title="Edit Kategori"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(cat);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Kategori"
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
            <p className="text-sm font-semibold text-[#1D1D1D]">Belum ada kategori</p>
            <p className="text-xs text-[#696969]">
              Tambahkan kategori seperti Wisata, Kuliner, atau Budaya.
            </p>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit Kategori */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1D1D1D]">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D]">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Wisata"
                  value={nama}
                  onChange={(e) => handleNamaChange(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#4A154B] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#696969]">
                  Slug URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="wisata"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-gray-200 focus:border-[#4A154B] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D]">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat mengenai topik kategori ini..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#4A154B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-pill-outline text-xs !py-2 !px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pill-primary text-xs !py-2 !px-4 !bg-[#4A154B]"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Delete Dialog */}
      {deleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1D]">Hapus Kategori?</h3>
            </div>

            <p className="text-sm text-[#696969] leading-relaxed">
              Apakah kamu yakin ingin menghapus kategori{' '}
              <strong className="text-[#1D1D1D]">&ldquo;{categoryToDelete.nama}&rdquo;</strong>?
              Jika kategori ini masih memiliki berita terkait, penghapusan akan dicegah.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setCategoryToDelete(null);
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
