# Changelog

Semua perubahan penting pada proyek ini dicatat di file ini. Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/) dan versi mengikuti [Semantic Versioning](https://semver.org/lang/id/).

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
