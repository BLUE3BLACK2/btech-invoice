<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Guidelines

1. Selalu check kondisi branch github saat ini sebelum mengeksekusi dibawah dan ikuti SOP yang dijabarkan pada SOP Github dibawah ini untuk kolaborasi yang lebih baik lagi
2. Jangan menulis komentar untuk menjelaskan kode
3. Maksimalkan fungsi yang sudah ada untuk berbagai kebutuhan.
4. Maksimalkan penggunaan komponen agar kode semakin bersih dan output semakin rapi. Gunakan komponen yang sama untuk elemen sejenis, seperti satu komponen tombol untuk semua tombol.
5. Simpan semua konfigurasi desain bersama di `global.css` agar konsisten. Contohnya, simpan padding horizontal section di `global.css` dan gunakan sebagai landasan untuk semua komponen.
6. Selalu utamakan penggunaan asset daripada membuat elemen visual dengan CSS.
7. Perhatikan primary color dan pewarnaan secara keseluruhan agar konsisten.
8. Jaga konsistensi corner radius berdasarkan tipe komponen:
   - Bedakan antara component card dan actionable component, seperti tombol.
   - Gunakan radius yang proporsional agar bentuknya konsisten.
   - Jika card menggunakan radius `14px`, gunakan radius `12px` untuk action section atau tombol. Jangan gunakan nilai radius yang persis sama untuk kedua tipe tersebut.
9. Jangan menggunakan warna gradasi.
10. Gunakan shadow dengan aturan berikut:
   - Intensitas shadow tidak boleh terlalu besar.
   - Shadow harus konsisten pada setiap elemen yang menggunakannya.
   - Jangan menggunakan shadow berwarna.
11. Semua gambar wajib menggunakan format `.webp` agar ukuran file kecil dan loading tetap cepat tanpa mengorbankan kualitas visual. Gambar dapat dibuat menggunakan AI atau Codex bila diperlukan.
12. Gunakan `lucide-react` untuk semua kebutuhan ikon.

# SOP Kerja AI Agent di GitHub

Dokumen ini adalah aturan wajib yang harus kamu ikuti di setiap session, dimulai sejak kamu mengeksekusi sebuah task sampai task tersebut selesai. Tujuannya: history repo rapi, perubahan mudah dilacak, dan production selalu stabil.

## 1. Prinsip Umum

1. Tidak ada perubahan kode yang dikerjakan langsung di branch `main` atau `development`. Semua pekerjaan dilakukan di branch kerja sendiri.
2. Satu branch = satu task. Jangan mencampur dua fitur atau dua bug dalam satu branch.
3. Satu commit = satu perubahan logis yang utuh (atomic). Jangan menumpuk banyak perubahan tidak berkaitan dalam satu commit.
4. Setiap perubahan masuk ke `development` atau `main` hanya lewat Pull Request (PR), bukan push langsung.
5. Sebelum mulai dan sebelum push, selalu pastikan branch kamu sinkron dengan branch sumbernya.
6. Jika ragu terhadap scope task atau dampak perubahan, tanyakan dulu sebelum mengeksekusi.

## 2. Struktur Branch

| Branch | Fungsi | Sumber | Tujuan merge |
|---|---|---|---|
| `main` | Production. Kode yang benar-benar jalan di user. | - | - |
| `development` | Integrasi. Semua fitur dan fix berkumpul di sini sebelum rilis. | `main` | `main` |
| `feature/[nama-fitur]` | Pengembangan fitur baru | `development` | `development` |
| `fix/[nama-bug]` | Perbaikan bug yang ditemukan di development | `development` | `development` |
| `hotfix/[nama-bug]` | Perbaikan darurat bug yang sudah ada di production | `main` | `main` dan `development` |
| `refactor/[nama]` | Perubahan struktur kode tanpa mengubah perilaku | `development` | `development` |
| `chore/[nama]` | Update dependency, config, CI, tooling | `development` | `development` |
| `docs/[nama]` | Perubahan dokumentasi saja | `development` | `development` |
| `release/[versi]` | Persiapan rilis (opsional, untuk project besar) | `development` | `main` dan `development` |

### Aturan penamaan branch

- Huruf kecil semua, pisahkan kata dengan tanda hubung (`-`), tanpa spasi atau underscore.
- Nama harus deskriptif dan singkat, maksimal 4 sampai 5 kata.
- Jika ada nomor issue atau ticket, sertakan di awal nama.

Contoh benar:
- `feature/login-google-oauth`
- `feature/23-export-laporan-pdf`
- `fix/tombol-simpan-tidak-respon`
- `hotfix/crash-saat-checkout`
- `chore/update-nextjs-15`

Contoh salah:
- `feature/Login` (huruf besar, tidak deskriptif)
- `fix_bug` (tanpa prefix folder, tidak jelas bug apa)
- `feature/perbaikan-login-dan-tambah-dashboard` (dua task dalam satu branch)

## 3. Alur Kerja Setiap Task

Ikuti urutan ini setiap kali memulai task:

### Langkah 1: Sinkronisasi
```
git checkout development
git pull origin development
```

### Langkah 2: Buat branch kerja
```
git checkout -b feature/nama-fitur
```
Gunakan prefix sesuai jenis task (lihat bagian 2).

### Langkah 3: Kerjakan task
- Kerjakan dalam potongan kecil yang bisa di-commit terpisah.
- Jalankan lint dan test secara berkala, jangan tunggu sampai akhir.

### Langkah 4: Commit setiap perubahan yang selesai
Commit setiap kali satu bagian logis selesai dan berjalan (misalnya: model selesai, endpoint selesai, UI selesai). Jangan menunggu seluruh fitur selesai baru commit sekali. Ikuti format commit di bagian 4.

### Langkah 5: Pre-push checklist
Sebelum push, pastikan semuanya lolos:
- [ ] Kode bisa di-build tanpa error
- [ ] Lint dan formatter lolos (misalnya ESLint, Prettier, Ruff, Black)
- [ ] Semua test lolos, dan test baru sudah ditambahkan untuk perubahan yang dibuat
- [ ] Tidak ada `console.log`, `print`, kode debug, atau komentar `TODO` yang tertinggal tanpa alasan
- [ ] Tidak ada secret, API key, password, atau file `.env` yang ikut ter-commit
- [ ] Branch sudah di-rebase atau di-merge dengan `development` terbaru dan konflik sudah diselesaikan

```
git fetch origin
git rebase origin/development
```

### Langkah 6: Push dan buat Pull Request
```
git push -u origin feature/nama-fitur
```
Buat PR ke `development` (atau ke `main` untuk hotfix) dengan format di bagian 5.

### Langkah 7: Setelah merge
- Hapus branch kerja di remote dan lokal.
- Kembali ke `development` dan pull versi terbaru.

```
git checkout development
git pull origin development
git branch -d feature/nama-fitur
```

## 4. Format Commit (Conventional Commits)

Format:
```
<tipe>(<scope>): <deskripsi singkat>

<body opsional: jelaskan apa dan kenapa, bukan bagaimana>

<footer opsional: referensi issue, breaking change>
```

### Tipe commit

| Tipe | Kegunaan |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `refactor` | Perubahan kode tanpa mengubah perilaku dan tanpa fix bug |
| `perf` | Peningkatan performa |
| `style` | Format kode, spasi, titik koma (tidak mengubah logika) |
| `test` | Menambah atau memperbaiki test |
| `docs` | Perubahan dokumentasi |
| `chore` | Dependency, config, build, tooling |
| `ci` | Perubahan pipeline CI/CD |
| `revert` | Membatalkan commit sebelumnya |

### Aturan penulisan

- Deskripsi maksimal 72 karakter, huruf kecil di awal, tanpa titik di akhir.
- Gunakan kalimat perintah: "tambah", "perbaiki", "hapus" (bukan "menambahkan", "sudah diperbaiki").
- Scope diisi nama modul atau area yang diubah: `auth`, `api`, `ui`, `db`, `payment`.
- Body wajib diisi jika perubahan tidak jelas dari judulnya saja.
- Breaking change wajib ditandai dengan `!` setelah tipe dan dijelaskan di footer.

Contoh benar:
```
feat(auth): tambah login dengan google oauth

Menggunakan next-auth dengan provider Google. Session disimpan
di database agar bisa di-revoke dari admin panel.

Closes #23
```
```
fix(checkout): perbaiki total harga salah saat diskon 100%
```
```
chore(deps): update prisma ke v6
```
```
feat(api)!: ubah response format endpoint /users

BREAKING CHANGE: field `name` dipecah menjadi `first_name` dan `last_name`.
```

Contoh salah:
- `update` (tidak jelas)
- `fix bug` (tidak ada scope dan detail)
- `Feat: Menambahkan fitur login dan juga perbaikan tombol` (dua perubahan dalam satu commit)
- `WIP` (jangan commit work in progress ke branch yang akan di-PR)

## 5. Pull Request

### Aturan
- Target PR: `feature/*`, `fix/*`, `chore/*`, `refactor/*`, `docs/*` menuju `development`. `hotfix/*` menuju `main`, lalu langsung buat PR kedua ke `development`.
- Judul PR mengikuti format commit: `feat(auth): tambah login google oauth`.
- Satu PR idealnya di bawah 400 baris perubahan. Jika lebih, pecah menjadi beberapa PR.
- PR harus bisa di-review dan dipahami tanpa harus bertanya ke pembuatnya.
- Jangan merge PR sendiri tanpa CI lolos.

### Template deskripsi PR
```
## Ringkasan
Jelaskan dalam 1 sampai 3 kalimat apa yang diubah dan kenapa.

## Perubahan
- Poin perubahan 1
- Poin perubahan 2

## Cara Testing
Langkah untuk memverifikasi perubahan ini bekerja.

## Screenshot / Rekaman
(Wajib untuk perubahan UI)

## Checklist
- [ ] Build dan lint lolos
- [ ] Test lolos dan test baru sudah ditambahkan
- [ ] Tidak ada secret yang ter-commit
- [ ] Dokumentasi diperbarui jika perlu
- [ ] Sudah rebase dengan branch target terbaru

## Referensi
Closes #nomor-issue
```

## 6. Strategi Merge

| Dari | Ke | Metode |
|---|---|---|
| `feature/*`, `fix/*`, dll | `development` | Squash and merge (history development tetap 1 commit per task) |
| `development` | `main` | Merge commit (jejak rilis terlihat jelas) |
| `hotfix/*` | `main` | Squash and merge, lalu merge `main` kembali ke `development` |

- Setelah merge, branch sumber wajib dihapus.
- Jangan pernah merge `main` ke `feature/*` secara langsung. Selalu lewat `development`.

## 7. Rilis dan Deployment

1. Deployment production hanya berasal dari branch `main`. Deployment staging dari `development`.
2. Setiap merge `development` ke `main` adalah satu rilis dan wajib diberi tag versi mengikuti Semantic Versioning (`vMAJOR.MINOR.PATCH`):
   - `MAJOR`: ada breaking change
   - `MINOR`: fitur baru, kompatibel ke belakang
   - `PATCH`: bug fix saja
3. Perbarui `CHANGELOG.md` setiap rilis. Kelompokkan berdasarkan: Added, Changed, Fixed, Removed.
4. Contoh:
```
git checkout main
git merge --no-ff development
git tag -a v1.4.0 -m "Rilis v1.4.0: export laporan PDF, fix checkout"
git push origin main --tags
```

### Alur hotfix
1. Buat `hotfix/nama-bug` dari `main`.
2. Perbaiki, commit, PR ke `main`, merge, beri tag patch (misal `v1.4.1`).
3. Segera merge `main` ke `development` supaya fix tidak hilang di rilis berikutnya.

## 8. Larangan Keras

Hal-hal berikut tidak boleh dilakukan dalam kondisi apa pun tanpa persetujuan eksplisit:

- `git push --force` ke `main` atau `development`.
- Commit langsung ke `main` atau `development`.
- Commit file `.env`, credential, API key, private key, atau token dalam bentuk apa pun.
- Commit folder build atau dependency (`node_modules`, `dist`, `.next`, `__pycache__`, `venv`).
- Commit file berukuran besar (di atas 10 MB) tanpa Git LFS.
- Menghapus branch orang lain atau me-rewrite history yang sudah di-push.
- Merge PR yang CI-nya gagal.
- Menggunakan `git add .` tanpa memeriksa `git status` terlebih dahulu.

Jika sebuah secret tidak sengaja ter-commit, segera laporkan. Secret tersebut dianggap bocor dan harus di-rotate, walaupun commit-nya sudah dihapus.

## 9. Konfigurasi Wajib Repo

Setiap repo harus memiliki:

- `.gitignore` yang sesuai dengan stack (gunakan template gitignore.io atau GitHub).
- `.env.example` berisi semua variabel environment yang dibutuhkan, tanpa nilai aslinya.
- `README.md` berisi: deskripsi project, cara install, cara menjalankan, cara testing, dan struktur folder.
- `CHANGELOG.md`.
- Branch protection di `main` dan `development`: wajib PR, wajib CI lolos, tidak boleh force push.
- CI pipeline minimal: lint, test, build. Berjalan otomatis di setiap PR.

## 10. Ringkasan Cepat

1. Pull `development` terbaru.
2. Buat branch dengan prefix yang benar.
3. Kerjakan, commit kecil-kecil dengan format Conventional Commits.
4. Lint, test, build, rebase.
5. Push, buat PR dengan template.
6. Merge setelah CI lolos, hapus branch.
7. Rilis dari `main` dengan tag versi dan changelog.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
