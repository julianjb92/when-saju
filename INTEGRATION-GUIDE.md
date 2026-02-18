# WHEN - Lovable 통합 가이드

## 📁 프로젝트 구조

```
when-saju/
├── src/
│   ├── saju-calculator.ts   # 사주 계산 로직
│   ├── ai-interpreter.ts    # AI 해석 (OpenAI)
│   ├── email-service.ts     # 이메일 발송 (Resend)
│   ├── api-handler.ts       # 통합 API
│   └── index.ts             # Export
├── test/
│   └── test-saju.ts         # 테스트
└── package.json
```

---

## 🔧 Lovable 통합 방법

### 방법 1: 코드 복사 (간단)

1. Lovable에서 `src/lib/` 폴더 생성
2. 아래 파일들 복사:
   - `saju-calculator.ts` → `src/lib/saju-calculator.ts`
   - `ai-interpreter.ts` → `src/lib/ai-interpreter.ts`
   - `email-service.ts` → `src/lib/email-service.ts`
   - `api-handler.ts` → `src/lib/api-handler.ts`

### 방법 2: Supabase Edge Function (추천)

API 키를 안전하게 보관하려면 Supabase Edge Function 사용 추천

---

## 🔑 필요한 API 키

```env
OPENAI_API_KEY=sk-...       # OpenAI API 키
RESEND_API_KEY=re_...       # Resend API 키
SITE_URL=https://when.app   # 사이트 URL
```

Lovable에서: Settings → Secrets에 추가

---

## 📝 사용 예시

### 1. FREE 리딩 생성

```typescript
import { processFreeReading } from '@/lib/api-handler';

const result = await processFreeReading(
  {
    name: "John Smith",
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    birthHour: 14,  // optional
    birthCity: "New York",
    birthCountry: "United States",
    email: "john@example.com",  // optional
  },
  {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    SITE_URL: process.env.SITE_URL!,
  }
);

if (result.success) {
  console.log(result.reading?.readingText);
  console.log("Email sent:", result.emailSent);
}
```

### 2. FULL 리딩 생성 (결제 후)

```typescript
import { processFullReading } from '@/lib/api-handler';

const result = await processFullReading(
  userInput,
  freeReadingId,  // 이전 FREE 리딩 ID
  config
);

// result.readingUrl → 리딩 페이지 URL
// result.reading.readingText → 전체 리딩 텍스트
```

### 3. 사주만 계산 (AI 없이)

```typescript
import { calculateSaju, formatSajuForEnglish } from '@/lib/saju-calculator';

const saju = calculateSaju(1990, 5, 15, 14);
const formatted = formatSajuForEnglish(saju);

console.log(formatted.dayMaster);  // { element: 'Fire', yinYang: 'Yin', ... }
console.log(formatted.zodiac);     // { animal: 'Horse', ... }
```

---

## 🔄 시스템 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                        START PAGE                            │
│  [Name] [Birth Date] [Time] [City] [Country] [Email]        │
│                    [See my phase →]                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     processFreeReading()                     │
│  1. calculateSaju() → 사주 계산                              │
│  2. generateFreeReading() → AI 해석 (GPT-4)                 │
│  3. sendFreeReadingEmail() → 이메일 발송                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FREE RESULT PAGE                          │
│  "Your Current Phase: Transition..."                         │
│  "Your Core Energy: Yin Fire..."                            │
│                                                              │
│  [🔒 Unlock Full Reading - $19.99]                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Paddle 결제)
┌─────────────────────────────────────────────────────────────┐
│                    processFullReading()                      │
│  1. generateFullReading() → 8개 카테고리 상세 분석           │
│  2. 결과 저장 (DB)                                          │
│  3. sendPaymentConfirmationEmail() → 확인 이메일             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FULL RESULT PAGE                          │
│  1. Career & Professional Life                               │
│  2. Love & Relationships                                     │
│  3. Wealth & Finances                                        │
│  ...                                                         │
│  8. 2026 Forecast                                            │
│                                                              │
│  [📧 Send to my email]  [📱 Share]                          │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Lovable에서 페이지 구현

### 필요한 페이지들

1. `/start` - 입력 폼 (이미 있음)
2. `/free-result` - FREE 리딩 결과 (NEW)
3. `/checkout` - Paddle 결제 (NEW)
4. `/reading/[id]` - FULL 리딩 결과 (NEW)

### Lovable AI에게 요청할 프롬프트

```
Create a new page at /free-result that:
1. Shows the free reading result (passed via state/URL params)
2. Displays the reading text in a beautiful, readable format
3. Has a prominent CTA button "Unlock Full Reading - $19.99"
4. Includes social share buttons
5. Uses the same design system as the landing page
```

---

## 💳 Paddle 결제 연동

```typescript
// Paddle.js 초기화 (Lovable에서)
Paddle.Setup({ vendor: YOUR_VENDOR_ID });

// 결제 버튼 클릭 시
function handlePurchase() {
  Paddle.Checkout.open({
    product: YOUR_PRODUCT_ID,
    email: userEmail,
    passthrough: JSON.stringify({ 
      readingId: freeReadingId,
      userInput: userInput 
    }),
    successCallback: (data) => {
      // 결제 성공 → FULL 리딩 생성
      processFullReading(userInput, freeReadingId, config);
    }
  });
}
```

---

## 📧 이메일 템플릿 커스터마이징

`email-service.ts`와 `ai-interpreter.ts`에서 HTML 템플릿 수정 가능

색상, 로고, 문구 등 WHEN 브랜딩에 맞게 수정하세요.

---

## 🚀 다음 단계

1. [ ] Lovable에 코드 복사
2. [ ] Supabase 연동 (사용자 데이터 저장)
3. [ ] API 키 설정 (Secrets)
4. [ ] FREE 결과 페이지 만들기
5. [ ] Paddle 결제 연동
6. [ ] FULL 결과 페이지 만들기
7. [ ] 테스트

질문 있으면 언제든 물어보세요! 🎯
