const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sioylorgakibqpiaarlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiIyOjF9.m0CH_eyeSZK9KxQqf5bN5Gg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    // Check berita count by status
    const { data: berita, error: beritaError } = await supabase
      .from('berita')
      .select('id, judul, status, tanggal_publish')
      .limit(5);
    
    if (beritaError) {
      console.error('BERITA ERROR:', beritaError.message);
      console.error('Full error:', beritaError);
    } else {
      console.log('BERITA DATA:', JSON.stringify(berita, null, 2));
      console.log('Total berita:', berita?.length || 0);
    }
    
    // Check kategori
    const { data: kategori, error: kategoriError } = await supabase
      .from('kategori')
      .select('id, nama, slug');
    
    if (kategoriError) {
      console.error('KATEGORI ERROR:', kategoriError.message);
    } else {
      console.log('KATEGORI DATA:', JSON.stringify(kategori, null, 2));
    }
    
    // Check tag
    const { data: tag, error: tagError } = await supabase
      .from('tag')
      .select('id, nama, slug');
    
    if (tagError) {
      console.error('TAG ERROR:', tagError.message);
    } else {
      console.log('TAG DATA:', JSON.stringify(tag, null, 2));
    }
    
    // Check RLS policies info
    console.log('\n--- Checking if berita has RLS ---');
    
  } catch (e) {
    console.error('EXCEPTION:', e);
  }
}

check();