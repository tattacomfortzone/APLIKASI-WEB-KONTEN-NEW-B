import React from 'react';
import Link from 'next/link';
import {
  getDashboardStats,
  getBeritaList,
  getKategoriList,
} from '@/lib/supabase';
import {
  Newspaper,
  CheckCircle2,
  FileEdit,
  Archive,
  Eye,
  PlusCircle,
  TrendingUp,
  FolderTree,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [stats, latestBerita, popularBerita, categories] = await Promise.all([
    getDashboardStats(),
    getBeritaList({ status: 'all', limit: 5, orderBy: 'dibuat_pada', ascending: false }),
    getBeritaList({ status: 'all', limit: 5, orderBy: 'jumlah_dilihat', ascending: false }),
    getKategoriList(),
  ]);

  const statCards = [
    {
      title: 'Total Berita',
      value: stats.totalBerita,
      icon: Newspaper,
      color: 'text-[#4A154B] bg-[#F9F0FF] border-purple-200',
    },
    {
      title: 'Berita Terbit',
      value: stats.beritaTerbit,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Draft',
      value: stats.draft,
      icon: FileEdit,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Arsip',
      value: stats.arsip,
      icon: Archive,
      color: 'text-gray-700 bg-gray-100 border-gray-200',
    },
    {
      title: 'Total Pembaca (Views)',
      value: stats.totalDilihat.toLocaleString('id-ID'),
      icon: Eye,
      color: 'text-[#1264A3] bg-blue-50 border-blue-200',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'terbit':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Terbit
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            Draft
          </span>
        );
      case 'arsip':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            Arsip
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1D1D1D]">
            Dashboard <span className="text-[#4A154B]">SoloHitz</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#696969]">
            Kelola seluruh konten artikel wisata, kuliner, dan kebudayaan Kota Solo.
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="btn-pill-primary shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border bg-white flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#696969]">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#1D1D1D]">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Articles & Top Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Berita Terbaru */}
        <div className="lg:col-span-7 bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#4A154B]" />
              <h2 className="text-lg font-bold text-[#1D1D1D]">Berita Terbaru Ditambahkan</h2>
            </div>
            <Link
              href="/admin/berita"
              className="text-xs font-bold text-[#4A154B] hover:text-[#611F69] flex items-center gap-1"
            >
              Lihat Semua →
            </Link>
          </div>

          {latestBerita.length > 0 ? (
            <div className="divide-y divide-[#E6E6E6]">
              {latestBerita.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="space-y-1 min-w-0">
                    <Link
                      href={`/admin/berita/${item.id}/edit`}
                      className="text-sm font-semibold text-[#1D1D1D] hover:text-[#4A154B] transition-colors truncate block"
                    >
                      {item.judul}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#696969]">
                      <span>{item.kategori?.nama || 'Tanpa Kategori'}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.dibuat_pada).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {getStatusBadge(item.status)}
                    <Link
                      href={`/admin/berita/${item.id}/edit`}
                      className="text-xs font-medium text-[#1264A3] hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#696969] text-center py-6">Belum ada berita.</p>
          )}
        </div>

        {/* Berita Paling Banyak Dilihat & Kategori */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Viewed */}
          <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E6E6E6]">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-[#1D1D1D]">Paling Banyak Dilihat</h2>
            </div>

            {popularBerita.length > 0 ? (
              <div className="divide-y divide-[#E6E6E6]">
                {popularBerita.map((item, idx) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-black text-gray-400 w-4">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-medium text-[#1D1D1D] truncate">
                        {item.judul}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#1264A3] shrink-0">
                      {item.jumlah_dilihat || 0} views
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#696969] text-center py-4">Belum ada statistik tayang.</p>
            )}
          </div>

          {/* Quick Categories Overview */}
          <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#4A154B]" />
                <h2 className="text-lg font-bold text-[#1D1D1D]">Kategori Konten</h2>
              </div>
              <Link
                href="/admin/kategori"
                className="text-xs font-bold text-[#4A154B] hover:text-[#611F69]"
              >
                Kelola →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/admin/berita?kategori=${cat.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-[#F4EDE4]/70 hover:bg-[#F4EDE4] text-xs font-semibold text-[#1D1D1D] border border-stone-200 transition-colors"
                >
                  {cat.nama}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
