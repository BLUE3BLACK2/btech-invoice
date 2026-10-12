# Changelog

Semua perubahan penting pada proyek ini dicatat di file ini. Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/) dan versi mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [0.3.0] - 2026-10-12

### Added
- Edit invoice yang sudah disimpan lewat halaman `/invoices/[id]/edit`, dengan tombol edit di daftar invoice dan di halaman preview (#14).

## [0.2.1] - 2026-10-12

### Fixed
- `INVOICE_DEFAULT_NOTES` yang diisi lewat dashboard Vercel dengan `\n` kini tampil sebagai baris baru, bukan teks `\n` (#12).

## [0.2.0] - 2026-10-12

### Added
- Halaman login dan proteksi seluruh aplikasi. Kredensial dari `AUTH_USERNAME` dan `AUTH_PASSWORD`, sesi berupa cookie httpOnly yang ditandatangani `AUTH_SECRET` dan berlaku 7 hari (#8).
- Tombol Keluar di header (#8).

### Changed
- Default notes, tanda tangan, dan nama penanda tangan kini dibaca server dan hanya dikirim setelah login, tidak lagi tertanam di bundle JavaScript publik (#8).
- **Breaking:** `NEXT_PUBLIC_DEFAULT_NOTES`, `NEXT_PUBLIC_DEFAULT_SIGNATURE`, dan `NEXT_PUBLIC_DEFAULT_SIGNATORY` diganti menjadi `INVOICE_DEFAULT_NOTES`, `INVOICE_DEFAULT_SIGNATURE`, dan `INVOICE_DEFAULT_SIGNATORY` (#8).
- Blok `AGENTS.md` hasil generate `next dev` diperbarui (#9).

## [0.1.0] - 2026-10-12

### Added
- Halaman daftar invoice dan editor invoice baru, dengan data tersimpan di `localStorage` browser (#2).
- Dokumen PDF invoice ukuran US Letter dengan teks vektor, dikalibrasi sama dengan invoice referensi BTECH0056 (#3).
- Halaman preview `/invoices/[id]` yang menampilkan PDF di semua browser, termasuk mobile (#3).
- Download PDF bernama `Invoice <nomor>.pdf` dari halaman daftar, preview, dan editor (#3).
- Baris invoice di daftar bisa diklik untuk membuka preview (#3).
- Blok tanda tangan di samping Notes, berisi gambar tanda tangan, nama penanda tangan, dan label Authorized Signature (#5).
- Bagian Terms & Conditions di bawah Notes, dengan terms resmi sebagai default dan tampilan daftar bernomor (#5).
- Default notes, gambar tanda tangan, dan nama penanda tangan dari environment variable, beserta `.env.example` dan petunjuk setup di README (#4).
- Ikon dari `lucide-react` (#1).
