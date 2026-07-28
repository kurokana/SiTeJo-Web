# SiTeJo Web

SiTeJo Web adalah aplikasi frontend untuk Sistem Informasi Ticketing Persetujuan Tanda Tangan di Jurusan Teknik Elektro Universitas Lampung. Aplikasi ini membantu mahasiswa mengajukan surat, dosen meninjau pengajuan, dan admin mengelola alur persetujuan dalam satu dashboard yang terstruktur.

## Gambaran Singkat

- Pengajuan surat dilakukan secara digital.
- Status tiket dapat dipantau secara real-time.
- Hak akses dibedakan berdasarkan peran pengguna.
- Tersedia verifikasi nomor surat untuk pengecekan dokumen.

## Fitur Utama

- Landing page informatif untuk memperkenalkan sistem.
- Login berbasis autentikasi pengguna.
- Dashboard terpisah untuk mahasiswa, dosen, dan admin.
- Pembuatan, pengeditan, dan pemantauan tiket oleh mahasiswa.
- Review dan persetujuan tiket oleh dosen.
- Manajemen pengguna dan monitoring tiket oleh admin.
- Halaman verifikasi surat untuk validasi nomor surat.

## Peran Pengguna

- Mahasiswa: membuat tiket, mengunggah dokumen pendukung, dan memantau status pengajuan.
- Dosen: meninjau tiket, memberikan persetujuan, atau menambahkan catatan perbaikan.
- Admin: mengelola pengguna, memantau seluruh tiket, dan meneruskan proses sesuai kebutuhan.

## Teknologi

- React 18
- React Router DOM 6
- Axios
- Create React App

## Menjalankan Proyek

### 1. Install dependensi

```bash
npm install
```

### 2. Jalankan mode development

```bash
npm start
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

### 3. Build untuk production

```bash
npm run build
```

Hasil build akan tersedia di folder `build`.

## Script yang Tersedia

- `npm start` - menjalankan aplikasi dalam mode development.
- `npm run build` - membuat versi production.
- `npm test` - menjalankan test runner interaktif.
- `npm run eject` - membuka konfigurasi bawaan CRA secara penuh.

## Struktur Folder

```text
src/
	components/   komponen umum seperti layout, sidebar, dan protected route
	contexts/     context autentikasi
	pages/        halaman landing, auth, student, lecturer, dan admin
	services/     layer komunikasi ke API
	style/        file CSS per halaman dan komponen
	utils/        helper umum
```

## Alur Akses

1. Pengguna membuka landing page.
2. Pengguna login sesuai peran masing-masing.
3. Sistem mengarahkan ke dashboard yang sesuai.
4. Proses tiket berjalan sesuai otorisasi: mahasiswa mengajukan, dosen meninjau, admin memantau.

## Catatan

- Proyek ini menggunakan routing berbasis proteksi role.
- Beberapa halaman bergantung pada layanan API di folder `src/services`.
- Jika backend belum aktif, beberapa fitur seperti login dan pengelolaan tiket tidak dapat berjalan penuh.

## Tampilan Halaman

Halaman utama menampilkan identitas Universitas Lampung, penjelasan sistem, alur proses pengajuan, dan tombol cepat menuju login atau verifikasi surat.
