'use client';

import React from 'react';

export default function HomePage() {
  const beritaList = [
    {
      id: '1',
      title: 'Festival Kebudayaan Solo Mangkunegaran Kembali Digelar',
      category: 'Kebudayaan',
      description: 'Nikmati ragam pertunjukan seni, tarian tradisional, dan kuliner khas Solo di Pura Mangkunegaran.',
      imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&auto=format&fit=crop&q=80',
      date: '10 September 2026',
    },
    {
      id: '2',
      title: 'Wisata Kuliner Pasar Gede: Surga Jajanan Pasar Tradisional',
      category: 'Kuliner',
      description: 'Menelusuri kelezatan dawet selasih, timlo, dan lenjongan khas Solo yang melegenda.',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      date: '09 September 2026',
    },
    {
      id: '3',
      title: 'Revitalisasi Area Batik Laweyan Makin Memikat Wisatawan',
      category: 'Pariwisata',
      description: 'Kampung Batik Laweyan menghadirkan konsep susur gang bersejarah dan workshop membatik.',
      imageUrl: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=600&auto=format&fit=crop&q=80',
      date: '08 September 2026',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header / Hero */}
      <div className="bg-emerald-700 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">SoloHitz</h1>
        <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
          Jelajahi Cerita dan Pesona Kota Solo — Informasi Kebudayaan, Wisata, dan Kuliner Terkini.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Berita Utama</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beritaList.map((item) => (
            <article key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col hover:shadow-lg transition">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition">
                  Baca Selengkapnya
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
