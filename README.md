# Database Designer

Perancangan struktur database visual. Seluruh desain diproses di browser; penyimpanan lokal dan file JSON berada di kendali pengguna.

## Fitur

- Editor tabel dan kolom dengan tipe data MySQL, primary key tunggal, nullable, dan foreign key.
- Diagram ERD interaktif dengan drag-and-drop dan pengaturan koordinat.
- Validasi nama, duplikasi, tipe relasi, dan referensi sebelum ekspor.
- Simpan/buka lokal, import/export JSON, SQL MySQL, dan diagram SVG.
- Tema terang/gelap dan tampilan responsif.

## Teknologi

Laravel 13, React 19, Inertia.js 2, TypeScript, Vite, Vitest, PHPUnit.

## Cara menjalankan

Memerlukan PHP 8.4+, Composer, dan Node.js 22.12+. Arahkan document root Laragon ke folder `public`.

```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm ci
npm run build
php artisan serve
```

Buka http://127.0.0.1:8000. Jalankan `php artisan test` dan `npm test` untuk pengujian.
