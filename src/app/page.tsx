export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto text-center">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Portal Berita Kota Solo</h1>
          <p className="text-gray-600 mt-2">Informasi dan berita terkini seputar Solo dan sekitarnya.</p>
        </header>

        <div className="bg-white rounded-lg p-12 shadow border max-w-xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Selamat Datang di Portal Berita</h2>
          <p className="text-gray-600">
            Aplikasi web konten berita berhasil dijalankan dan siap dipergunakan.
          </p>
        </div>
      </div>
    </main>
  );
}
