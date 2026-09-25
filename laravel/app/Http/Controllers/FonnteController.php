<?php

namespace App\Http\Controllers;

use App\Services\FonnteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller Fonnte — disuntik Scaffdev Builder ke template Laravel.
 *
 * NOTED — daftarkan route manual (mis. di routes/api.php):
 *   Route::post('/api/notifications/whatsapp', [FonnteController::class, 'send']);
 * Idealnya dipanggil server-ke-server (mis. setelah payment sukses) +
 * auth/rate-limit (TODO pemilik project).
 */
class FonnteController extends Controller
{
    public function __construct(protected FonnteService $fonnte) {}

    /** POST /api/notifications/whatsapp */
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'target' => 'required|string|max:1000',
            'message' => 'required|string|max:60000',
            'delaySeconds' => 'nullable|integer|min:0|max:60',
        ]);

        $result = $this->fonnte->send($data['target'], $data['message'], $data['delaySeconds'] ?? 0);

        return response()->json(['ok' => true, 'id' => $result['id'][0] ?? null]);
    }
}
