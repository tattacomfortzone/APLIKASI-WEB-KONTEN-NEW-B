'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Compass, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Wisata', href: '/berita/wisata' },
    { name: 'Kuliner', href: '/berita/kuliner' },
    { name: 'Budaya', href: '/berita/budaya' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E6E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-[#4A154B] flex items-center justify-center text-white font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-[#4A154B]">
              Solo<span className="text-[#1264A3]">Hitz</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#4A154B] border-b-2 border-[#4A154B] pb-1'
                      : 'text-[#1D1D1D] hover:text-[#4A154B]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar or Toggle */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-60 pl-9 pr-4 py-2 text-sm rounded-full bg-[#F4EDE4]/60 border border-transparent focus:border-[#4A154B] focus:bg-white focus:outline-none transition-all placeholder:text-[#696969]"
              />
              <Search className="w-4 h-4 text-[#696969] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            <Link
              href="/admin"
              className="btn-pill-secondary text-xs !py-2 !px-4 hover:shadow-sm"
              title="Akses Dashboard Admin"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Kelola Konten</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-[#1D1D1D] hover:bg-[#F9F0FF]"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-[#1D1D1D] hover:bg-[#F9F0FF]"
              aria-label="Buka Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Popdown */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-4 pt-1 bg-white border-b border-[#E6E6E6]">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Cari berita wisata, kuliner, budaya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full bg-[#F4EDE4]/60 border border-[#E6E6E6] focus:border-[#4A154B] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#696969] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#E6E6E6] px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-[#F9F0FF] text-[#4A154B] font-bold'
                    : 'text-[#1D1D1D] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#E6E6E6]">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full btn-pill-primary text-center justify-center text-sm py-2.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Kelola Konten (Admin)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
