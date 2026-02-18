// Supabase Edge Function: create-reading (IMPROVED - NO EMOJI)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = {
  name: string;
  birth_date: string;
  birth_city: string;
  gender?: string;
  birth_time?: string;
  time_accuracy?: "Exact" | "Approx" | "Unknown";
  email?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    },
  });
}

function makeRID() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RID-${s}`;
}

function phaseFromMonth(month: number) {
  if (month === 1 || month === 2) return { id: "E", name: "Reflective", desc: "This phase favors insight over action. Trust your intuition." };
  if (month === 3 || month === 4) return { id: "D", name: "Transitional", desc: "A time of change and realignment. Stay flexible." };
  if (month === 5 || month === 6) return { id: "A", name: "Expanding", desc: "Energy is rising. This is your time to grow and reach." };
  if (month === 7 || month === 8) return { id: "B", name: "Stabilizing", desc: "Build foundations. Consistency brings rewards." };
  if (month === 9 || month === 10) return { id: "C", name: "Consolidating", desc: "Harvest what you've planted. Reflect on progress." };
  return { id: "E", name: "Reflective", desc: "This phase favors insight over action. Trust your intuition." };
}

function demoFiveElements(month: number) {
  const base = [20, 20, 20, 20, 20];
  if ([3, 4].includes(month)) base[0] += 10;
  if ([5, 6].includes(month)) base[1] += 10;
  if ([7, 8].includes(month)) base[2] += 10;
  if ([9, 10].includes(month)) base[3] += 10;
  if ([11, 12, 1, 2].includes(month)) base[4] += 10;
  const sum = base.reduce((a, b) => a + b, 0);
  return {
    wood: Math.round((base[0] / sum) * 100),
    fire: Math.round((base[1] / sum) * 100),
    earth: Math.round((base[2] / sum) * 100),
    metal: Math.round((base[3] / sum) * 100),
    water: Math.round((base[4] / sum) * 100),
  };
}

function getDominantElement(elements: any): string {
  const entries = Object.entries(elements) as [string, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  return top.charAt(0).toUpperCase() + top.slice(1);
}

function buildEmailHTML(opts: {
  name: string;
  phaseName: string;
  phaseId: string;
  phaseDesc: string;
  elements: any;
  readingId: string;
}) {
  const dominant = getDominantElement(opts.elements);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:#faf9f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #f0ede8;">
              <h1 style="margin:0;font-size:28px;font-weight:normal;letter-spacing:3px;color:#1a1a1a;">WHEN</h1>
              <p style="margin:10px 0 0;font-size:14px;color:#888;font-style:italic;">Your timing, revealed.</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <h2 style="margin:0 0 10px;font-size:24px;font-weight:normal;color:#1a1a1a;">Hello, ${opts.name}</h2>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#555;">Your timing preview is ready. Here's what we found...</p>
            </td>
          </tr>

          <!-- Phase Card -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f8f6f3 0%,#f0ede8 100%);border-radius:12px;">
                <tr>
                  <td style="padding:30px;text-align:center;">
                    <p style="margin:0 0 5px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#888;">Your Current Phase</p>
                    <h3 style="margin:0 0 12px;font-size:28px;font-weight:normal;color:#4a5d4a;">${opts.phaseName} Phase</h3>
                    <p style="margin:0;font-size:16px;color:#666;line-height:1.5;">${opts.phaseDesc}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Element Balance -->
          <tr>
            <td style="padding:30px 40px;">
              <p style="margin:0 0 15px;font-size:14px;color:#888;text-align:center;">Your Element Balance</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" style="font-size:13px;color:#666;">Wood</td>
                        <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.wood}%;background:#4a7c59;border-radius:99px;"></div></div></td>
                        <td width="40" style="font-size:12px;color:#888;text-align:right;">${opts.elements.wood}%</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" style="font-size:13px;color:#666;">Fire</td>
                        <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.fire}%;background:#c75146;border-radius:99px;"></div></div></td>
                        <td width="40" style="font-size:12px;color:#888;text-align:right;">${opts.elements.fire}%</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" style="font-size:13px;color:#666;">Earth</td>
                        <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.earth}%;background:#c9a227;border-radius:99px;"></div></div></td>
                        <td width="40" style="font-size:12px;color:#888;text-align:right;">${opts.elements.earth}%</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" style="font-size:13px;color:#666;">Metal</td>
                        <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.metal}%;background:#8d8d8d;border-radius:99px;"></div></div></td>
                        <td width="40" style="font-size:12px;color:#888;text-align:right;">${opts.elements.metal}%</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" style="font-size:13px;color:#666;">Water</td>
                        <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.water}%;background:#4a6fa5;border-radius:99px;"></div></div></td>
                        <td width="40" style="font-size:12px;color:#888;text-align:right;">${opts.elements.water}%</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:15px 0 0;font-size:14px;color:#666;text-align:center;">
                Dominant element: <strong style="color:#4a5d4a;">${dominant}</strong>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #f0ede8;margin:10px 0;">
            </td>
          </tr>

          <!-- Teaser Section -->
          <tr>
            <td style="padding:30px 40px;text-align:center;">
              <h3 style="margin:0 0 12px;font-size:22px;font-weight:normal;color:#1a1a1a;">This is just the beginning.</h3>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#555;">
                What you just saw is a <strong>glimpse</strong>.<br>
                Your full reading reveals <strong>8 life areas</strong> in depth.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="50%" style="padding:6px 0;font-size:14px;color:#666;">Money & Opportunities</td>
                  <td width="50%" style="padding:6px 0;font-size:14px;color:#666;">Career & Direction</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#666;">Love & Relationships</td>
                  <td style="padding:6px 0;font-size:14px;color:#666;">Energy & Well-being</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#666;">When Life Feels Heavy</td>
                  <td style="padding:6px 0;font-size:14px;color:#666;">Monthly Timing Map</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#666;">This Year's Theme</td>
                  <td style="padding:6px 0;font-size:14px;color:#666;">Your Life Pattern</td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:15px;color:#888;font-style:italic;">
                For less than the price of two lattes...
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 40px 30px;text-align:center;">
              <a href="https://when.app/upgrade?rid=${opts.readingId}" style="display:inline-block;background:linear-gradient(135deg,#4a5d4a 0%,#3a4d3a 100%);color:#ffffff;text-decoration:none;padding:18px 40px;border-radius:8px;font-size:16px;font-weight:bold;">
                Unlock Full Reading - $19.99
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#aaa;">
                30-day money-back guarantee | Instant access
              </p>
            </td>
          </tr>

          <!-- Testimonial -->
          <tr>
            <td style="padding:25px 40px;background-color:#f8f6f3;text-align:center;">
              <p style="margin:0;font-size:14px;color:#666;font-style:italic;">
                "The insights were surprisingly accurate. I keep coming back to it."
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#888;">- Sarah K., Los Angeles</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:25px 40px;text-align:center;border-top:1px solid #f0ede8;">
              <p style="margin:0 0 8px;font-size:12px;color:#aaa;">
                2026 WHEN | Not predictions. Perspective.
              </p>
              <p style="margin:0;font-size:11px;color:#ccc;">
                Reading ID: ${opts.readingId}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true });
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
  const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const body: Payload = await req.json();
  if (!body.name || !body.birth_date || !body.birth_city) {
    return json({ error: "Missing required fields" }, 400);
  }

  const month = Number(body.birth_date.split("-")[1]);
  const rid = makeRID();
  const phase = phaseFromMonth(month);
  const elements = demoFiveElements(month);

  await supabase.from("readings").insert({
    reading_id: rid,
    name: body.name,
    email: body.email || null,
    birth_date: body.birth_date,
    birth_time: body.birth_time || null,
    birth_city: body.birth_city,
    gender: body.gender || null,
    phase: phase.id,
    five_elements: elements,
  });

  if (body.email) {
    await supabase.from("deliveries").insert({
      reading_id: rid,
      type: "free",
      status: "pending",
    });

    const html = buildEmailHTML({
      name: body.name,
      phaseName: phase.name,
      phaseId: phase.id,
      phaseDesc: phase.desc,
      elements,
      readingId: rid,
    });

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [body.email],
        subject: `${body.name}, your timing preview is ready`,
        html,
      }),
    });

    const status = resp.ok ? "sent" : "failed";
    await supabase
      .from("deliveries")
      .update({ status })
      .eq("reading_id", rid)
      .eq("type", "free")
      .eq("status", "pending");
  }

  return json({ ok: true, reading_id: rid, phase: phase.id });
});
