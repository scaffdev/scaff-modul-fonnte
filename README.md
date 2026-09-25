# scaff-modul-fonnte

Modul notifikasi **WhatsApp via Fonnte** untuk
[Scaffdev](https://scaffdev.vercel.app) Builder.
Disuntik via `scaff ... --with=fonnte` (CLI 0.2.0+).

| Framework | Status | Isi |
|---|---|---|
| Next.js | ✅ v1.0.0 | Client kirim pesan + route server-side |
| Laravel | ✅ v1.0.0 | Service + Controller (HTTP client) |

## Struktur

```
scaff-modul-fonnte/
├── scaff.integration.json   ← manifest (satu-satunya yang dibaca CLI)
├── SETUP-FRAGMENT.md        ← digabung ke SETUP.md hasil racikan
├── REMOVE.md                ← panduan copot
├── nextjs/
│   ├── lib/notifications/fonnte.ts
│   └── app/api/notifications/whatsapp/route.ts
└── laravel/                 ← sumber untuk base Laravel
    ├── app/Services/FonnteService.php
    └── app/Http/Controllers/FonnteController.php
```

## Env (WAJIB didaftarkan dulu di admin Scaffdev → tabel `integrasi`)

> Tambahkan via admin: kode `fonnte`, kategori `other`, env di bawah ini.

| Key | Keterangan |
|---|---|
| `FONNTE_TOKEN` | Token device (rahasia, server saja) |

## Validasi lokal (sebelum push)

```bash
scaffdev validate-module .
```

## Docs resmi yang dirujuk kode

- Kirim pesan: https://docs.fonnte.com/api-send-message/
- Contoh PHP: https://docs.fonnte.com/send-whatsapp-message-with-php-api/
