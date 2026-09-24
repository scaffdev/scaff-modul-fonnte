/**
 * Client Fonnte (WhatsApp gateway) — disuntik Scaffdev Builder ke template Next.js.
 *
 * NOTED:
 * - File ini 100% milik modul "fonnte". Jangan import dari kode inti template.
 * - Token HANYA di server (route di bawah). Docs melarang keras kirim dari
 *   frontend (token bocor = nomor WA-mu dipakai orang).
 * - Cocok untuk notifikasi order: "pesanan lunas", "resi kirim", OTP.
 *
 * Referensi resmi:
 * - Kirim pesan : https://docs.fonnte.com/api-send-message/
 * - Via GET dilarang untuk frontend — modul ini SELALU pakai POST server-side.
 */
const SEND_URL = "https://api.fonnte.com/send";

function token(): string {
  const t = process.env.FONNTE_TOKEN;
  if (!t) throw new Error("MISSING_ENV: isi FONNTE_TOKEN di .env.local");
  return t;
}

export interface WhatsAppMessage {
  /**
   * Nomor tujuan atau group id, STRING (bukan number!). Contoh: "08123456789".
   * Multi-target: "08123,08124". Group: "1203xxx@g.us".
   * NOTED: fonnte menolak target bertipe angka — validasi string di sini.
   */
  target: string;
  /** Isi pesan (mendukung emoji, max 60.000 char). */
  message: string;
  /** Kode negara untuk normalisasi "08..." → "628...". Default "62". */
  countryCode?: string;
  /** Jeda detik antar pesan (disarankan ≥2 untuk multi-target agar tidak di-rate-limit). */
  delaySeconds?: number;
}

export interface SendResult {
  status: boolean;
  id?: string;
  raw: unknown;
}

/** Kirim 1 pesan WhatsApp. Throw bila gagal (cek respons `status`). */
export async function sendWhatsApp(msg: WhatsAppMessage): Promise<SendResult> {
  if (typeof msg.target !== "string" || !msg.target.trim()) {
    throw new Error("target wajib string (nomor/group id), bukan angka");
  }
  if (!msg.message?.trim()) throw new Error("message wajib diisi");

  // NOTED: fonnte memakai form-urlencoded (bukan JSON).
  const body = new URLSearchParams({
    target: msg.target.trim(),
    message: msg.message,
    countryCode: msg.countryCode ?? "62",
  });
  if (msg.delaySeconds !== undefined) body.set("delay", String(msg.delaySeconds));

  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      // NOTED: header cukup "Authorization: <token>" mentah — TANPA "Bearer".
      Authorization: token(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) throw new Error(`Fonnte error ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { status?: boolean; id?: string[] } & Record<string, unknown>;
  // NOTED: HTTP 200 belum tentu terkirim — fonnte menaruh hasil di `status`.
  if (data.status !== true) {
    throw new Error(`Fonnte menolak pesan: ${JSON.stringify(data)}`);
  }
  return { status: true, id: data.id?.[0], raw: data };
}
