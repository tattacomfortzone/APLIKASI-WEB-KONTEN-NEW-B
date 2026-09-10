const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sioylorgakibqpiaarlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3lsb3JnYWtpYnFwaWFhcmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODcxODUsImV4cCI6MjEwMzI2MzE4NX0.446wGRo681sNsRsvVS9hNcKncqX4u1mMuGFz_oW-JMU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase
    .from('berita')
    .select(`
      id,
      judul,
      status,
      slug,
      tanggal_publish,
      kategori (
        id,
        nama,
        slug
      )
    `)
    .eq('status', 'terbit')
    .order('tanggal_publish', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS! Found', data.length, 'published articles:');
    data.forEach(b => {
      console.log(`- [${b.id}] "${b.judul}" | Kategori: ${b.kategori ? b.kategori.nama : 'None'} (${b.kategori ? b.kategori.slug : '-'})`);
    });
  }
}

test();
