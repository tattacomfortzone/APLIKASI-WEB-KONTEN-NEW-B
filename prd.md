# PRD.md — SoloHitz

## 1. Overview

**Nama Aplikasi:** SoloHitz
**Jenis:** Aplikasi Manajemen Konten Berita
**Platform:** Web
**Framework:** Next.js
**Database:** Supabase PostgreSQL
**UI:** Modern, clean, profesional, editorial
**Authentication:** Tidak menggunakan login

SoloHitz adalah aplikasi manajemen konten berita yang digunakan untuk mengelola dan menampilkan berita seputar **wisata, kuliner, dan budaya di Solo/Surakarta**.

Aplikasi memiliki dua bagian utama:

1. **Halaman Manajemen Konten**

   * Dashboard
   * Daftar berita
   * Tambah berita
   * Edit berita
   * Hapus berita
   * Kelola kategori
   * Kelola tag
   * Filter dan pencarian
   * Status publikasi

2. **Halaman Website Publik**

   * Beranda
   * Daftar berita
   * Detail berita
   * Filter berdasarkan kategori
   * Pencarian berita
   * Berita terbaru
   * Berita populer

---

# 2. Tujuan Produk

Membangun website SoloHitz yang dapat:

* Mengelola berita wisata Solo.
* Mengelola berita kuliner Solo.
* Mengelola berita budaya Solo.
* Menyimpan berita menggunakan Supabase.
* Menampilkan berita yang berstatus `terbit`.
* Mengelola kategori dan tag.
* Memudahkan pencarian berita.
* Menampilkan statistik sederhana seperti jumlah berita dan jumlah pembaca.
* Memiliki tampilan modern dan responsif.

---

# 3. Target Pengguna

### Admin/Redaksi

Digunakan untuk:

* Membuat berita.
* Mengedit berita.
* Menghapus berita.
* Mengubah status berita.
* Mengatur kategori.
* Mengatur tag.
* Melihat statistik konten.

### Pengunjung

Digunakan untuk:

* Membaca berita.
* Mencari berita.
* Memilih kategori.
* Melihat berita populer.
* Membaca detail artikel.

Karena aplikasi tidak menggunakan login, seluruh halaman dapat diakses tanpa autentikasi.

---

# 4. Teknologi

## Frontend

Gunakan:

* Next.js App Router
* TypeScript
* React
* Tailwind CSS
* Lucide React untuk icon
* Inter sebagai font utama

## Backend

Gunakan:

* Supabase
* PostgreSQL
* Supabase JavaScript Client

## Deployment

Rekomendasi:

* GitHub untuk repository
* Vercel untuk deployment
* Supabase untuk database

---

# 5. Database

Database **sudah tersedia di Supabase** dan jangan membuat ulang struktur tabel.

Gunakan tabel berikut:

### kategori

```text
id
nama
slug
deskripsi
dibuat_pada
```

### berita

```text
id
kategori_id
judul
slug
ringkasan
isi
gambar
penulis
lokasi
status
tanggal_publish
jumlah_dilihat
dibuat_pada
diperbarui_pada
diterbitkan_pada
```

### tag

```text
id
nama
slug
dibuat_pada
```

### berita_tag

```text
berita_id
tag_id
```

---

# 6. Relasi Database

Relasi utama:

```text
KATEGORI
   │
   │ 1
   │
   │ N
   ▼
BERITA
   │
   │ N
   │
   ▼
BERITA_TAG
   ▲
   │ N
   │
  TAG
```

Relasi:

```text
kategori.id
      ↓
berita.kategori_id
```

dan:

```text
berita.id
      ↓
berita_tag.berita_id

tag.id
      ↓
berita_tag.tag_id
```

Satu kategori dapat memiliki banyak berita.

Satu berita dapat memiliki banyak tag.

Satu tag dapat digunakan oleh banyak berita.

---

# 7. Aturan Data Berita

## Status

Gunakan tiga status:

```text
draft
terbit
arsip
```

### Draft

Berita belum ditampilkan di website publik.

### Terbit

Berita ditampilkan di website publik.

### Arsip

Berita tidak ditampilkan pada daftar berita aktif.

---

# 8. Struktur Halaman

Gunakan struktur:

```text
/
├── Beranda
│
├── berita
│   ├── Semua Berita
│   ├── Wisata
│   ├── Kuliner
│   └── Budaya
│
├── berita/[slug]
│   └── Detail Berita
│
└── admin
    ├── Dashboard
    ├── Berita
    ├── Berita/Tambah
    ├── Berita/[id]/Edit
    ├── Kategori
    └── Tag
```

---

# 9. Dashboard Management

Route:

```text
/admin
```

Dashboard menjadi halaman utama manajemen konten.

Tampilkan statistik:

```text
Total Berita
Berita Terbit
Draft
Arsip
Total Dilihat
```

Contoh:

```text
┌─────────────────────────────────────────────┐
│ SoloHitz Management                         │
│ Kelola konten berita Solo                   │
├────────────┬────────────┬────────────┬──────┤
│ Total      │ Terbit     │ Draft      │ View │
│ 128        │ 96         │ 24         │ 12K  │
└────────────┴────────────┴────────────┴──────┘
```

Di bawah statistik tampil:

* Berita terbaru
* Berita paling banyak dilihat
* Distribusi kategori
* Tombol `Tambah Berita`

---

# 10. Manajemen Berita

Route:

```text
/admin/berita
```

Tampilkan tabel berita.

Kolom:

```text
Judul
Kategori
Penulis
Status
Dilihat
Tanggal
Aksi
```

Fitur:

* Search
* Filter kategori
* Filter status
* Sorting terbaru
* Edit
* Hapus
* Ubah status

Contoh:

```text
┌─────────────────────────────────────────────────────┐
│ Berita                              + Tambah Berita │
├─────────────────────────────────────────────────────┤
│ Cari berita...       Kategori ▼      Status ▼       │
├─────────────────────────────────────────────────────┤
│ Judul       Kategori    Status    Views    Aksi     │
│ Wisata...   Wisata      Terbit    245      Edit     │
│ Kuliner...  Kuliner     Draft     0        Edit     │
│ Budaya...   Budaya      Terbit    512      Edit     │
└─────────────────────────────────────────────────────┘
```

---

# 11. Form Tambah Berita

Route:

```text
/admin/berita/tambah
```

Field:

### Judul

```text
input text
```

### Slug

Otomatis dibuat dari judul.

Contoh:

```text
judul:
Menjelajahi Keindahan Wisata Solo

slug:
menjelajahi-keindahan-wisata-solo
```

### Kategori

Dropdown dari tabel `kategori`.

Pilihan contoh:

```text
Wisata
Kuliner
Budaya
```

### Ringkasan

Textarea singkat.

### Isi

Editor konten berita.

### Gambar

Input URL gambar.

Field menggunakan kolom:

```text
gambar
```

### Penulis

Default:

```text
Redaksi SoloEdu
```

Tetapi dapat diedit.

### Lokasi

Default:

```text
Surakarta
```

### Status

Pilihan:

```text
Draft
Terbit
Arsip
```

### Tanggal Publish

Date/time picker.

---

# 12. Aksi Form Berita

Tombol:

```text
Simpan Draft
Terbitkan Berita
Batal
```

Jika status `terbit`, isi:

```text
tanggal_publish
diterbitkan_pada
```

Jika draft:

```text
tanggal_publish = null
```

Setiap perubahan meng-update:

```text
diperbarui_pada
```

---

# 13. Edit Berita

Route:

```text
/admin/berita/[id]/edit
```

Form menggunakan data dari Supabase berdasarkan ID.

Admin dapat mengubah:

* Judul
* Slug
* Kategori
* Ringkasan
* Isi
* Gambar
* Penulis
* Lokasi
* Status
* Tanggal publish

Setelah berhasil:

```text
Update berita
↓
Update diperbarui_pada
↓
Redirect ke /admin/berita
```

---

# 14. Hapus Berita

Sebelum menghapus tampilkan confirmation dialog:

```text
Hapus berita?

Apakah kamu yakin ingin menghapus
"Judul Berita"?

[ Batal ] [ Hapus ]
```

Sebelum menghapus berita, hapus relasi pada:

```text
berita_tag
```

kemudian hapus data:

```text
berita
```

---

# 15. Manajemen Kategori

Route:

```text
/admin/kategori
```

CRUD:

* Tambah kategori
* Edit kategori
* Hapus kategori

Data:

```text
Nama
Slug
Deskripsi
```

Kategori awal:

```text
Wisata
Kuliner
Budaya
```

Jika kategori masih digunakan oleh berita, tampilkan peringatan sebelum menghapus.

---

# 16. Manajemen Tag

Route:

```text
/admin/tag
```

Fitur:

* Tambah tag
* Edit tag
* Hapus tag
* Search tag

Contoh:

```text
Solo
Surakarta
Wisata Solo
Kuliner Solo
Budaya Jawa
Tradisi
Event
```

Saat membuat berita, admin dapat memilih beberapa tag.

Relasi disimpan pada:

```text
berita_tag
```

---

# 17. Website Publik

## Beranda

Route:

```text
/
```

Bagian:

### Navbar

Logo:

```text
SoloHitz
```

Menu:

```text
Home
Wisata
Kuliner
Budaya
```

Tambahkan tombol pencarian.

---

# 18. Hero Section

Hero menampilkan berita utama.

Contoh:

```text
SOLOHITZ

Jelajahi Cerita dan
Pesona Kota Solo

Temukan berita terbaru tentang
wisata, kuliner, dan budaya Solo.

[ Jelajahi Berita ]
```

Di samping atau bawah hero tampil featured article.

Gunakan pastel-mesh gradient sebagai latar dekoratif sesuai design reference.

---

# 19. Berita Terbaru

Section:

```text
Berita Terbaru
```

Card berita:

```text
┌─────────────────────────┐
│                         │
│       FOTO BERITA       │
│                         │
├─────────────────────────┤
│ WISATA                  │
│ Judul berita            │
│ Ringkasan singkat...    │
│                         │
│ Redaksi • 10 Sep 2026   │
└─────────────────────────┘
```

Hanya tampilkan:

```text
status = 'terbit'
```

Urutkan:

```text
tanggal_publish DESC
```

---

# 20. Kategori Berita

Tampilkan tiga kategori utama:

```text
Wisata
Kuliner
Budaya
```

Setiap kategori memiliki halaman:

```text
/berita/wisata
/berita/kuliner
/berita/budaya
```

Filter berdasarkan:

```text
kategori.slug
```

---

# 21. Detail Berita

Route:

```text
/berita/[slug]
```

Tampilan:

```text
Kategori

Judul Berita

Penulis • Lokasi • Tanggal

┌───────────────────────────────┐
│                               │
│        GAMBAR BERITA          │
│                               │
└───────────────────────────────┘

Ringkasan

Isi berita...
```

Ketika halaman dibuka, `jumlah_dilihat` bertambah 1.

Gunakan slug sebagai URL, bukan ID.

Contoh:

```text
/berita/menjelajahi-keindahan-wisata-solo
```

---

# 22. Berita Populer

Gunakan:

```text
ORDER BY jumlah_dilihat DESC
```

Tampilkan 5 berita dengan jumlah pembaca tertinggi.

Section:

```text
Berita Populer
```

---

# 23. Search

Tambahkan pencarian berita.

Search berdasarkan:

```text
judul
ringkasan
isi
```

Contoh:

```text
/search?q=kuliner
```

Hasil hanya berasal dari berita:

```text
status = 'terbit'
```

---

# 24. UI Design System

Gunakan gaya visual modern dengan referensi design system yang diberikan.

### Warna utama

Aubergine:

```text
#4A154B
```

Aubergine press:

```text
#611F69
```

Link blue:

```text
#1264A3
```

White:

```text
#FFFFFF
```

Cream:

```text
#F4EDE4
```

Lavender:

```text
#F9F0FF
```

Ink:

```text
#1D1D1D
```

Muted:

```text
#696969
```

Warna tersebut mengikuti token visual pada reference yang diberikan.

---

# 25. Typography

Gunakan:

```text
Inter
```

Display heading:

```text
font-weight: 700
```

Body:

```text
font-weight: 400
```

Heading besar menggunakan letter-spacing negatif untuk memberikan kesan editorial yang rapat.

---

# 26. Button

Semua button menggunakan bentuk pill.

Primary:

```text
background: #4A154B
color: white
border-radius: 90px
padding: 14px 28px
```

Secondary:

```text
background: #F9F0FF
color: #1D1D1D
border-radius: 90px
```

Gunakan pill button secara konsisten sesuai reference design.

---

# 27. Card

Card berita:

```text
background: #FFFFFF
border: 1px solid #E6E6E6
border-radius: 16px
overflow: hidden
```

Gunakan image aspect ratio:

```text
16 / 9
```

Card memiliki hover:

```text
transform: translateY(-2px)
```

dan shadow yang sangat ringan.

---

# 28. Layout Dashboard

Dashboard admin berbeda dari website publik.

Gunakan:

```text
Sidebar
Content Area
```

Sidebar:

```text
SoloHitz
────────────
Dashboard

Konten
  Berita
  Kategori
  Tag

Website
  Lihat Website
```

Desktop:

```text
┌──────────────┬────────────────────────────┐
│              │                            │
│   SIDEBAR    │       CONTENT              │
│              │                            │
│ Dashboard    │       Dashboard            │
│ Berita       │       Statistik            │
│ Kategori     │       Berita terbaru       │
│ Tag          │                            │
│              │                            │
└──────────────┴────────────────────────────┘
```

---

# 29. Responsive Design

Breakpoint:

```text
Mobile < 768px
Tablet 768–1023px
Desktop >= 1024px
```

Pada mobile:

* Sidebar menjadi drawer.
* Navbar menjadi hamburger.
* Card berita menjadi 1 kolom.
* Tabel berita menjadi responsive.
* Form menjadi 1 kolom.
* Heading diperkecil.
* Button tetap mudah disentuh.

Reference design menggunakan perubahan 64px → 40px untuk display heading dan navigasi hamburger pada mobile.

---

# 30. Struktur Folder Next.js

Gunakan App Router:

```text
src/
├── app/
│   ├── page.tsx
│   ├── berita/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── search/
│   │   └── page.tsx
│   │
│   └── admin/
│       ├── page.tsx
│       ├── berita/
│       │   ├── page.tsx
│       │   ├── tambah/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx
│       ├── kategori/
│       │   └── page.tsx
│       └── tag/
│           └── page.tsx
│
├── components/
│   ├── ui/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── berita-card.tsx
│   ├── berita-table.tsx
│   ├── berita-form.tsx
│   ├── category-card.tsx
│   └── admin-sidebar.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── berita.ts
│   ├── kategori.ts
│   └── tag.ts
│
└── types/
    └── database.ts
```

---

# 31. Supabase Client

Buat:

```text
src/lib/supabase.ts
```

Gunakan environment variable:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jangan menulis credential Supabase langsung di source code.

---

# 32. Query Data Berita

Relasi kategori harus digunakan saat mengambil berita.

Konsep query:

```text
berita
  ↓
kategori
```

Data yang diperlukan:

```text
id
judul
slug
ringkasan
isi
gambar
penulis
lokasi
status
tanggal_publish
jumlah_dilihat
kategori
```

Untuk halaman publik:

```text
status = terbit
```

---

# 33. Keamanan

Karena aplikasi tidak menggunakan login, jangan menampilkan service role key di browser.

Gunakan:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Untuk operasi yang membutuhkan hak istimewa, jangan menggunakan service role key di client.

Jika Supabase RLS aktif, sesuaikan policy agar kebutuhan aplikasi dapat berjalan.

---

# 34. SEO

Setiap detail berita memiliki:

```text
title
description
openGraph
```

Contoh:

```text
title:
Judul Berita | SoloHitz

description:
Ringkasan berita...

canonical:
https://solohitz.vercel.app/berita/slug
```

Slug harus SEO-friendly.

---

# 35. Metadata Berita

Gunakan:

```text
judul
ringkasan
gambar
kategori
tanggal_publish
penulis
lokasi
```

Untuk metadata halaman detail berita.

---

# 36. Loading & Error State

Setiap halaman harus memiliki:

### Loading

Skeleton card/table.

### Empty State

Contoh:

```text
Belum ada berita

Belum terdapat berita pada kategori ini.
```

### Error State

```text
Terjadi kesalahan

Data tidak dapat dimuat.
Silakan coba lagi.
```

---

# 37. Toast Notification

Gunakan notifikasi setelah aksi.

Contoh:

```text
Berita berhasil ditambahkan
```

```text
Berita berhasil diperbarui
```

```text
Berita berhasil dihapus
```

```text
Kategori berhasil disimpan
```

---

# 38. Alur Utama Aplikasi

## Membuat berita

```text
Admin
 ↓
Dashboard
 ↓
Tambah Berita
 ↓
Isi form
 ↓
Pilih kategori
 ↓
Pilih tag
 ↓
Simpan
 ↓
Supabase
 ↓
Berita tersimpan
```

## Menerbitkan berita

```text
Draft
 ↓
Edit
 ↓
Status = Terbit
 ↓
Simpan
 ↓
tanggal_publish
 ↓
diterbitkan_pada
 ↓
Muncul di website publik
```

## Membaca berita

```text
Pengunjung
 ↓
Beranda
 ↓
Pilih berita
 ↓
/berita/[slug]
 ↓
Ambil data dari Supabase
 ↓
jumlah_dilihat + 1
 ↓
Tampilkan artikel
```

---

# 39. Komponen Utama

Buat reusable component:

```text
Navbar
Footer
Button
Card
Badge
Input
Textarea
Select
Modal
Toast
SearchInput
Pagination
BeritaCard
BeritaTable
BeritaForm
CategoryCard
TagInput
StatCard
Sidebar
```

---

# 40. Acceptance Criteria

Aplikasi dianggap selesai apabila:

### Database

* [ ] Terhubung ke Supabase.
* [ ] Menggunakan tabel yang sudah tersedia.
* [ ] Relasi kategori → berita berjalan.
* [ ] Relasi berita → tag berjalan.

### Admin

* [ ] Dashboard berjalan.
* [ ] CRUD berita berjalan.
* [ ] CRUD kategori berjalan.
* [ ] CRUD tag berjalan.
* [ ] Search berita berjalan.
* [ ] Filter kategori berjalan.
* [ ] Filter status berjalan.
* [ ] Status draft/terbit/arsip berjalan.

### Website

* [ ] Beranda berjalan.
* [ ] Berita terbaru tampil.
* [ ] Berita populer tampil.
* [ ] Kategori tampil.
* [ ] Detail berita berdasarkan slug berjalan.
* [ ] Search berjalan.
* [ ] View counter berjalan.

### UI

* [ ] Responsive.
* [ ] Mobile friendly.
* [ ] Menggunakan Inter.
* [ ] Menggunakan warna SoloHitz.
* [ ] Button berbentuk pill.
* [ ] Card menggunakan rounded 16px.
* [ ] UI konsisten.
* [ ] Loading state tersedia.
* [ ] Empty state tersedia.
* [ ] Error state tersedia.

---

# 41. Prioritas Development

## Phase 1 — Setup

1. Setup Next.js.
2. Install Tailwind CSS.
3. Install Supabase client.
4. Setup environment variable.
5. Connect Supabase.

## Phase 2 — Public Website

1. Navbar.
2. Homepage.
3. Berita terbaru.
4. Kategori.
5. Detail berita.
6. Search.
7. Footer.

## Phase 3 — Management

1. Dashboard.
2. Daftar berita.
3. Tambah berita.
4. Edit berita.
5. Hapus berita.
6. Kategori.
7. Tag.

## Phase 4 — Enhancement

1. Statistik.
2. View counter.
3. Loading state.
4. Error state.
5. Toast.
6. Responsive.
7. SEO.
8. Deployment Vercel.

---

# 42. Prinsip Implementasi

**Jangan membuat database baru.**

Gunakan database Supabase yang sudah tersedia.

**Jangan membuat sistem login.**

Aplikasi dapat digunakan tanpa autentikasi.

**Jangan mengubah nama kolom database.**

Gunakan nama:

```text
kategori
berita
tag
berita_tag
```

beserta field yang sudah tersedia.

**Jangan menggunakan data dummy dari frontend jika data Supabase tersedia.**

Seluruh berita, kategori, dan tag harus mengambil data langsung dari Supabase.

**UI harus terasa seperti website berita modern**, bukan dashboard template biasa.

Gunakan whitespace yang cukup, card bersih, typography kuat, pill button, dan aksen aubergine secara konsisten.

---

# 43. Hasil Akhir

Hasil akhir berupa aplikasi:

```text
SOLOHITZ
│
├── WEBSITE PUBLIK
│   ├── Beranda
│   ├── Berita
│   ├── Wisata
│   ├── Kuliner
│   ├── Budaya
│   ├── Search
│   └── Detail Berita
│
└── MANAGEMENT
    ├── Dashboard
    ├── Berita
    │   ├── Tambah
    │   ├── Edit
    │   └── Hapus
    ├── Kategori
    └── Tag
```

Aplikasi harus terhubung langsung dengan Supabase dan menggunakan data yang sudah tersedia pada database.

Tujuan akhirnya adalah menghasilkan **SoloHitz sebagai portal berita Solo yang memiliki website publik sekaligus sistem manajemen konten dalam satu aplikasi Next.js.**
