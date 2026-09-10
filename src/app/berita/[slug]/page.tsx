import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ViewCounter from '@/components/view-counter';
import BeritaCard from '@/components/berita-card';
import { getBeritaBySlug, getBeritaList } from '@/lib/supabase';
import {
  Calendar,
  MapPin,
  Eye,
  User,
  Share2,
  ArrowLeft,
  Bookmark,
  Tag as TagIcon,
} from 'lucide-react';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    return {
      title: 'Berita Tidak Ditemukan',
    };
  }

  return {
    title: `${berita.judul}`,
    description: berita.ringkasan || berita.isi?.substring(0, 160) || '',
    openGraph: {
      title: `${berita.judul} | SoloHitz`,
      description: berita.ringkasan || '',
      images: berita.gambar ? [berita.gambar] : [],
      type: 'article',
      publishedTime: berita.tanggal_publish || berita.dibuat_pada,
      authors: [berita.penulis || 'Redaksi SoloHitz'],
    },
  };
}

export default async function DetailBeritaPage({ params }: Props) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    notFound();
  }

  // Fetch related/latest articles
  const relatedBerita = await getBeritaList({
    status: 'terbit',
    limit: 3,
    orderBy: 'tanggal_publish',
    ascending: false,
  });

  const formattedDate = berita.tanggal_publish
    ? new Date(berita.tanggal_publish).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date(berita.dibuat_pada).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <ViewCounter id={berita.id} initialViews={berita.jumlah_dilihat || 0} />

      <main className="flex-1 py-10">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation & Category */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/berita"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#696969] hover:text-[#4A154B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Berita</span>
            </Link>

            {berita.kategori && (
              <Link
                href={`/berita/${berita.kategori.slug}`}
                className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#F9F0FF] text-[#4A154B] border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                {berita.kategori.nama}
              </Link>
            )}
          </div>

          {/* Article Header */}
          <header className="space-y-6 pb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1D1D1D] leading-[1.2]">
              {berita.judul}
            </h1>

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E6E6E6] text-xs sm:text-sm text-[#696969]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-[#1D1D1D]">
                  <User className="w-4 h-4 text-[#4A154B]" />
                  {berita.penulis || 'Redaksi SoloHitz'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#4A154B]" />
                  {berita.lokasi || 'Surakarta'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium text-[#1D1D1D]">
                  <Eye className="w-4 h-4 text-[#1264A3]" />
                  {berita.jumlah_dilihat || 0} Dilihat
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm my-6 bg-gray-100">
            <img
              src={
                berita.gambar &&
                (berita.gambar.startsWith('http://') ||
                  berita.gambar.startsWith('https://') ||
                  berita.gambar.startsWith('/'))
                  ? berita.gambar
                  : 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&auto=format&fit=crop&q=80'
              }
              alt={berita.judul}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Summary / Lead Paragraph */}
          {berita.ringkasan && (
            <div className="my-6 p-5 rounded-2xl bg-[#F4EDE4]/60 border-l-4 border-[#4A154B] text-base sm:text-lg font-medium text-[#1D1D1D] italic leading-relaxed">
              {berita.ringkasan}
            </div>
          )}

          {/* Main Body Content */}
          <div className="prose prose-lg max-w-none text-[#1D1D1D] leading-relaxed my-8 space-y-4">
            {berita.isi?.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return null;
              return (
                <p key={index} className="text-base sm:text-lg text-gray-800 leading-8">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tag Badges */}
          {berita.berita_tag && berita.berita_tag.length > 0 && (
            <div className="pt-6 border-t border-[#E6E6E6] my-8">
              <div className="flex items-center gap-2 mb-3">
                <TagIcon className="w-4 h-4 text-[#4A154B]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#696969]">
                  Topik Terkait
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {berita.berita_tag.map((bt) => {
                  if (!bt.tag) return null;
                  return (
                    <span
                      key={bt.tag.id}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#E6E6E6] text-[#1D1D1D] hover:bg-[#F4EDE4] transition-colors"
                    >
                      #{bt.tag.nama}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Author Bio Box */}
          <div className="p-6 rounded-2xl bg-white border border-[#E6E6E6] my-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4A154B] flex items-center justify-center text-white font-bold text-xl shrink-0">
              {berita.penulis?.charAt(0) || 'R'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1D]">
                Ditulis oleh {berita.penulis || 'Redaksi SoloHitz'}
              </h4>
              <p className="text-xs text-[#696969] mt-0.5">
                Jurnalis & kontributor konten pariwisata, kuliner, dan kebudayaan Kota Surakarta.
              </p>
            </div>
          </div>

          {/* Related News Section */}
          <section className="pt-12 border-t border-[#E6E6E6] my-12">
            <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1D] mb-6">
              Berita Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedBerita
                .filter((b) => b.id !== berita.id)
                .slice(0, 3)
                .map((item) => (
                  <BeritaCard key={item.id} berita={item} />
                ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
