import React from 'react';
import Link from 'next/link';
import { Compass, MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E6E6E6] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#4A154B] flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-[#4A154B]">
                Solo<span className="text-[#1264A3]">Hitz</span>
              </span>
            </Link>
            <p className="text-sm text-[#696969] max-w-md leading-relaxed">
              Portal berita dan direktori konten terlengkap seputar keindahan pariwisata, kenikmatan kuliner khas, dan keluhuran budaya di Kota Bengawan Surakarta.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#696969]">
              <MapPin className="w-4 h-4 text-[#4A154B]" />
              <span>Surakarta, Jawa Tengah, Indonesia</span>
            </div>
          </div>

          {/* Kategori Populer */}
          <div>
            <h4 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-wider mb-4">
              Kategori
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/berita/wisata" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Wisata Solo
                </Link>
              </li>
              <li>
                <Link href="/berita/kuliner" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Kuliner Legendaris
                </Link>
              </li>
              <li>
                <Link href="/berita/budaya" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Budaya & Seni Jawa
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Semua Berita
                </Link>
              </li>
            </ul>
          </div>

          {/* Manajemen & Tautan */}
          <div>
            <h4 className="text-sm font-bold text-[#1D1D1D] uppercase tracking-wider mb-4">
              Redaksi & Kelola
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/admin" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Dashboard Manajemen
                </Link>
              </li>
              <li>
                <Link href="/admin/berita/tambah" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Tulis Berita Baru
                </Link>
              </li>
              <li>
                <Link href="/admin/kategori" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Kelola Kategori
                </Link>
              </li>
              <li>
                <Link href="/admin/tag" className="text-[#696969] hover:text-[#4A154B] transition-colors">
                  Kelola Tag
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#E6E6E6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#696969]">
          <p>© {new Date().getFullYear()} SoloHitz. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk Kota Solo
          </p>
        </div>
      </div>
    </footer>
  );
}
