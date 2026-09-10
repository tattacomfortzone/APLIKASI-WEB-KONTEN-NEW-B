export const dynamic = 'force-dynamic';

interface Berita {
  id: string;
  title: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  created_at?: string;
}

export default async function HomePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let beritaList: Berita[] = [];

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/berita?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          cache: 'no-store',
        }
      );
      if (res.ok) {
        beritaList = await res.json();
      }
    } catch (error) {
      console.error('Gagal mengambil data berita:', error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Portal Berita Kota Solo</h1>
          <p className="text-gray-600 mt-1">Informasi dan berita terkini seputar Solo dan sekitarnya.</p>
        </header>

        {beritaList.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border shadow-sm">
            <p className="text-gray-500">Belum ada berita yang ditampilkan atau koneksi Supabase sedang diproses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beritaList.map((item) => {
              const imageSrc = item.imageUrl?.startsWith('http')
                ? item.imageUrl
                : '/file.svg';

              return (
                <article key={item.id} className="bg-white rounded-lg shadow border overflow-hidden flex flex-col">
                  <div className="h-48 w-full bg-gray-200 relative">
                    <img
                      src={imageSrc}
                      alt={item.title || 'Gambar Berita'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                        {item.content || 'Klik untuk membaca selengkapnya.'}
                      </p>
                    </div>
                    <a
                      href={`/berita/${item.slug || item.id}`}
                      className="mt-4 inline-block text-blue-600 font-medium text-sm hover:underline"
                    >
                      Baca Selengkapnya &rarr;
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
