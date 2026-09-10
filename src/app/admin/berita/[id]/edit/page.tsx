import React from 'react';
import { notFound } from 'next/navigation';
import BeritaForm from '@/components/berita-form';
import { getBeritaById } from '@/lib/supabase';

export const revalidate = 0;

interface EditBeritaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBeritaPage({ params }: EditBeritaPageProps) {
  const { id } = await params;
  const berita = await getBeritaById(id);

  if (!berita) {
    notFound();
  }

  return <BeritaForm initialData={berita} isEdit={true} />;
}
