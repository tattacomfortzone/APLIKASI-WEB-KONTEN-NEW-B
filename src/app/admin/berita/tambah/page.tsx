import React from 'react';
import BeritaForm from '@/components/berita-form';

export const metadata = {
  title: 'Tambah Berita Baru — SoloHitz Admin',
};

export default function TambahBeritaPage() {
  return <BeritaForm isEdit={false} />;
}
