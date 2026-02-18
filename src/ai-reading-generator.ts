/**
 * WHEN - AI Reading Generator
 * GPT-4를 사용하여 사주 데이터를 8가지 카테고리 해석으로 변환
 */

interface SajuData {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  yearPillarHanja: string;
  monthPillarHanja: string;
  dayPillarHanja: string;
  hourPillarHanja: string;
}

interface ElementBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: string;
  dominantCount: number;
}

interface UserInfo {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender?: string;
}

// 천간 영어 매핑
const STEM_ENGLISH: Record<string, { element: string; yinYang: string; desc: string }> = {
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

/**
 * FREE 리딩 프롬프트 - 성향 + 현재 Phase (맛보기)
 */
export function buildFreeReadingPrompt(saju: SajuData, elements: ElementBalance, user: UserInfo): string {
  const dayMasterStem = saju.dayPillar.charAt(0);
  const dayMasterInfo = STEM_ENGLISH[dayMasterStem] || { element: "Unknown", yinYang: "Unknown", desc: "" };
  
  return `You are WHEN, a warm and insightful life timing advisor who interprets Korean Four Pillars (Saju/사주) for Western audiences.

## TASK
Create a FREE preview reading that feels personal, accurate, and makes them want the full reading. This is a TEASER - give value but leave them wanting more.

## USER DATA
- Name: ${user.name}
- Birth: ${user.birthYear}/${user.birthMonth}/${user.birthDay}
- Gender: ${user.gender || "Not specified"}

## SAJU DATA (Four Pillars)
- Year Pillar: ${saju.yearPillar} (${saju.yearPillarHanja})
- Month Pillar: ${saju.monthPillar} (${saju.monthPillarHanja})
- Day Pillar: ${saju.dayPillar} (${saju.dayPillarHanja}) ← Day Master
- Hour Pillar: ${saju.hourPillar} (${saju.hourPillarHanja})

## DAY MASTER ANALYSIS
- Element: ${dayMasterInfo.element}
- Yin/Yang: ${dayMasterInfo.yinYang}
- Core trait: ${dayMasterInfo.desc}

## ELEMENT BALANCE
- Wood: ${elements.wood}%
- Fire: ${elements.fire}%
- Earth: ${elements.earth}%
- Metal: ${elements.metal}%
- Water: ${elements.water}%
- Dominant: ${elements.dominant} (${elements.dominantCount} of 8 positions)

## OUTPUT FORMAT (Use this exact structure)

### Your Core Energy

[2-3 sentences about their Day Master personality. Be specific based on their element. Make it feel like a revelation - "You're the type who..."]

### Your Natural Strengths

[2-3 bullet points about what they're naturally good at based on their chart]

### Current Life Phase

[2-3 sentences about what phase of life they're in NOW. Reference the dominant element's meaning.]

### A Glimpse of What's Ahead

[1-2 intriguing sentences that hint at what the full reading reveals, without giving it away. Create curiosity.]

---

🔮 **Your full reading reveals:** detailed insights on love timing, career moves, wealth opportunities, and your complete 2026 monthly forecast.

---

## TONE GUIDELINES
- Warm, like a wise friend - not a fortune teller
- Specific, not generic horoscope language
- Confident but not preachy
- Use "you" language throughout
- Avoid clichés like "You are destined for greatness"
- Make it feel personally accurate

## LENGTH
200-300 words total. Quality over quantity.`;
}

/**
 * PAID 리딩 프롬프트 - 8가지 카테고리 전체
 */
export function buildPaidReadingPrompt(saju: SajuData, elements: ElementBalance, user: UserInfo, currentYear: number): string {
  const dayMasterStem = saju.dayPillar.charAt(0);
  const dayMasterInfo = STEM_ENGLISH[dayMasterStem] || { element: "Unknown", yinYang: "Unknown", desc: "" };
  
  return `You are WHEN, a master interpreter of Korean Four Pillars (Saju/사주) known for deeply personal and actionable life insights.

## TASK
Create a COMPREHENSIVE paid reading covering all 8 life areas. This is the FULL product - deliver exceptional value that makes them feel it was worth every penny.

## USER DATA
- Name: ${user.name}
- Birth: ${user.birthYear}/${user.birthMonth}/${user.birthDay}
- Gender: ${user.gender || "Not specified"}
- Current Year: ${currentYear}

## SAJU DATA (Four Pillars)
- Year Pillar: ${saju.yearPillar} (${saju.yearPillarHanja}) - Outer world, society, ancestry
- Month Pillar: ${saju.monthPillar} (${saju.monthPillarHanja}) - Career, parents, early adulthood
- Day Pillar: ${saju.dayPillar} (${saju.dayPillarHanja}) - Self, spouse, core identity ← DAY MASTER
- Hour Pillar: ${saju.hourPillar} (${saju.hourPillarHanja}) - Children, later life, inner dreams

## DAY MASTER (일간) - THE CORE SELF
- Element: ${dayMasterInfo.element}
- Yin/Yang: ${dayMasterInfo.yinYang}
- Archetype: ${dayMasterInfo.desc}

## ELEMENT BALANCE
- Wood: ${elements.wood}% ${elements.dominant === 'wood' ? '(DOMINANT)' : ''}
- Fire: ${elements.fire}% ${elements.dominant === 'fire' ? '(DOMINANT)' : ''}
- Earth: ${elements.earth}% ${elements.dominant === 'earth' ? '(DOMINANT)' : ''}
- Metal: ${elements.metal}% ${elements.dominant === 'metal' ? '(DOMINANT)' : ''}
- Water: ${elements.water}% ${elements.dominant === 'water' ? '(DOMINANT)' : ''}

## OUTPUT: 8 LIFE CATEGORIES

### 1. 💰 Wealth & Money

[4-5 sentences about their wealth energy, how money flows for them, best ways to attract abundance, spending patterns, and current wealth timing. Be specific to their chart.]

### 2. 💼 Business & Ventures

[4-5 sentences about entrepreneurial energy, partnership compatibility, business timing, what industries suit them, and current business climate for them.]

### 3. ❤️ Love & Relationships

[4-5 sentences about their relationship style, what they need in a partner, compatibility patterns, current love timing, and relationship advice based on their chart.]

### 4. 📈 Career & Advancement

[4-5 sentences about career path, promotion timing, workplace dynamics, leadership style, and current career energy.]

### 5. 🌊 When Life Feels Heavy

[4-5 sentences about their challenge patterns, what drains them, how to recharge, and perspective on current difficulties if any. Compassionate and supportive tone.]

### 6. 📅 ${currentYear} Monthly Forecast

[For each month, 1-2 sentences about the energy:]

**January:** [energy/focus]
**February:** [energy/focus]
**March:** [energy/focus]
**April:** [energy/focus]
**May:** [energy/focus]
**June:** [energy/focus]
**July:** [energy/focus]
**August:** [energy/focus]
**September:** [energy/focus]
**October:** [energy/focus]
**November:** [energy/focus]
**December:** [energy/focus]

### 7. ⭐ ${currentYear} Overall Theme

[4-5 sentences about the overarching theme of this year for them. What's the lesson? What's the opportunity? What should they focus on?]

### 8. 🧭 Your Life Phase & Path

[5-6 sentences about where they are in the bigger picture of life. What phase are they in? What's coming next? What should they embrace or release? End with empowering guidance.]

---

## KEY TAKEAWAYS

• [Most important insight #1]
• [Most important insight #2]
• [Most important insight #3]

---

## TONE GUIDELINES
- Speak as a wise mentor who genuinely cares
- Be specific - reference their actual elements and pillars
- Actionable advice, not vague predictions
- Empowering, never fear-based
- Use "you" language throughout
- Balance honesty with compassion

## LENGTH
1000-1200 words total. Comprehensive but not padded.`;
}

/**
 * OpenAI API 호출
 */
export async function generateReading(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are WHEN, a warm and insightful life timing advisor. You interpret Korean Four Pillars (Saju) for Western audiences with accuracy, warmth, and actionable wisdom."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.75,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

/**
 * FREE 리딩 생성
 */
export async function generateFreeReading(
  saju: SajuData,
  elements: ElementBalance,
  user: UserInfo,
  apiKey: string
): Promise<string> {
  const prompt = buildFreeReadingPrompt(saju, elements, user);
  return generateReading(prompt, apiKey);
}

/**
 * PAID 리딩 생성
 */
export async function generatePaidReading(
  saju: SajuData,
  elements: ElementBalance,
  user: UserInfo,
  apiKey: string
): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prompt = buildPaidReadingPrompt(saju, elements, user, currentYear);
  return generateReading(prompt, apiKey);
}
