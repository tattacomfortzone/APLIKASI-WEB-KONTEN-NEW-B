'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Tags,
  Globe,
  PlusCircle,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'Semua Berita',
      href: '/admin/berita',
      icon: Newspaper,
      exact: false,
    },
    {
      title: 'Kategori',
      href: '/admin/kategori',
      icon: FolderTree,
      exact: false,
    },
    {
      title: 'Tag Berita',
      href: '/admin/tag',
      icon: Tags,
      exact: false,
    },
  ];

  const isActiveLink = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1D1D1D] text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#4A154B] border border-purple-400/30 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Solo<span className="text-purple-400">Hitz</span>
            </span>
            <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">
              Management CMS
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        <Link
          href="/admin/berita/tambah"
          onClick={() => setIsMobileOpen(false)}
          className="w-full btn-pill-primary !bg-[#4A154B] hover:!bg-[#611F69] text-sm py-2.5 shadow-md flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Berita</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-2 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Manajemen Konten
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActiveLink(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#4A154B] text-white shadow-sm font-semibold'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-300' : 'text-gray-400'}`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Akses Publik
          </p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
              <span>Lihat Website</span>
            </div>
            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400 group-hover:bg-blue-900 group-hover:text-blue-200">
              Live ↗
            </span>
          </Link>
        </div>
      </div>

      {/* User / Info Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#4A154B]/60 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-200">
            ADM
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Redaksi SoloHitz</p>
            <p className="text-[11px] text-gray-400 truncate">Mode Tanpa Login</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar for Admin */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#1D1D1D] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-800"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold text-white">
            Solo<span className="text-purple-400">Hitz</span> Admin
          </span>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="btn-pill-primary !bg-[#4A154B] text-xs !py-1.5 !px-3"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 border-r border-gray-800 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 flex flex-col">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
