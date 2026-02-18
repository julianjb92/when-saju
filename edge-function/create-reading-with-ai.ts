// Supabase Edge Function: create-reading (WITH AI INTERPRETATION)
// - Accurate Saju calculation using manseryeok
// - AI-powered reading using GPT-4
// - Sends personalized email via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { calculateSaju } from "npm:@fullstackfamily/manseryeok";

type Payload = {
  name: string;
  birth_date: string;
  birth_city: string;
  gender?: string;
  birth_time?: string;
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
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `RID-${s}`;
}

// 천간 오행 매핑
const STEM_ELEMENT: Record<string, string> = {
  "갑": "wood", "을": "wood", "병": "fire", "정": "fire",
  "무": "earth", "기": "earth", "경": "metal", "신": "metal",
  "임": "water", "계": "water",
};

const BRANCH_ELEMENT: Record<string, string> = {
  "자": "water", "축": "earth", "인": "wood", "묘": "wood",
  "진": "earth", "사": "fire", "오": "fire", "미": "earth",
  "신": "metal", "유": "metal", "술": "earth", "해": "water",
};

const STEM_INFO: Record<string, { element: string; yinYang: string; desc: string }> = {
  "갑": { element: "Wood", yinYang: "Yang", desc: "Pioneer, leader, bold initiator" },
  "을": { element: "Wood", yinYang: "Yin", desc: "Flexible, creative, adaptive" },
  "병": { element: "Fire", yinYang: "Yang", desc: "Radiant, passionate, expressive" },
  "정": { element: "Fire", yinYang: "Yin", desc: "Warm, nurturing, illuminating" },
  "무": { element: "Earth", yinYang: "Yang", desc: "Stable, reliable, grounding" },
  "기": { element: "Earth", yinYang: "Yin", desc: "Nurturing, patient, supportive" },
  "경": { element: "Metal", yinYang: "Yang", desc: "Decisive, principled, strong-willed" },
  "신": { element: "Metal", yinYang: "Yin", desc: "Refined, precise, detail-oriented" },
  "임": { element: "Water", yinYang: "Yang", desc: "Wise, flowing, intellectually deep" },
  "계": { element: "Water", yinYang: "Yin", desc: "Intuitive, mysterious, emotionally deep" },
};

function calculateElements(saju: any) {
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const pillars = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar];
  
  for (const pillar of pillars) {
    if (!pillar) continue;
    const stem = pillar.charAt(0);
    const branch = pillar.charAt(1);
    if (STEM_ELEMENT[stem]) elements[STEM_ELEMENT[stem] as keyof typeof elements]++;
    if (BRANCH_ELEMENT[branch]) elements[BRANCH_ELEMENT[branch] as keyof typeof elements]++;
  }
  
  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  
  return {
    wood: Math.round((elements.wood / total) * 100),
    fire: Math.round((elements.fire / total) * 100),
    earth: Math.round((elements.earth / total) * 100),
    metal: Math.round((elements.metal / total) * 100),
    water: Math.round((elements.water / total) * 100),
    dominant: sorted[0][0],
    dominantCount: sorted[0][1],
  };
}

// FREE 리딩 프롬프트 생성
function buildFreePrompt(saju: any, elements: any, name: string, birthYear: number) {
  const dayMaster = saju.dayPillar.charAt(0);
  const info = STEM_INFO[dayMaster] || { element: "Unknown", yinYang: "Unknown", desc: "" };
  
  return `You are WHEN, a warm life timing advisor interpreting Korean Saju for Western audiences.

Create a FREE preview reading. Be specific, warm, and make them want the full reading.

USER: ${name}, born ${birthYear}

SAJU:
- Year: ${saju.yearPillar} (${saju.yearPillarHanja})
- Month: ${saju.monthPillar} (${saju.monthPillarHanja})
- Day: ${saju.dayPillar} (${saju.dayPillarHanja}) ← Day Master: ${info.yinYang} ${info.element}
- Hour: ${saju.hourPillar} (${saju.hourPillarHanja})

ELEMENTS: Wood ${elements.wood}%, Fire ${elements.fire}%, Earth ${elements.earth}%, Metal ${elements.metal}%, Water ${elements.water}%
DOMINANT: ${elements.dominant} (${elements.dominantCount}/8)

Write in this format:

## Your Core Energy

[2-3 sentences about their personality based on Day Master. Make it feel like a revelation.]

## Your Natural Strengths

• [Strength 1]
• [Strength 2]
• [Strength 3]

## Your Current Phase

[2-3 sentences about where they are NOW in life's timing.]

## What's Ahead

[1-2 intriguing sentences hinting at what the full reading reveals.]

---

TONE: Warm friend, not fortune teller. Specific, not generic. 200-250 words.`;
}

// GPT-4 호출
async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
      max_tokens: 1000,
    }),
  });
  
  if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
  const data = await resp.json();
  return data.choices[0]?.message?.content || "";
}

// 이메일 HTML 생성
function buildEmailHTML(name: string, reading: string, elements: any, saju: any, readingId: string) {
  const elementColors: Record<string, string> = {
    wood: "#4a7c59", fire: "#c75146", earth: "#c9a227", metal: "#8d8d8d", water: "#4a6fa5"
  };
  
  // Markdown to HTML 간단 변환
  const readingHtml = reading
    .replace(/## (.*)/g, '<h2 style="font-size:20px;color:#1a1a1a;margin:25px 0 12px;font-weight:normal;">$1</h2>')
    .replace(/• (.*)/g, '<li style="margin:6px 0;color:#555;">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin:12px 0;line-height:1.6;color:#555;">')
    .replace(/---/g, '<hr style="border:none;border-top:1px solid #eee;margin:25px 0;">');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Georgia,serif;background:#faf9f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
        
        <!-- Header -->
        <tr><td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #f0ede8;">
          <h1 style="margin:0;font-size:28px;letter-spacing:3px;color:#1a1a1a;">WHEN</h1>
          <p style="margin:10px 0 0;font-size:14px;color:#888;font-style:italic;">Your timing, revealed.</p>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:30px 40px 10px;">
          <h2 style="margin:0;font-size:22px;font-weight:normal;color:#1a1a1a;">Hello, ${name}</h2>
          <p style="margin:10px 0;font-size:15px;color:#666;">Your personalized timing preview is ready.</p>
        </td></tr>

        <!-- Four Pillars -->
        <tr><td style="padding:10px 40px;">
          <table width="100%" style="background:#f8f6f3;border-radius:8px;"><tr><td style="padding:15px;text-align:center;">
            <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;">Your Four Pillars</p>
            <p style="margin:0;font-size:18px;color:#1a1a1a;font-family:monospace;">
              ${saju.yearPillarHanja} · ${saju.monthPillarHanja} · ${saju.dayPillarHanja} · ${saju.hourPillarHanja}
            </p>
          </td></tr></table>
        </td></tr>

        <!-- AI Reading -->
        <tr><td style="padding:20px 40px;">
          <p style="margin:12px 0;line-height:1.6;color:#555;">${readingHtml}</p>
        </td></tr>

        <!-- Element Balance -->
        <tr><td style="padding:20px 40px;">
          <p style="margin:0 0 15px;font-size:14px;color:#888;text-align:center;">Your Element Balance</p>
          ${['wood','fire','earth','metal','water'].map(el => `
            <div style="margin:8px 0;display:flex;align-items:center;">
              <span style="width:50px;font-size:12px;color:#666;">${el.charAt(0).toUpperCase()+el.slice(1)}</span>
              <div style="flex:1;height:8px;background:#eee;border-radius:99px;margin:0 10px;">
                <div style="height:8px;width:${elements[el]}%;background:${elementColors[el]};border-radius:99px;"></div>
              </div>
              <span style="width:35px;font-size:12px;color:#888;text-align:right;">${elements[el]}%</span>
            </div>
          `).join('')}
        </td></tr>

        <!-- Teaser -->
        <tr><td style="padding:30px 40px;text-align:center;background:#f8f6f3;">
          <h3 style="margin:0 0 12px;font-size:20px;font-weight:normal;color:#1a1a1a;">This is just the beginning.</h3>
          <p style="margin:0 0 15px;font-size:14px;color:#555;line-height:1.5;">
            Your full reading reveals <strong>8 life areas</strong> in depth:<br>
            Wealth · Business · Love · Career · Challenges · Monthly Forecast · 2026 Theme · Life Path
          </p>
          <p style="margin:0 0 20px;font-size:14px;color:#888;font-style:italic;">For less than the price of two lattes...</p>
          <a href="https://when.app/upgrade?rid=${readingId}" style="display:inline-block;background:#4a5d4a;color:#fff;text-decoration:none;padding:16px 35px;border-radius:8px;font-size:15px;font-weight:bold;">
            Unlock Full Reading - $19.99
          </a>
          <p style="margin:12px 0 0;font-size:11px;color:#aaa;">30-day money-back guarantee</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;text-align:center;border-top:1px solid #f0ede8;">
          <p style="margin:0;font-size:11px;color:#aaa;">2026 WHEN · Not predictions. Perspective. · ID: ${readingId}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true });
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
  const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    const body: Payload = await req.json();
    if (!body.name || !body.birth_date || !body.birth_city) {
      return json({ error: "Missing required fields" }, 400);
    }

    // Parse birth info
    const [year, month, day] = body.birth_date.split("-").map(Number);
    let hour = 12, minute = 0;
    if (body.birth_time) {
      const parts = body.birth_time.split(":");
      hour = parseInt(parts[0], 10);
      minute = parseInt(parts[1] || "0", 10);
    }

    // Calculate accurate Saju
    const saju = calculateSaju(year, month, day, hour, minute);
    const elements = calculateElements(saju);
    const rid = makeRID();

    // Generate AI reading
    const prompt = buildFreePrompt(saju, elements, body.name, year);
    const reading = await callOpenAI(prompt, OPENAI_API_KEY);

    // Get phase from Day Master
    const dayMasterElement = STEM_ELEMENT[saju.dayPillar.charAt(0)] || "water";
    const phaseMap: Record<string, string> = { wood: "A", fire: "B", earth: "C", metal: "D", water: "E" };

    // Save to DB
    await supabase.from("readings").insert({
      reading_id: rid,
      name: body.name,
      email: body.email || null,
      birth_date: body.birth_date,
      birth_time: body.birth_time || null,
      birth_city: body.birth_city,
      gender: body.gender || null,
      phase: phaseMap[dayMasterElement],
      five_elements: elements,
      saju_data: {
        yearPillar: saju.yearPillar, monthPillar: saju.monthPillar,
        dayPillar: saju.dayPillar, hourPillar: saju.hourPillar,
        yearPillarHanja: saju.yearPillarHanja, monthPillarHanja: saju.monthPillarHanja,
        dayPillarHanja: saju.dayPillarHanja, hourPillarHanja: saju.hourPillarHanja,
      },
      free_reading: reading,
    });

    // Send email
    if (body.email) {
      await supabase.from("deliveries").insert({ reading_id: rid, type: "free", status: "pending" });
      
      const html = buildEmailHTML(body.name, reading, elements, saju, rid);
      const emailResp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [body.email],
          subject: `${body.name}, your timing preview is ready`,
          html,
        }),
      });

      await supabase.from("deliveries").update({ status: emailResp.ok ? "sent" : "failed" })
        .eq("reading_id", rid).eq("status", "pending");
    }

    return json({
      ok: true,
      reading_id: rid,
      phase: phaseMap[dayMasterElement],
      saju: { year: saju.yearPillar, month: saju.monthPillar, day: saju.dayPillar, hour: saju.hourPillar },
      elements,
      reading,
    });

  } catch (err: any) {
    console.error("Error:", err);
    return json({ error: err.message || "Internal error" }, 500);
  }
});
