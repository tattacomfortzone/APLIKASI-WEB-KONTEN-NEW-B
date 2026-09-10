import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BeritaCard from '@/components/berita-card';
import { getBeritaList } from '@/lib/supabase';
import { Trees } from 'lucide-react';

export const revalidate = 0;

export default async function WisataPage() {
  const beritaList = await getBeritaList({
    status: 'terbit',
    kategoriSlug: 'wisata',
    orderBy: 'tanggal_publish',
    ascending: false,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-8 border-b border-[#E6E6E6] space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Trees className="w-3.5 h-3.5" />
              <span>Kategori Wisata</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1D]">
              Wisata Kota Solo
            </h1>
            <p className="text-sm text-[#696969] max-w-2xl">
              Rekomendasi destinasi wisata menarik, bangunan bersejarah, taman kota, dan tempat rekreasi terbaik di Solo/Surakarta.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <Link
                href="/berita"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E6E6E6] text-[#1D1D1D] hover:bg-[#F4EDE4] transition-colors"
              >
                Semua
              </Link>
              <Link
                href="/berita/wisata"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4A154B] text-white"
              >
                Wisata
              </Link>
              <Link
                href="/berita/kuliner"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E6E6E6] text-[#1D1D1D] hover:bg-[#F4EDE4] transition-colors"
              >
                Kuliner
              </Link>
              <Link
                href="/berita/budaya"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E6E6E6] text-[#1D1D1D] hover:bg-[#F4EDE4] transition-colors"
              >
                Budaya
              </Link>
            </div>
          </div>

          {/* News List */}
          <div className="pt-8">
            {beritaList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {beritaList.map((berita) => (
                  <BeritaCard key={berita.id} berita={berita} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
                <p className="text-base font-semibold text-[#1D1D1D]">Belum ada berita wisata</p>
                <p className="text-xs text-[#696969]">
                  Belum terdapat artikel untuk kategori Wisata.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
