import { redirect, notFound } from 'next/navigation';
import { getBeritaById } from '@/lib/supabase';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Fallback route: /berita/id/[id]
 * Digunakan ketika slug berita tidak valid (misal slug berisi URL gambar).
 * Jika berita punya slug valid → redirect canonical ke /berita/[slug].
 * Jika tidak punya slug valid → redirect ke /berita/[id] dan
 * biarkan getBeritaBySlug menangani dengan fallback ID.
 */
export default async function BeritaByIdPage({ params }: Props) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    notFound();
  }

  const berita = await getBeritaById(Number(id));

  if (!berita) {
    notFound();
  }

  // Jika berita punya slug valid, redirect ke URL canonical
  const hasValidSlug =
    berita.slug &&
    berita.slug.trim() !== '' &&
    !berita.slug.startsWith('http://') &&
    !berita.slug.startsWith('https://') &&
    !berita.slug.startsWith('/');

  if (hasValidSlug) {
    redirect(`/berita/${berita.slug}`);
  }

  // Slug tidak valid → gunakan ID sebagai slug param agar [slug]/page.tsx bisa render
  // getBeritaBySlug sudah diupdate untuk fallback ke ID
  redirect(`/berita/${id}`);
}
