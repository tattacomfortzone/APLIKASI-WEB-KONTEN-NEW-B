import React from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { ToastProvider } from '@/components/ui/toast';

export const metadata = {
  title: 'Admin Management — SoloHitz',
  description: 'Panel pengelolaan konten berita wisata, kuliner, dan budaya Solo.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
