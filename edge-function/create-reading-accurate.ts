// Supabase Edge Function: create-reading (ACCURATE VERSION)
// Uses @fullstackfamily/manseryeok for precise Korean Saju calculation
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { calculateSaju } from "npm:@fullstackfamily/manseryeok";

type Payload = {
  name: string;
  birth_date: string; // YYYY-MM-DD
  birth_city: string;
  gender?: string;
  birth_time?: string; // HH:MM format
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

// 천간 오행 매핑
const STEM_ELEMENT: Record<string, string> = {
  "갑": "wood", "을": "wood",
  "병": "fire", "정": "fire",
  "무": "earth", "기": "earth",
  "경": "metal", "신": "metal",
  "임": "water", "계": "water",
};

// 지지 오행 매핑
const BRANCH_ELEMENT: Record<string, string> = {
  "자": "water", "축": "earth", "인": "wood", "묘": "wood",
  "진": "earth", "사": "fire", "오": "fire", "미": "earth",
  "신": "metal", "유": "metal", "술": "earth", "해": "water",
};

// 사주에서 오행 분포 계산
function calculateElements(saju: any) {
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  const pillars = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar];
  
  for (const pillar of pillars) {
    if (!pillar) continue;
    const stem = pillar.charAt(0); // 천간
    const branch = pillar.charAt(1); // 지지
    
    if (STEM_ELEMENT[stem]) elements[STEM_ELEMENT[stem] as keyof typeof elements]++;
    if (BRANCH_ELEMENT[branch]) elements[BRANCH_ELEMENT[branch] as keyof typeof elements]++;
  }
  
  // 퍼센트로 변환
  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  return {
    wood: Math.round((elements.wood / total) * 100),
    fire: Math.round((elements.fire / total) * 100),
    earth: Math.round((elements.earth / total) * 100),
    metal: Math.round((elements.metal / total) * 100),
    water: Math.round((elements.water / total) * 100),
    dominant: Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0],
    dominantCount: Object.entries(elements).sort((a, b) => b[1] - a[1])[0][1],
  };
}

// 일간(Day Master)에 따른 Phase 결정
function getPhaseFromDayMaster(dayPillar: string) {
  const stem = dayPillar.charAt(0);
  const element = STEM_ELEMENT[stem];
  
  const phases: Record<string, { id: string; name: string; desc: string }> = {
    wood: { id: "A", name: "Growth", desc: "You're in an expansive phase. Like a tree reaching toward sunlight, this is your time to grow, learn, and explore new possibilities." },
    fire: { id: "B", name: "Expression", desc: "You're in a radiant phase. Your energy is visible and magnetic. This is a time to shine, share your gifts, and inspire others." },
    earth: { id: "C", name: "Stability", desc: "You're in a grounding phase. Like fertile soil, you provide stability and nurture growth. Focus on building lasting foundations." },
    metal: { id: "D", name: "Refinement", desc: "You're in a refining phase. Like precious metal being polished, this is a time to clarify your values and sharpen your focus." },
    water: { id: "E", name: "Reflection", desc: "You're in a reflective phase. Like deep water, you hold wisdom and intuition. Trust your inner knowing and let insights surface naturally." },
  };
  
  return phases[element] || phases.water;
}

// 이메일 HTML 생성
function buildEmailHTML(opts: {
  name: string;
  phaseName: string;
  phaseDesc: string;
  dayMaster: string;
  dayMasterElement: string;
  elements: any;
  zodiac: string;
  readingId: string;
  saju: any;
}) {
  const elementColors: Record<string, string> = {
    wood: "#4a7c59",
    fire: "#c75146",
    earth: "#c9a227",
    metal: "#8d8d8d",
    water: "#4a6fa5",
  };

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
              <p style="margin:0;font-size:16px;line-height:1.6;color:#555;">Your timing preview is ready. Based on the Korean Four Pillars tradition, here's what we discovered...</p>
            </td>
          </tr>

          <!-- Four Pillars Summary -->
          <tr>
            <td style="padding:0 40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f3;border-radius:8px;">
                <tr>
                  <td style="padding:15px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;">Your Four Pillars</p>
                    <p style="margin:0;font-size:16px;color:#1a1a1a;font-family:monospace;">
                      ${opts.saju.yearPillarHanja} | ${opts.saju.monthPillarHanja} | ${opts.saju.dayPillarHanja} | ${opts.saju.hourPillarHanja}
                    </p>
                    <p style="margin:5px 0 0;font-size:12px;color:#666;">
                      Year | Month | Day | Hour
                    </p>
                  </td>
                </tr>
              </table>
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
                    <p style="margin:0;font-size:15px;color:#666;line-height:1.6;">${opts.phaseDesc}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Day Master -->
          <tr>
            <td style="padding:25px 40px;text-align:center;">
              <p style="margin:0 0 5px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;">Your Core Energy (Day Master)</p>
              <p style="margin:0;font-size:22px;color:${elementColors[opts.dayMasterElement]};">
                <strong>${opts.dayMaster}</strong> - ${opts.dayMasterElement.charAt(0).toUpperCase() + opts.dayMasterElement.slice(1)}
              </p>
            </td>
          </tr>

          <!-- Element Balance -->
          <tr>
            <td style="padding:20px 40px;">
              <p style="margin:0 0 15px;font-size:14px;color:#888;text-align:center;">Your Element Balance</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;"><table width="100%"><tr>
                  <td width="55" style="font-size:13px;color:#666;">Wood</td>
                  <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.wood}%;background:#4a7c59;border-radius:99px;"></div></div></td>
                  <td width="35" style="font-size:12px;color:#888;text-align:right;">${opts.elements.wood}%</td>
                </tr></table></td></tr>
                <tr><td style="padding:5px 0;"><table width="100%"><tr>
                  <td width="55" style="font-size:13px;color:#666;">Fire</td>
                  <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.fire}%;background:#c75146;border-radius:99px;"></div></div></td>
                  <td width="35" style="font-size:12px;color:#888;text-align:right;">${opts.elements.fire}%</td>
                </tr></table></td></tr>
                <tr><td style="padding:5px 0;"><table width="100%"><tr>
                  <td width="55" style="font-size:13px;color:#666;">Earth</td>
                  <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.earth}%;background:#c9a227;border-radius:99px;"></div></div></td>
                  <td width="35" style="font-size:12px;color:#888;text-align:right;">${opts.elements.earth}%</td>
                </tr></table></td></tr>
                <tr><td style="padding:5px 0;"><table width="100%"><tr>
                  <td width="55" style="font-size:13px;color:#666;">Metal</td>
                  <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.metal}%;background:#8d8d8d;border-radius:99px;"></div></div></td>
                  <td width="35" style="font-size:12px;color:#888;text-align:right;">${opts.elements.metal}%</td>
                </tr></table></td></tr>
                <tr><td style="padding:5px 0;"><table width="100%"><tr>
                  <td width="55" style="font-size:13px;color:#666;">Water</td>
                  <td><div style="height:8px;background:#eee;border-radius:99px;"><div style="height:8px;width:${opts.elements.water}%;background:#4a6fa5;border-radius:99px;"></div></div></td>
                  <td width="35" style="font-size:12px;color:#888;text-align:right;">${opts.elements.water}%</td>
                </tr></table></td></tr>
              </table>
              <p style="margin:15px 0 0;font-size:14px;color:#666;text-align:center;">
                Dominant: <strong style="color:${elementColors[opts.elements.dominant]};">${opts.elements.dominant.charAt(0).toUpperCase() + opts.elements.dominant.slice(1)}</strong> (${opts.elements.dominantCount} of 8)
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f0ede8;margin:10px 0;"></td></tr>

          <!-- Teaser -->
          <tr>
            <td style="padding:30px 40px;text-align:center;">
              <h3 style="margin:0 0 12px;font-size:22px;font-weight:normal;color:#1a1a1a;">This is just the beginning.</h3>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#555;">
                What you saw is a <strong>glimpse</strong>. Your full reading reveals <strong>8 life areas</strong> in depth:
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
              <p style="margin:0 0 20px;font-size:15px;color:#888;font-style:italic;">For less than the price of two lattes...</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 30px;text-align:center;">
              <a href="https://when.app/upgrade?rid=${opts.readingId}" style="display:inline-block;background:linear-gradient(135deg,#4a5d4a 0%,#3a4d3a 100%);color:#ffffff;text-decoration:none;padding:18px 40px;border-radius:8px;font-size:16px;font-weight:bold;">
                Unlock Full Reading - $19.99
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#aaa;">30-day money-back guarantee | Instant access</p>
            </td>
          </tr>

          <!-- Testimonial -->
          <tr>
            <td style="padding:25px 40px;background-color:#f8f6f3;text-align:center;">
              <p style="margin:0;font-size:14px;color:#666;font-style:italic;">"The insights were surprisingly accurate. I keep coming back to it."</p>
              <p style="margin:8px 0 0;font-size:12px;color:#888;">- Sarah K., Los Angeles</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:25px 40px;text-align:center;border-top:1px solid #f0ede8;">
              <p style="margin:0 0 8px;font-size:12px;color:#aaa;">2026 WHEN | Not predictions. Perspective.</p>
              <p style="margin:0;font-size:11px;color:#ccc;">Reading ID: ${opts.readingId}</p>
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

  // Parse birth date and time
  const [year, month, day] = body.birth_date.split("-").map(Number);
  let hour = 12, minute = 0; // Default to noon if no time provided
  
  if (body.birth_time) {
    const timeParts = body.birth_time.split(":");
    hour = parseInt(timeParts[0], 10);
    minute = parseInt(timeParts[1] || "0", 10);
  }

  // Calculate accurate Saju using manseryeok library
  const saju = calculateSaju(year, month, day, hour, minute);
  
  // Calculate elements from Saju
  const elements = calculateElements(saju);
  
  // Get phase from Day Master
  const dayMasterStem = saju.dayPillar.charAt(0);
  const dayMasterElement = STEM_ELEMENT[dayMasterStem];
  const phase = getPhaseFromDayMaster(saju.dayPillar);

  const rid = makeRID();

  // Save reading to DB
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
    saju_data: {
      yearPillar: saju.yearPillar,
      monthPillar: saju.monthPillar,
      dayPillar: saju.dayPillar,
      hourPillar: saju.hourPillar,
      yearPillarHanja: saju.yearPillarHanja,
      monthPillarHanja: saju.monthPillarHanja,
      dayPillarHanja: saju.dayPillarHanja,
      hourPillarHanja: saju.hourPillarHanja,
    },
  });

  // Send email if provided
  if (body.email) {
    await supabase.from("deliveries").insert({
      reading_id: rid,
      type: "free",
      status: "pending",
    });

    const html = buildEmailHTML({
      name: body.name,
      phaseName: phase.name,
      phaseDesc: phase.desc,
      dayMaster: saju.dayPillar,
      dayMasterElement,
      elements,
      zodiac: saju.yearPillar,
      readingId: rid,
      saju,
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

  return json({
    ok: true,
    reading_id: rid,
    phase: phase.id,
    saju: {
      year: saju.yearPillar,
      month: saju.monthPillar,
      day: saju.dayPillar,
      hour: saju.hourPillar,
    },
    elements,
  });
});
