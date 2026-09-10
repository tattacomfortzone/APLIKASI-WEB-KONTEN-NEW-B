import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BeritaCard from '@/components/berita-card';
import { getBeritaList } from '@/lib/supabase';
import { Search as SearchIcon } from 'lucide-react';

export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  const results = query
    ? await getBeritaList({
        status: 'terbit',
        search: query,
        orderBy: 'tanggal_publish',
        ascending: false,
      })
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-8 border-b border-[#E6E6E6] space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9F0FF] text-[#4A154B] text-xs font-bold uppercase tracking-wider">
              <SearchIcon className="w-3.5 h-3.5" />
              <span>Hasil Pencarian</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1D]">
              {query ? `Pencarian: "${query}"` : 'Cari Berita'}
            </h1>
            <p className="text-sm text-[#696969]">
              {query
                ? `Ditemukan ${results.length} berita terkait kata kunci "${query}".`
                : 'Ketik kata kunci pencarian di kolom navigasi atas untuk menemukan artikel.'}
            </p>
          </div>

          {/* Results Grid */}
          <div className="pt-8">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((berita) => (
                  <BeritaCard key={berita.id} berita={berita} />
                ))}
              </div>
            ) : query ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
                <SearchIcon className="w-8 h-8 text-[#696969] mx-auto opacity-50" />
                <p className="text-base font-semibold text-[#1D1D1D]">Tidak ada hasil</p>
                <p className="text-xs text-[#696969]">
                  Tidak ditemukan berita yang cocok dengan kata kunci &quot;{query}&quot;. Silakan coba dengan kata kunci lain.
                </p>
                <div className="pt-2">
                  <Link href="/berita" className="btn-pill-primary text-xs inline-flex">
                    Lihat Semua Berita
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-sm text-[#696969]">
                Silakan masukkan kata kunci pencarian pada kotak pencarian di atas.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
