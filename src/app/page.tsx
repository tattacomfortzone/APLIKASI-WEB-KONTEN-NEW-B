import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BeritaCard from '@/components/berita-card';
import { getBeritaList, getKategoriList } from '@/lib/supabase';
import { Compass, Flame, Sparkles, ArrowRight, UtensilsCrossed, Landmark, Trees } from 'lucide-react';

export const revalidate = 0; // Dynamic server render for fresh news

export default async function HomePage() {
  // Fetch news and categories from Supabase
  const [latestBerita, popularBerita, categories] = await Promise.all([
    getBeritaList({ status: 'terbit', limit: 8, orderBy: 'tanggal_publish', ascending: false }),
    getBeritaList({ status: 'terbit', limit: 5, orderBy: 'jumlah_dilihat', ascending: false }),
    getKategoriList(),
  ]);

  const featuredBerita = latestBerita[0];
  const remainingLatest = latestBerita.slice(1);

  const getCategoryIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'wisata':
        return <Trees className="w-5 h-5 text-emerald-700" />;
      case 'kuliner':
        return <UtensilsCrossed className="w-5 h-5 text-amber-700" />;
      case 'budaya':
        return <Landmark className="w-5 h-5 text-[#4A154B]" />;
      default:
        return <Compass className="w-5 h-5 text-[#1264A3]" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pastel-mesh-bg border-b border-[#E6E6E6] pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Hero Copy */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9F0FF] border border-purple-200 text-[#4A154B] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#4A154B]" />
                  <span>Portal Berita Resmi Kota Solo</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1D1D1D] leading-[1.1]">
                  Jelajahi Cerita dan <span className="text-[#4A154B]">Pesona Kota Solo</span>
                </h1>

                <p className="text-base sm:text-lg text-[#696969] leading-relaxed max-w-lg">
                  Temukan berita dan direktori terkini seputar destinasi wisata menarik, kelezatan kuliner otentik, dan tradisi budaya luhur di Surakarta.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/berita" className="btn-pill-primary shadow-md">
                    <span>Jelajahi Berita</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/berita/wisata" className="btn-pill-outline">
                    Wisata Solo
                  </Link>
                  <Link href="/berita/kuliner" className="btn-pill-outline">
                    Kuliner Khas
                  </Link>
                </div>
              </div>

              {/* Hero Featured Card */}
              <div className="lg:col-span-6">
                {featuredBerita ? (
                  <BeritaCard berita={featuredBerita} featured={true} />
                ) : (
                  <div className="bg-white/80 border border-dashed border-gray-300 rounded-2xl p-10 text-center space-y-3">
                    <p className="text-sm font-medium text-[#696969]">Belum ada berita yang diterbitkan.</p>
                    <Link href="/admin/berita/tambah" className="btn-pill-primary text-xs inline-flex">
                      + Tambah Berita Pertama
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* KATEGORI UTAMA SECTION */}
        <section className="py-12 border-b border-[#E6E6E6] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">
                  Kategori Pilihan
                </h2>
                <p className="text-xs sm:text-sm text-[#696969]">
                  Temukan artikel berdasarkan topik yang Anda minati
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: 'Wisata Solo',
                  slug: 'wisata',
                  desc: 'Objek wisata sejarah, taman kota, dan tempat rekreasi keluarga di Solo.',
                  bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-100',
                  icon: <Trees className="w-6 h-6 text-emerald-700" />,
                },
                {
                  title: 'Kuliner Legendaris',
                  slug: 'kuliner',
                  desc: 'Cita rasa khas Selat Solo, Timlo, Tengkleng, Serabi hingga jajanan pasar.',
                  bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-100',
                  icon: <UtensilsCrossed className="w-6 h-6 text-amber-700" />,
                },
                {
                  title: 'Budaya & Tradisi',
                  slug: 'budaya',
                  desc: 'Keraton Surakarta, pagelaran wayang, seni batik, dan adat istiadat Jawa.',
                  bg: 'bg-[#F9F0FF] hover:bg-purple-100/70 border-purple-100',
                  icon: <Landmark className="w-6 h-6 text-[#4A154B]" />,
                },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/berita/${cat.slug}`}
                  className={`p-6 rounded-2xl border transition-all duration-200 group ${cat.bg}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-white rounded-xl shadow-xs">{cat.icon}</div>
                    <ArrowRight className="w-4 h-4 text-[#696969] group-hover:translate-x-1 group-hover:text-[#1D1D1D] transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1D1D] group-hover:text-[#4A154B] mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#696969] leading-relaxed">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT: LATEST NEWS + POPULAR SIDEBAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Berita Terbaru Grid (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6E6E6]">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1D]">
                    Berita Terbaru
                  </h2>
                  <p className="text-xs sm:text-sm text-[#696969]">
                    Informasi terhangat dan terupdate di sekeliling Kota Solo
                  </p>
                </div>
                <Link
                  href="/berita"
                  className="text-xs sm:text-sm font-bold text-[#4A154B] hover:text-[#611F69] flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {remainingLatest.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {remainingLatest.map((item) => (
                    <BeritaCard key={item.id} berita={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#E6E6E6] rounded-2xl p-8 text-center text-sm text-[#696969]">
                  {featuredBerita
                    ? 'Tidak ada berita terbaru tambahan.'
                    : 'Belum ada berita terbit.'}
                </div>
              )}
            </div>

            {/* Sidebar: Berita Populer (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E6E6E6]">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-lg font-bold tracking-tight text-[#1D1D1D]">
                    Berita Populer
                  </h3>
                </div>

                {popularBerita.length > 0 ? (
                  <div className="divide-y divide-[#E6E6E6]">
                    {popularBerita.map((item, index) => (
                      <Link
                        key={item.id}
                        href={`/berita/${item.slug}`}
                        className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4 group"
                      >
                        <span className="text-2xl font-black text-gray-300 group-hover:text-[#4A154B] transition-colors shrink-0 w-6">
                          0{index + 1}
                        </span>
                        <div className="space-y-1 flex-1">
                          {item.kategori && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                              {item.kategori.nama}
                            </span>
                          )}
                          <h4 className="text-sm font-semibold text-[#1D1D1D] group-hover:text-[#4A154B] line-clamp-2 transition-colors">
                            {item.judul}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-[#696969]">
                            <span>{item.jumlah_dilihat || 0} pembaca</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#696969] text-center py-4">
                    Belum ada data berita populer.
                  </p>
                )}
              </div>

              {/* Newsletter / CTA Banner */}
              <div className="bg-[#4A154B] rounded-2xl p-6 text-white text-center space-y-4 shadow-sm">
                <h4 className="text-lg font-bold">Punya Informasi Menarik Seputar Solo?</h4>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Bantu kami mempublikasikan cerita kuliner, agenda kebudayaan, dan wisata menarik di Surakarta.
                </p>
                <Link
                  href="/admin/berita/tambah"
                  className="w-full btn-pill-secondary !bg-white !text-[#4A154B] hover:!bg-[#F9F0FF] text-xs py-2.5 font-bold"
                >
                  Tulis Artikel Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
