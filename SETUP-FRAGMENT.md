## Setup Fonnte WhatsApp (digabung otomatis ke SETUP.md)

> 3 langkah, ±5 menit. Butuh nomor WA aktif untuk device.
> Docs resmi: https://docs.fonnte.com/api-send-message/

### 1. Buat device + ambil token

1. Daftar/login di https://fonnte.com → **Add device**.
2. Scan QR dengan nomor WA yang jadi pengirim → status **Connected**.
3. Salin **Token** dari device tersebut.

### 2. Isi env

```bash
FONNTE_TOKEN=xxxx   # rahasia! server saja, tanpa NEXT_PUBLIC_
```

### 3. Coba kirim

`POST /api/notifications/whatsapp` dengan body:

```json
{ "target": "08123456789", "message": "Halo dari tokoku!" }
```

NOTED:
- `target` wajib string. Grup WA pakai group id (`1203xxx@g.us`).
- Contoh pakai nyata: panggil route ini dari webhook payment sukses
  ("Pesanan ORDER-1 lunas, resi menyusul") — tambahkan auth/rate-limit
  agar route tidak dipakai spammer (TODO di kode route).

---

## Setup Laravel (base Laravel)

> CLI menyuntik Service + Controller; 3 langkah manual di bawah wajib
> karena tidak bisa di-generate otomatis. Tanpa SDK tambahan.

### L1. Isi `.env`

```bash
FONNTE_TOKEN=xxxx   # rahasia! server saja
```

### L2. Tambah ke `config/services.php`

```php
'fonnte' => [
    'token' => env('FONNTE_TOKEN'),
],
```

### L3. Daftarkan route (mis. di `routes/api.php`)

```php
use App\Http\Controllers\FonnteController;

// routes/api.php otomatis berprefix /api — jangan tulis /api lagi di sini.
Route::post('/notifications/whatsapp', [FonnteController::class, 'send']);
```

Lalu `php artisan config:clear`. Idealnya dipanggil server-ke-server
+ auth/rate-limit (TODO di controller).
