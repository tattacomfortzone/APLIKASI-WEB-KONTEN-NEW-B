'use client';

import React, { useState, useEffect } from 'react';
import {
  getTagList,
  createTag,
  updateTag,
  deleteTag,
} from '@/lib/supabase';
import { Tag } from '@/types/database';
import { useToast } from '@/components/ui/toast';
import {
  Tags,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function AdminTagPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [nama, setNama] = useState('');
  const [slug, setSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await getTagList();
      setTags(data);
    } catch (err) {
      console.error(err);
      toastError('Gagal memuat daftar tag');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const openCreateModal = () => {
    setEditingTag(null);
    setNama('');
    setSlug('');
    setIsModalOpen(true);
  };

  const openEditModal = (t: Tag) => {
    setEditingTag(t);
    setNama(t.nama);
    setSlug(t.slug);
    setIsModalOpen(true);
  };

  const handleNamaChange = (val: string) => {
    setNama(val);
    if (!editingTag) {
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
      toastError('Nama dan Slug tag wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTag) {
        await updateTag(editingTag.id, {
          nama: nama.trim(),
          slug: slug.trim(),
        });
        success('Tag berhasil diperbarui');
      } else {
        await createTag({
          nama: nama.trim(),
          slug: slug.trim(),
        });
        success('Tag baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      loadTags();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Gagal menyimpan tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tagToDelete) return;
    setDeleting(true);
    try {
      await deleteTag(tagToDelete.id);
      success(`Tag #${tagToDelete.nama} berhasil dihapus`);
      setDeleteModalOpen(false);
      setTagToDelete(null);
      loadTags();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Gagal menghapus tag');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTags = tags.filter((t) =>
    t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6E6E6]">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1D1D1D]">
            Manajemen Tag
          </h1>
          <p className="text-xs sm:text-sm text-[#696969]">
            Kelola label dan kata kunci topik berita untuk memudahkan pembaca.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-pill-primary text-sm !bg-[#4A154B] hover:!bg-[#611F69] self-start sm:self-auto shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Tag Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6E6E6]">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Tags Table */}
      <div className="bg-white border border-[#E6E6E6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#696969]">
            Memuat daftar tag...
          </div>
        ) : filteredTags.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FA] text-[#696969] text-xs font-bold uppercase tracking-wider border-b border-[#E6E6E6]">
                <tr>
                  <th className="py-3.5 px-4">Nama Tag</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Dibuat Pada</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E6]">
                {filteredTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#1D1D1D]">
                      <span className="px-2.5 py-1 rounded-full bg-[#F9F0FF] text-[#4A154B] text-xs font-semibold">
                        #{tag.nama}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#696969]">
                      {tag.slug}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#696969]">
                      {tag.dibuat_pada
                        ? new Date(tag.dibuat_pada).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(tag)}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#4A154B] transition-colors"
                          title="Edit Tag"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTagToDelete(tag);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Tag"
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
            <p className="text-sm font-semibold text-[#1D1D1D]">Tidak ada tag</p>
            <p className="text-xs text-[#696969]">
              Tambahkan tag seperti Solo, Surakarta, Wisata Solo, atau Kuliner Solo.
            </p>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit Tag */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1D1D1D]">
                {editingTag ? 'Edit Tag' : 'Tambah Tag Baru'}
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
                  Nama Tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kuliner Solo"
                  value={nama}
                  onChange={(e) => handleNamaChange(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#4A154B] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#696969]">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="kuliner-solo"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-gray-200 focus:border-[#4A154B] focus:outline-none"
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
                  {submitting ? 'Menyimpan...' : 'Simpan Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Delete Dialog */}
      {deleteModalOpen && tagToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1D1D1D]">Hapus Tag?</h3>
            </div>

            <p className="text-sm text-[#696969] leading-relaxed">
              Apakah kamu yakin ingin menghapus tag{' '}
              <strong className="text-[#1D1D1D]">#{tagToDelete.nama}</strong>?
              Relasi pada berita yang menggunakan tag ini juga akan dihapus.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setTagToDelete(null);
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
