import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BeritaCard from '@/components/berita-card';
import { getBeritaList, getKategoriList } from '@/lib/supabase';
import { Trees, UtensilsCrossed, Landmark, Compass, Newspaper } from 'lucide-react';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

const KATEGORI_CONFIG: Record<
  string,
  {
    label: string;
    desc: string;
    badgeClass: string;
    icon: React.ReactNode;
  }
> = {
  wisata: {
    label: 'Wisata Kota Solo',
    desc: 'Rekomendasi destinasi wisata menarik, bangunan bersejarah, taman kota, dan tempat rekreasi terbaik di Solo/Surakarta.',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: <Trees className="w-3.5 h-3.5" />,
  },
  kuliner: {
    label: 'Kuliner Khas Solo',
    desc: 'Cita rasa legendaris Surakarta: Selat Solo, Timlo, Tengkleng, Nasi Liwet, Serabi Notosuman, hingga kuliner malam kekinian.',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <UtensilsCrossed className="w-3.5 h-3.5" />,
  },
  budaya: {
    label: 'Budaya & Tradisi Solo',
    desc: 'Eksplorasi keluhuran seni Keraton Surakarta Hadiningrat, Pura Mangkunegaran, pagelaran wayang, batik, dan perayaan adat Jawa.',
    badgeClass: 'bg-[#F9F0FF] text-[#4A154B] border-purple-200',
    icon: <Landmark className="w-3.5 h-3.5" />,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = KATEGORI_CONFIG[slug.toLowerCase()];
  const label = config?.label ?? `Kategori ${slug}`;
  return {
    title: `${label} | SoloHitz`,
    description: config?.desc ?? `Berita dan artikel kategori ${slug} di Kota Surakarta.`,
  };
}

export default async function KategoriPage({ params }: Props) {
  const { slug } = await params;

  const beritaList = await getBeritaList({
    status: 'terbit',
    kategoriSlug: slug,
    orderBy: 'tanggal_publish',
    ascending: false,
  });

  const config = KATEGORI_CONFIG[slug.toLowerCase()];
  const label = config?.label ?? `Kategori ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
  const desc = config?.desc ?? `Kumpulan berita dan artikel kategori ${slug} di Kota Surakarta.`;
  const badgeClass = config?.badgeClass ?? 'bg-blue-50 text-[#1264A3] border-blue-200';
  const icon = config?.icon ?? <Compass className="w-3.5 h-3.5" />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-8 border-b border-[#E6E6E6] space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${badgeClass}`}
            >
              {icon}
              <span>Kategori {slug.charAt(0).toUpperCase() + slug.slice(1)}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1D]">
              {label}
            </h1>
            <p className="text-sm text-[#696969] max-w-2xl">{desc}</p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <Link
                href="/berita"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E6E6E6] text-[#1D1D1D] hover:bg-[#F4EDE4] transition-colors"
              >
                Semua
              </Link>
              {['wisata', 'kuliner', 'budaya'].map((cat) => (
                <Link
                  key={cat}
                  href={`/kategori/${cat}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    slug === cat
                      ? 'bg-[#4A154B] text-white'
                      : 'bg-white border border-[#E6E6E6] text-[#1D1D1D] hover:bg-[#F4EDE4]'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Link>
              ))}
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
                <Newspaper className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-base font-semibold text-[#1D1D1D]">
                  Belum ada berita {slug}
                </p>
                <p className="text-xs text-[#696969]">
                  Belum terdapat artikel untuk kategori ini.
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
