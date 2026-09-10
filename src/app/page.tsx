'use client';

import React, { useEffect, useState } from 'react';

interface Berita {
  id: string;
  title: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  created_at?: string;
}

export default function HomePage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        try {
          const res = await fetch(
            `${supabaseUrl}/rest/v1/berita?select=*&order=created_at.desc`,
            {
              headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setBeritaList(data);
          }
        } catch (err) {
          console.error('Gagal memuat berita:', err);
        }
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Jelajahi Cerita dan Pesona Kota Solo</h1>
          <p className="text-gray-600 mt-1">
            Temukan berita dan cerita terkini seputar kebudayaan, keindahan, dan pesona Kota Solo.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">Memuat berita...</p>
          </div>
        ) : beritaList.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border shadow-sm">
            <p className="text-gray-500">Belum ada berita yang dapat ditampilkan saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beritaList.map((item) => {
              // Perbaikan URL Gambar agar tidak error 404
              const imageSrc = item.imageUrl?.startsWith('http')
                ? item.imageUrl
                : '/file.svg';

              return (
                <article key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
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
                        {item.content || 'Klik untuk membaca berita selengkapnya.'}
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
