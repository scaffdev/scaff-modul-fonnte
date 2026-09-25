# Cara mencopot Fonnte

> Dibutuhkan bila kamu tidak jadi pakai notifikasi WA (mis. via Scaffdev Builder).
> Estimasi: ±5 menit. Ikuti berurutan — jangan loncat.

## 0. Aturan emas (baca dulu!)

- Hapus **HANYA** file di bagian 1. File lain **JANGAN PERNAH** dihapus.
- Kalau ragu satu file, BERHENTI dan tanya pembuat template.

---

## A. Template Next.js

### A.1. Hapus file (aman — tidak dipakai kode lain)

- `lib/notifications/fonnte.ts` — client kirim pesan.
- `app/api/notifications/whatsapp/route.ts` — route kirim WA.

```bash
rm lib/notifications/fonnte.ts "app/api/notifications/whatsapp/route.ts"
```

### A.2. Hapus env (dari `.env.local`)

- `FONNTE_TOKEN`

Hapus barisnya, jangan dikosongkan saja.

### A.3. Bersihkan dependency

Tidak ada dependency tambahan (modul ini memakai `fetch` bawaan Node).

### A.4. Verifikasi (wajib lolos semua)

```bash
npm run build
```

```bash
grep -ri "fonnte\|whatsapp" app lib components
```

- Build harus sukses.
- Grep harus menghasilkan **0 baris**. Bila masih ada sisa (mis. pemanggilan
  notifikasi setelah checkout), hapus pemakaiannya, lalu build ulang.

### A.5. Yang JANGAN dihapus

- Halaman/flow order umum, `package.json`, `.env.local` (cukup hapus baris
  env-nya), layout, config.

---

## B. Template Laravel

### B.1. Hapus file (aman — tidak dipakai kode lain)

- `app/Services/FonnteService.php` — client kirim pesan WA.
- `app/Http/Controllers/FonnteController.php` — route kirim WA.

```bash
rm "app/Services/FonnteService.php" "app/Http/Controllers/FonnteController.php"
```

### B.2. Hapus env (dari `.env`)

- `FONNTE_TOKEN`

Hapus barisnya, jangan dikosongkan saja.

### B.3. Bersihkan dependency

Tidak ada dependency tambahan (modul ini memakai HTTP client Laravel).

### B.4. Verifikasi (wajib lolos semua)

```bash
composer install --no-dev
php artisan config:clear
```

```bash
grep -ri "fonnte\|whatsapp" app routes resources config
```

- Install harus sukses tanpa error.
- Grep harus menghasilkan **0 baris**. Bila masih ada sisa, hapus
  pemakaiannya, lalu verifikasi ulang.
- Hapus juga blok `fonnte` di `config/services.php` bila kamu menambahkannya.

### B.5. Yang JANGAN dihapus (Laravel)

- Flow order umum, `config/services.php` itu sendiri (cukup hapus blok
  `fonnte`-nya), `composer.json`, `.env` (cukup hapus baris env-nya).
