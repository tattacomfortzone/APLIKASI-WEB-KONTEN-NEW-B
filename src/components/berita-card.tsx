import React from 'react';
import Link from 'next/link';
import { Eye, MapPin, Calendar, User } from 'lucide-react';
import { Berita } from '@/types/database';

interface BeritaCardProps {
  berita: Berita;
  featured?: boolean;
}

export default function BeritaCard({ berita, featured = false }: BeritaCardProps) {
  const formattedDate = berita.tanggal_publish
    ? new Date(berita.tanggal_publish).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : berita.dibuat_pada
    ? new Date(berita.dibuat_pada).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  // Category badge color based on category slug
  const getCategoryColor = (kategoriSlug?: string) => {
    switch (kategoriSlug?.toLowerCase()) {
      case 'wisata':
        return 'bg-[#F9F0FF] text-[#4A154B] border-[#4A154B]/20';
      case 'kuliner':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'budaya':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-50 text-[#1264A3] border-blue-200';
    }
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80';

  const imageUrl =
    berita.gambar &&
    (berita.gambar.startsWith('http://') ||
      berita.gambar.startsWith('https://') ||
      berita.gambar.startsWith('/'))
      ? berita.gambar
      : defaultImage;

  /**
   * Validasi slug: jika slug tidak ada, kosong, atau berisi URL (misal URL gambar yang
   * salah disimpan ke field slug), gunakan /berita/id/[id] sebagai fallback.
   */
  const isValidSlug =
    berita.slug &&
    berita.slug.trim() !== '' &&
    !berita.slug.startsWith('http://') &&
    !berita.slug.startsWith('https://') &&
    !berita.slug.startsWith('/');

  const articleHref = isValidSlug
    ? `/berita/${berita.slug}`
    : `/berita/id/${berita.id}`;

  if (featured) {
    return (
      <div className="card-solohitz group grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white">
        {/* Gambar — klik membuka halaman detail artikel */}
        <Link
          href={articleHref}
          className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] overflow-hidden bg-gray-100 block"
        >
          <img
            src={imageUrl}
            alt={berita.judul}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {berita.kategori && (
            <span
              className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm backdrop-blur-md ${getCategoryColor(
                berita.kategori.slug
              )}`}
            >
              {berita.kategori.nama}
            </span>
          )}
        </Link>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-[#696969]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#4A154B]" />
                {berita.lokasi || 'Surakarta'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {berita.jumlah_dilihat || 0}
              </span>
            </div>

            <Link href={articleHref}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1D] group-hover:text-[#4A154B] transition-colors line-clamp-2">
                {berita.judul}
              </h2>
            </Link>

            <p className="text-sm text-[#696969] line-clamp-3 leading-relaxed">
              {berita.ringkasan || berita.isi?.substring(0, 150) || ''}
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-[#E6E6E6] flex items-center justify-between">
            <span className="text-xs font-medium text-[#696969] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {berita.penulis || 'Redaksi SoloHitz'}
            </span>
            <Link
              href={articleHref}
              className="text-xs font-bold text-[#4A154B] hover:text-[#611F69] group-hover:underline flex items-center gap-1"
            >
              Baca Selengkapnya →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-solohitz group flex flex-col h-full bg-white">
      {/* Gambar — klik membuka halaman detail artikel */}
      <Link
        href={articleHref}
        className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 block"
      >
        <img
          src={imageUrl}
          alt={berita.judul}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {berita.kategori && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full border shadow-sm backdrop-blur-md ${getCategoryColor(
              berita.kategori.slug
            )}`}
          >
            {berita.kategori.nama}
          </span>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-[#696969]">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#4A154B]" />
              {berita.lokasi || 'Surakarta'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {berita.jumlah_dilihat || 0}
            </span>
          </div>

          <Link href={articleHref}>
            <h3 className="text-lg font-bold tracking-tight text-[#1D1D1D] group-hover:text-[#4A154B] transition-colors line-clamp-2">
              {berita.judul}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[#696969] line-clamp-2 leading-relaxed">
            {berita.ringkasan || berita.isi?.substring(0, 100) || ''}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-[#E6E6E6] flex items-center justify-between text-xs text-[#696969]">
          <span className="font-medium truncate max-w-[140px]">
            {berita.penulis || 'Redaksi'}
          </span>
          <Link
            href={articleHref}
            className="font-bold text-[#4A154B] group-hover:underline inline-flex items-center gap-0.5"
          >
            Baca →
          </Link>
        </div>
      </div>
    </div>
  );
}
