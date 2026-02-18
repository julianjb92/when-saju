/**
 * WHEN - AI Interpreter
 * GPT-4를 사용하여 사주 결과를 매력적인 영어 해석으로 변환
 */

import { SajuResult, formatSajuForEnglish, FIVE_ELEMENTS } from './saju-calculator';

// OpenAI API 타입
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * FREE 리딩 프롬프트 (무료 버전)
 * - 현재 Phase (시기)
 * - 기본 성격/성향
 * - 현재 에너지 상태
 */
function getFreeReadingPrompt(sajuData: object, userInfo: { name: string; birthDate: string }): string {
  return `You are a warm, insightful life coach who interprets Korean Four Pillars (Saju/사주) timing wisdom for Western audiences.

Your task: Create a FREE preview reading that feels personal, accurate, and leaves them wanting more.

USER INFO:
- Name: ${userInfo.name}
- Birth Date: ${userInfo.birthDate}

SAJU DATA:
${JSON.stringify(sajuData, null, 2)}

INSTRUCTIONS:
1. Start with their "Current Phase" - what life stage/timing energy they're in NOW
2. Give 2-3 personality insights based on their Day Master element
3. Mention their zodiac animal briefly
4. End with a teaser about what the full reading reveals (8 categories)

TONE:
- Warm, like a wise friend giving advice
- Confident but not preachy
- Use "you" language, make it personal
- Avoid jargon - explain concepts simply
- Make it feel like a revelation, not a fortune cookie

FORMAT (use this exact structure):
---
## Your Current Phase: [Phase Name]

[2-3 sentences about their current timing/life phase]

## Your Core Energy: [Element] [Yin/Yang]

[2-3 sentences about their personality based on Day Master]

## Your Natural Rhythm

[2-3 sentences about their elemental balance and what it means]

---

🔮 **Your Full Timing Map awaits**
Unlock insights across 8 life areas: Career, Love, Wealth, Health, Relationships, Personal Growth, Life Purpose, and 2024 Forecast.

---

LENGTH: 200-300 words total
DO NOT: Use clichés, be vague, or sound like a horoscope. Be specific to their chart.`;
}

/**
 * FULL 리딩 프롬프트 (유료 버전)
 * 8개 카테고리 상세 분석
 */
function getFullReadingPrompt(sajuData: object, userInfo: { name: string; birthDate: string }): string {
  return `You are a master interpreter of Korean Four Pillars (Saju/사주) wisdom, known for deeply personal and actionable insights.

Your task: Create a comprehensive FULL reading across 8 life categories.

USER INFO:
- Name: ${userInfo.name}
- Birth Date: ${userInfo.birthDate}

SAJU DATA:
${JSON.stringify(sajuData, null, 2)}

INSTRUCTIONS:
Provide detailed insights for each of the 8 categories below. Each section should:
- Be specific to their chart (reference their elements, Day Master, etc.)
- Include practical advice
- Feel personal and insightful, not generic

TONE:
- Warm, wise, and empowering
- Use "you" language throughout
- Explain concepts simply for Western readers
- Be encouraging but honest

FORMAT (use this exact structure for each section):

# Your Complete Timing Map

## 1. Career & Professional Life
[4-5 sentences about their career energy, best work environments, professional strengths, and current career timing]

## 2. Love & Relationships  
[4-5 sentences about their relationship style, compatibility patterns, and current love timing]

## 3. Wealth & Finances
[4-5 sentences about their money energy, earning style, and financial timing]

## 4. Health & Vitality
[4-5 sentences about their physical constitution, health focus areas, and energy management]

## 5. Family & Close Relationships
[4-5 sentences about their family dynamics, friendship style, and relational patterns]

## 6. Personal Growth & Learning
[4-5 sentences about their growth path, learning style, and developmental focus]

## 7. Life Purpose & Direction
[4-5 sentences about their deeper calling, life themes, and purpose indicators]

## 8. ${new Date().getFullYear()} Forecast
[4-5 sentences about this year's specific energies for them and what to focus on]

---

## Key Takeaways
[3 bullet points summarizing the most important insights]

---

LENGTH: 800-1000 words total
DO NOT: Be vague, use clichés, or give generic advice. Every insight should feel specific to this person's chart.`;
}

/**
 * OpenAI API 호출
 */
async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json() as OpenAIResponse;
  return data.choices[0]?.message?.content || '';
}

/**
 * FREE 리딩 생성
 */
export async function generateFreeReading(
  saju: SajuResult,
  userInfo: { name: string; birthDate: string },
  apiKey: string
): Promise<string> {
  const sajuData = formatSajuForEnglish(saju);
  const prompt = getFreeReadingPrompt(sajuData, userInfo);
  return await callOpenAI(prompt, apiKey);
}

/**
 * FULL 리딩 생성
 */
export async function generateFullReading(
  saju: SajuResult,
  userInfo: { name: string; birthDate: string },
  apiKey: string
): Promise<string> {
  const sajuData = formatSajuForEnglish(saju);
  const prompt = getFullReadingPrompt(sajuData, userInfo);
  return await callOpenAI(prompt, apiKey);
}

/**
 * 이메일용 HTML 포맷팅 (FREE 버전)
 */
export function formatFreeReadingForEmail(reading: string, userInfo: { name: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your WHEN Reading</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: #2d2d2d;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #faf9f7;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
      letter-spacing: 2px;
    }
    h1 {
      font-size: 28px;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 20px;
      color: #4a5d4a;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    p {
      margin-bottom: 16px;
    }
    .cta-section {
      background: linear-gradient(135deg, #4a5d4a 0%, #6b7b6b 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin-top: 40px;
    }
    .cta-section h3 {
      margin: 0 0 15px 0;
      font-size: 22px;
    }
    .cta-button {
      display: inline-block;
      background: white;
      color: #4a5d4a;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 15px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">WHEN</div>
    <p style="color: #666; font-style: italic;">Your timing, revealed.</p>
  </div>
  
  <h1>Hello, ${userInfo.name}</h1>
  <p>Here's your free timing preview based on the Korean Four Pillars tradition.</p>
  
  <div class="content">
    ${reading.replace(/## /g, '<h2>').replace(/\n\n/g, '</p><p>').replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>')}
  </div>
  
  <div class="cta-section">
    <h3>Ready for your complete map?</h3>
    <p>Unlock all 8 life categories with detailed insights personalized to your unique timing.</p>
    <a href="https://when.app/upgrade" class="cta-button">Get Full Reading →</a>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} WHEN. Not predictions. Perspective.</p>
    <p>You received this email because you requested a timing reading.</p>
  </div>
</body>
</html>
`;
}

/**
 * 이메일용 HTML 포맷팅 (FULL 버전)
 */
export function formatFullReadingForEmail(reading: string, userInfo: { name: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Complete WHEN Reading</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: #2d2d2d;
      max-width: 700px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #faf9f7;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e8e5e0;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #1a1a1a;
      letter-spacing: 3px;
    }
    .premium-badge {
      display: inline-block;
      background: linear-gradient(135deg, #c9a961 0%, #e8d5a3 100%);
      color: #1a1a1a;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-top: 10px;
    }
    h1 {
      font-size: 32px;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 22px;
      color: #4a5d4a;
      margin-top: 40px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e8e5e0;
    }
    p {
      margin-bottom: 16px;
    }
    .key-takeaways {
      background: #f5f3ef;
      padding: 25px;
      border-radius: 12px;
      margin-top: 40px;
    }
    .key-takeaways h3 {
      margin-top: 0;
      color: #4a5d4a;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e8e5e0;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">WHEN</div>
    <div class="premium-badge">✨ FULL READING</div>
    <p style="color: #666; font-style: italic;">Your complete timing map.</p>
  </div>
  
  <h1>${userInfo.name}'s Timing Map</h1>
  <p>Your personalized reading based on the Korean Four Pillars tradition.</p>
  
  <div class="content">
    ${reading.replace(/# /g, '<h1>').replace(/## /g, '<h2>').replace(/\n\n/g, '</p><p>').replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>')}
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} WHEN. Not predictions. Perspective.</p>
    <p>This reading was generated for ${userInfo.name} based on their unique birth timing.</p>
  </div>
</body>
</html>
`;
}
