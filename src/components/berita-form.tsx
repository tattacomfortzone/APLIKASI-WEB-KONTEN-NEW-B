'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createBerita,
  updateBerita,
  getKategoriList,
  getTagList,
} from '@/lib/supabase';
import { Berita, Kategori, Tag, StatusBerita } from '@/types/database';
import { useToast } from '@/components/ui/toast';
import {
  Save,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  MapPin,
  User,
  Tag as TagIcon,
  FolderTree,
} from 'lucide-react';

interface BeritaFormProps {
  initialData?: Berita;
  isEdit?: boolean;
}

export default function BeritaForm({ initialData, isEdit = false }: BeritaFormProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [categories, setCategories] = useState<Kategori[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [judul, setJudul] = useState(initialData?.judul || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [kategoriId, setKategoriId] = useState<string | number>(
    initialData?.kategori_id || ''
  );
  const [ringkasan, setRingkasan] = useState(initialData?.ringkasan || '');
  const [isi, setIsi] = useState(initialData?.isi || '');
  const [gambar, setGambar] = useState(initialData?.gambar || '');
  const [penulis, setPenulis] = useState(initialData?.penulis || 'Redaksi SoloEdu');
  const [lokasi, setLokasi] = useState(initialData?.lokasi || 'Surakarta');
  const [status, setStatus] = useState<StatusBerita>(initialData?.status || 'draft');
  const [tanggalPublish, setTanggalPublish] = useState<string>(
    initialData?.tanggal_publish
      ? new Date(initialData.tanggal_publish).toISOString().slice(0, 16)
      : ''
  );
  const [selectedTagIds, setSelectedTagIds] = useState<(string | number)[]>(
    initialData?.berita_tag?.map((bt) => bt.tag_id) || []
  );

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, tags] = await Promise.all([getKategoriList(), getTagList()]);
        setCategories(cats);
        setAllTags(tags);
        if (!kategoriId && cats.length > 0 && !isEdit) {
          setKategoriId(cats[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  // Slug generator helper
  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    if (!isEdit || !slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  const handleTagToggle = (tagId: string | number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (targetStatus?: StatusBerita) => {
    const currentStatus = targetStatus || status;

    if (!judul.trim()) {
      toastError('Judul berita tidak boleh kosong');
      return;
    }
    if (!slug.trim()) {
      toastError('Slug berita tidak boleh kosong');
      return;
    }
    if (!kategoriId) {
      toastError('Silakan pilih kategori berita');
      return;
    }

    setLoading(true);

    try {
      const payload: Partial<Berita> = {
        judul: judul.trim(),
        slug: slug.trim(),
        kategori_id: kategoriId,
        ringkasan: ringkasan.trim() || null,
        isi: isi.trim() || null,
        gambar: gambar.trim() || null,
        penulis: penulis.trim() || 'Redaksi SoloEdu',
        lokasi: lokasi.trim() || 'Surakarta',
        status: currentStatus,
        tanggal_publish:
          currentStatus === 'terbit'
            ? tanggalPublish
              ? new Date(tanggalPublish).toISOString()
              : new Date().toISOString()
            : null,
      };

      if (isEdit && initialData) {
        await updateBerita(initialData.id, payload, selectedTagIds);
        success('Berita berhasil diperbarui');
      } else {
        await createBerita(payload, selectedTagIds);
        success('Berita berhasil ditambahkan');
      }

      router.push('/admin/berita');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Terjadi kesalahan saat menyimpan berita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6E6E6]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/berita"
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1D1D1D]">
              {isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h1>
            <p className="text-xs text-[#696969]">
              Isi formulir di bawah ini untuk {isEdit ? 'mengubah' : 'membuat'} konten berita.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('draft')}
            className="btn-pill-secondary text-xs !py-2 !px-4"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Draft</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('terbit')}
            className="btn-pill-primary text-xs !py-2 !px-4 !bg-[#4A154B] hover:!bg-[#611F69]"
          >
            <Send className="w-4 h-4" />
            <span>Terbitkan Berita</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E6E6E6] space-y-5">
            {/* Judul */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D]">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Menjelajahi Keindahan Pesona Wisata Solo"
                value={judul}
                onChange={handleJudulChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:ring-1 focus:ring-[#4A154B] focus:outline-none text-base font-semibold"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#696969]">
                URL Slug (SEO-Friendly) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <span className="hidden sm:inline">/berita/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="menjelajahi-keindahan-pesona-wisata-solo"
                  required
                  className="w-full bg-transparent font-mono text-xs text-[#1D1D1D] focus:outline-none pl-1"
                />
              </div>
            </div>

            {/* Ringkasan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D]">
                Ringkasan Singkat
              </label>
              <textarea
                rows={3}
                placeholder="Tulis ringkasan 1-2 kalimat untuk preview card..."
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:ring-1 focus:ring-[#4A154B] focus:outline-none text-sm"
              />
            </div>

            {/* Isi Artikel */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D]">
                Isi Konten Berita
              </label>
              <textarea
                rows={14}
                placeholder="Tuliskan isi lengkap artikel berita di sini..."
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:ring-1 focus:ring-[#4A154B] focus:outline-none text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Category Box */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] space-y-5">
            <h3 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-wider pb-2 border-b border-[#E6E6E6]">
              Pengaturan Publikasi
            </h3>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1D]">Status Berita</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusBerita)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#4A154B] focus:outline-none"
              >
                <option value="draft">Draft (Belum Ditampilkan)</option>
                <option value="terbit">Terbit (Tampil di Website)</option>
                <option value="arsip">Arsip</option>
              </select>
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1D]">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#4A154B] focus:outline-none"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Publish */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1D]">
                Tanggal / Waktu Terbit
              </label>
              <input
                type="datetime-local"
                value={tanggalPublish}
                onChange={(e) => setTanggalPublish(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#4A154B] focus:outline-none"
              />
              <p className="text-[11px] text-gray-400">
                Kosongkan untuk otomatis menggunakan waktu saat ini saat diterbitkan.
              </p>
            </div>
          </div>

          {/* Media & Details Box */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] space-y-5">
            <h3 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-wider pb-2 border-b border-[#E6E6E6]">
              Media & Informasi
            </h3>

            {/* Gambar URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1D]">URL Gambar Utama</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={gambar}
                onChange={(e) => setGambar(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#4A154B] focus:outline-none font-mono"
              />
              {gambar && (
                <div className="mt-2 aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 border">
                  <img
                    src={gambar}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>

            {/* Penulis */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1D]">Penulis</label>
              <input
                type="text"
                placeholder="Redaksi SoloEdu"
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#4A154B] focus:outline-none"
              />
            </div>

            {/* Lokasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1D]">Lokasi</label>
              <input
                type="text"
                placeholder="Surakarta"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#4A154B] focus:outline-none"
              />
            </div>
          </div>

          {/* Tags Box */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]">
              <h3 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-wider">
                Pilih Tag
              </h3>
              <Link
                href="/admin/tag"
                target="_blank"
                className="text-xs font-bold text-[#4A154B] hover:underline"
              >
                + Kelola Tag
              </Link>
            </div>

            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {allTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#4A154B] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag.nama}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#696969]">Belum ada tag yang dibuat.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
