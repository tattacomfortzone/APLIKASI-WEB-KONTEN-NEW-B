export type StatusBerita = 'draft' | 'terbit' | 'arsip';

export interface Kategori {
  id: string | number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  dibuat_pada: string;
}

export interface Tag {
  id: string | number;
  nama: string;
  slug: string;
  dibuat_pada: string;
}

export interface BeritaTag {
  berita_id: string | number;
  tag_id: string | number;
  tag?: Tag;
}

export interface Berita {
  id: string | number;
  kategori_id: string | number | null;
  judul: string;
  slug: string;
  ringkasan: string | null;
  isi: string | null;
  gambar: string | null;
  penulis: string | null;
  lokasi: string | null;
  status: StatusBerita;
  tanggal_publish: string | null;
  jumlah_dilihat: number;
  dibuat_pada: string;
  diperbarui_pada: string | null;
  diterbitkan_pada: string | null;
  kategori?: Kategori | null;
  berita_tag?: {
    tag_id: string | number;
    tag: Tag;
  }[];
}
