<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Service Fonnte — STAGED untuk dukungan Laravel (aktif di v1.1.0).
 *
 * NOTED:
 * - File ini BELUM disuntik CLI (manifest v1.0.0 frameworks: ["nextjs"]).
 * - Diport 1:1 dari contoh resmi PHP di docs (curl → Http facade).
 *   Ref: https://docs.fonnte.com/send-whatsapp-message-with-php-api/
 */
class FonnteService
{
    /**
     * Kirim 1 pesan WA. $target wajib string (nomor / group id / comma-separated).
     */
    public function send(string $target, string $message, int $delaySeconds = 0): array
    {
        $token = config('services.fonnte.token');
        abort_if(empty($token), 500, 'Isi FONNTE_TOKEN');
        abort_if(trim($target) === '' || trim($message) === '', 422, 'target & message wajib diisi');

        // NOTED: header cukup token mentah, TANPA "Bearer".
        $res = Http::withHeaders(['Authorization' => $token])
            ->asForm()
            ->post('https://api.fonnte.com/send', [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62',
                'delay' => (string) $delaySeconds,
            ]);

        $data = $res->throw()->json();
        // NOTED: HTTP 200 belum tentu terkirim — cek field `status`.
        abort_if(($data['status'] ?? false) !== true, 502, 'Fonnte menolak pesan: ' . json_encode($data));

        return $data;
    }
}
