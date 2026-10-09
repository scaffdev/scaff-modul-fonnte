import { NextResponse } from "next/server";
import { sendWhatsApp } from "../../../../lib/notifications/fonnte";

/**
 * POST /api/notifications/whatsapp — kirim pesan WhatsApp via Fonnte.
 *
 * NOTED:
 * - Route ini proteksi token: browser memanggil route ini, route yang
 *   memegang token ke fonnte. JANGAN panggil api.fonnte.com dari browser.
 * - Idealnya route ini dipanggil SERVER-ke-server (mis. setelah webhook
 *   payment sukses), bukan langsung dari form publik — tambahkan auth/
 *   rate-limit sesuai kebutuhan tokomu (TODO pemilik project).
 *
 * Body: { target: string, message: string, delaySeconds?: number }
 * Balikan: { ok: true, id? }
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body harus JSON valid" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  if (typeof b.target !== "string" || !b.target.trim()) {
    return NextResponse.json({ error: "target wajib string nomor/group id" }, { status: 400 });
  }
  if (typeof b.message !== "string" || !b.message.trim()) {
    return NextResponse.json({ error: "message wajib diisi" }, { status: 400 });
  }

  try {
    const result = await sendWhatsApp({
      target: b.target,
      message: b.message,
      delaySeconds: typeof b.delaySeconds === "number" ? b.delaySeconds : undefined,
    });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengirim WhatsApp" },
      { status: 502 }
    );
  }
}
