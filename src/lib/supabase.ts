import { createClient } from '@supabase/supabase-js';
import { Berita, Kategori, Tag, StatusBerita } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ================= BERITA SERVICES ================= //

export async function getBeritaList(options?: {
  status?: StatusBerita | 'all';
  kategoriSlug?: string;
  search?: string;
  limit?: number;
  orderBy?: 'tanggal_publish' | 'jumlah_dilihat' | 'dibuat_pada';
  ascending?: boolean;
}) {
  const {
    status = 'terbit',
    kategoriSlug,
    search,
    limit,
    orderBy = 'tanggal_publish',
    ascending = false,
  } = options || {};

  let query = supabase
    .from('berita')
    .select(`
      *,
      kategori (
        id,
        nama,
        slug,
        deskripsi
      )
    `);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  if (search && search.trim() !== '') {
    query = query.or(`judul.ilike.%${search}%,ringkasan.ilike.%${search}%,isi.ilike.%${search}%`);
  }

  query = query.order(orderBy, { ascending, nullsFirst: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching berita:', error);
    return [];
  }

  let result = (data || []) as Berita[];

  if (kategoriSlug) {
    result = result.filter(
      (b) => b.kategori && b.kategori.slug.toLowerCase() === kategoriSlug.toLowerCase()
    );
  }

  return result;
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  // Coba fetch by slug terlebih dahulu
  const { data, error } = await supabase
    .from('berita')
    .select(`
      *,
      kategori (
        id,
        nama,
        slug,
        deskripsi
      )
    `)
    .eq('slug', slug)
    .maybeSingle();

  // Jika tidak ketemu by slug, coba fetch by ID (fallback untuk slug yang tidak valid)
  let beritaData = data;
  if (!beritaData && !isNaN(Number(slug))) {
    const { data: dataById } = await supabase
      .from('berita')
      .select(`
        *,
        kategori (
          id,
          nama,
          slug,
          deskripsi
        )
      `)
      .eq('id', Number(slug))
      .maybeSingle();
    beritaData = dataById;
  }

  if (!beritaData) {
    console.error('Error fetching berita by slug/id:', slug);
    return null;
  }

  const berita = beritaData as Berita;

  try {
    const { data: btData } = await supabase
      .from('berita_tag')
      .select('tag_id')
      .eq('berita_id', berita.id);

    if (btData && btData.length > 0) {
      const tagIds = btData.map((item) => item.tag_id);
      const { data: tagData } = await supabase
        .from('tag')
        .select('*')
        .in('id', tagIds);

      if (tagData) {
        berita.berita_tag = tagData.map((t) => ({
          tag_id: t.id,
          tag: t,
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching tags for article:', err);
  }

  return berita;
}


export async function getBeritaById(id: string | number): Promise<Berita | null> {
  const { data, error } = await supabase
    .from('berita')
    .select(`
      *,
      kategori (
        id,
        nama,
        slug,
        deskripsi
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching berita by id:', error);
    return null;
  }

  const berita = data as Berita;

  try {
    const { data: btData } = await supabase
      .from('berita_tag')
      .select('tag_id')
      .eq('berita_id', berita.id);

    if (btData && btData.length > 0) {
      const tagIds = btData.map((item) => item.tag_id);
      const { data: tagData } = await supabase
        .from('tag')
        .select('*')
        .in('id', tagIds);

      if (tagData) {
        berita.berita_tag = tagData.map((t) => ({
          tag_id: t.id,
          tag: t,
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching tags for article:', err);
  }

  return berita;
}

export async function incrementBeritaViews(id: string | number, currentViews: number = 0) {
  try {
    const { error } = await supabase
      .from('berita')
      .update({ jumlah_dilihat: (currentViews || 0) + 1 })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing views:', error);
    }
  } catch (err) {
    console.error('View counter update exception:', err);
  }
}

export async function createBerita(
  beritaData: Partial<Berita>,
  tagIds: (string | number)[] = []
) {
  const payload = {
    ...beritaData,
    dibuat_pada: new Date().toISOString(),
    diperbarui_pada: new Date().toISOString(),
    jumlah_dilihat: 0,
  };

  if (beritaData.status === 'terbit') {
    const now = new Date().toISOString();
    payload.tanggal_publish = beritaData.tanggal_publish || now;
    payload.diterbitkan_pada = now;
  } else {
    payload.tanggal_publish = null;
    payload.diterbitkan_pada = null;
  }

  const { data, error } = await supabase
    .from('berita')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  if (tagIds.length > 0 && data) {
    const tagsPayload = tagIds.map((tag_id) => ({
      berita_id: data.id,
      tag_id,
    }));
    const { error: tagError } = await supabase.from('berita_tag').insert(tagsPayload);
    if (tagError) console.error('Error linking tags:', tagError);
  }

  return data;
}

export async function updateBerita(
  id: string | number,
  beritaData: Partial<Berita>,
  tagIds?: (string | number)[]
) {
  const payload: Record<string, any> = {
    ...beritaData,
    diperbarui_pada: new Date().toISOString(),
  };

  if (beritaData.status === 'terbit') {
    if (!beritaData.tanggal_publish) {
      payload.tanggal_publish = new Date().toISOString();
    }
    payload.diterbitkan_pada = new Date().toISOString();
  } else if (beritaData.status === 'draft') {
    payload.tanggal_publish = null;
    payload.diterbitkan_pada = null;
  }

  // Remove relation fields if present
  delete payload.kategori;
  delete payload.berita_tag;

  const { data, error } = await supabase
    .from('berita')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (tagIds !== undefined) {
    // Delete existing relation
    await supabase.from('berita_tag').delete().eq('berita_id', id);

    if (tagIds.length > 0) {
      const tagsPayload = tagIds.map((tag_id) => ({
        berita_id: id,
        tag_id,
      }));
      await supabase.from('berita_tag').insert(tagsPayload);
    }
  }

  return data;
}

export async function deleteBerita(id: string | number) {
  // 1. Delete relation in berita_tag first
  await supabase.from('berita_tag').delete().eq('berita_id', id);

  // 2. Delete berita
  const { error } = await supabase.from('berita').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ================= KATEGORI SERVICES ================= //

export async function getKategoriList(): Promise<Kategori[]> {
  const { data, error } = await supabase
    .from('kategori')
    .select('*')
    .order('nama', { ascending: true });

  if (error) {
    console.error('Error fetching kategori:', error);
    return [];
  }
  return data || [];
}

export async function createKategori(kategori: { nama: string; slug: string; deskripsi?: string }) {
  const { data, error } = await supabase
    .from('kategori')
    .insert([{ ...kategori, dibuat_pada: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateKategori(
  id: string | number,
  kategori: { nama: string; slug: string; deskripsi?: string }
) {
  const { data, error } = await supabase
    .from('kategori')
    .update(kategori)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteKategori(id: string | number) {
  // Check if used by berita
  const { data: berita, error: checkError } = await supabase
    .from('berita')
    .select('id')
    .eq('kategori_id', id)
    .limit(1);

  if (checkError) throw checkError;
  if (berita && berita.length > 0) {
    throw new Error('Kategori ini sedang digunakan oleh berita dan tidak dapat dihapus.');
  }

  const { error } = await supabase.from('kategori').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ================= TAG SERVICES ================= //

export async function getTagList(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tag')
    .select('*')
    .order('nama', { ascending: true });

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
  return data || [];
}

export async function createTag(tag: { nama: string; slug: string }) {
  const { data, error } = await supabase
    .from('tag')
    .insert([{ ...tag, dibuat_pada: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTag(id: string | number, tag: { nama: string; slug: string }) {
  const { data, error } = await supabase
    .from('tag')
    .update(tag)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTag(id: string | number) {
  // Delete relation first
  await supabase.from('berita_tag').delete().eq('tag_id', id);
  const { error } = await supabase.from('tag').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ================= STATS SERVICES ================= //

export async function getDashboardStats() {
  const { data: allBerita, error } = await supabase
    .from('berita')
    .select('id, status, jumlah_dilihat, kategori_id, dibuat_pada');

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalBerita: 0,
      beritaTerbit: 0,
      draft: 0,
      arsip: 0,
      totalDilihat: 0,
    };
  }

  const totalBerita = allBerita?.length || 0;
  let beritaTerbit = 0;
  let draft = 0;
  let arsip = 0;
  let totalDilihat = 0;

  for (const b of allBerita || []) {
    if (b.status === 'terbit') beritaTerbit++;
    else if (b.status === 'draft') draft++;
    else if (b.status === 'arsip') arsip++;

    totalDilihat += Number(b.jumlah_dilihat || 0);
  }

  return {
    totalBerita,
    beritaTerbit,
    draft,
    arsip,
    totalDilihat,
  };
}
