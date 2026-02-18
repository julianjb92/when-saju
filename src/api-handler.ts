/**
 * WHEN - Main API Handler
 * 전체 시스템 통합 - Lovable에서 사용할 수 있는 함수들
 */

import { calculateSaju, formatSajuForEnglish, SajuResult } from './saju-calculator';
import { 
  generateFreeReading, 
  generateFullReading,
  formatFreeReadingForEmail,
  formatFullReadingForEmail
} from './ai-interpreter';
import { 
  sendFreeReadingEmail, 
  sendFullReadingEmail,
  sendPaymentConfirmationEmail 
} from './email-service';

// 환경 변수 타입
interface EnvConfig {
  OPENAI_API_KEY: string;
  RESEND_API_KEY: string;
  SITE_URL: string;
}

// 사용자 입력 타입
export interface UserInput {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;  // optional
  birthCity: string;
  birthCountry: string;
  email?: string;      // optional
  gender?: 'male' | 'female';
}

// 리딩 결과 타입
export interface ReadingResult {
  id: string;
  userId: string;
  type: 'free' | 'full';
  sajuData: object;
  readingText: string;
  createdAt: string;
}

/**
 * 고유 ID 생성
 */
function generateId(): string {
  return `when_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 1단계: FREE 리딩 처리
 * - 사주 계산
 * - AI 해석 생성
 * - 이메일 발송 (이메일 있는 경우)
 * - 결과 반환
 */
export async function processFreeReading(
  userInput: UserInput,
  config: EnvConfig
): Promise<{
  success: boolean;
  reading?: ReadingResult;
  emailSent?: boolean;
  error?: string;
}> {
  try {
    // 1. 사주 계산
    const saju = calculateSaju(
      userInput.birthYear,
      userInput.birthMonth,
      userInput.birthDay,
      userInput.birthHour,
      userInput.gender
    );

    // 2. AI 해석 생성
    const birthDate = `${userInput.birthYear}-${String(userInput.birthMonth).padStart(2, '0')}-${String(userInput.birthDay).padStart(2, '0')}`;
    const readingText = await generateFreeReading(
      saju,
      { name: userInput.name, birthDate },
      config.OPENAI_API_KEY
    );

    // 3. 결과 구성
    const reading: ReadingResult = {
      id: generateId(),
      userId: generateId(),
      type: 'free',
      sajuData: formatSajuForEnglish(saju),
      readingText,
      createdAt: new Date().toISOString(),
    };

    // 4. 이메일 발송 (이메일 있는 경우)
    let emailSent = false;
    if (userInput.email) {
      const emailHtml = formatFreeReadingForEmail(readingText, { name: userInput.name });
      const emailResult = await sendFreeReadingEmail(
        userInput.email,
        userInput.name,
        emailHtml,
        config.RESEND_API_KEY
      );
      emailSent = emailResult.success;
    }

    return {
      success: true,
      reading,
      emailSent,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 2단계: FULL 리딩 처리 (결제 후)
 * - 기존 사주 데이터 사용 또는 재계산
 * - AI 상세 해석 생성
 * - 결과 저장
 * - 확인 이메일 발송
 */
export async function processFullReading(
  userInput: UserInput,
  freeReadingId?: string,
  config?: EnvConfig
): Promise<{
  success: boolean;
  reading?: ReadingResult;
  readingUrl?: string;
  emailSent?: boolean;
  error?: string;
}> {
  if (!config) {
    return { success: false, error: 'Config required' };
  }

  try {
    // 1. 사주 계산
    const saju = calculateSaju(
      userInput.birthYear,
      userInput.birthMonth,
      userInput.birthDay,
      userInput.birthHour,
      userInput.gender
    );

    // 2. AI 상세 해석 생성
    const birthDate = `${userInput.birthYear}-${String(userInput.birthMonth).padStart(2, '0')}-${String(userInput.birthDay).padStart(2, '0')}`;
    const readingText = await generateFullReading(
      saju,
      { name: userInput.name, birthDate },
      config.OPENAI_API_KEY
    );

    // 3. 결과 구성
    const reading: ReadingResult = {
      id: generateId(),
      userId: freeReadingId || generateId(),
      type: 'full',
      sajuData: formatSajuForEnglish(saju),
      readingText,
      createdAt: new Date().toISOString(),
    };

    // 4. 리딩 URL 생성
    const readingUrl = `${config.SITE_URL}/reading/${reading.id}`;

    // 5. 이메일 발송 (이메일 있는 경우)
    let emailSent = false;
    if (userInput.email) {
      const confirmResult = await sendPaymentConfirmationEmail(
        userInput.email,
        userInput.name,
        readingUrl,
        config.RESEND_API_KEY
      );
      emailSent = confirmResult.success;
    }

    return {
      success: true,
      reading,
      readingUrl,
      emailSent,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * FULL 리딩 이메일 발송 (고객 요청 시)
 */
export async function sendFullReadingToEmail(
  email: string,
  userName: string,
  readingText: string,
  config: EnvConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailHtml = formatFullReadingForEmail(readingText, { name: userName });
    const result = await sendFullReadingEmail(
      email,
      userName,
      emailHtml,
      config.RESEND_API_KEY
    );
    return { success: result.success, error: result.error };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 사주만 계산 (디버그/테스트용)
 */
export function calculateSajuOnly(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour?: number,
  gender?: 'male' | 'female'
): { saju: SajuResult; formatted: object } {
  const saju = calculateSaju(birthYear, birthMonth, birthDay, birthHour, gender);
  return {
    saju,
    formatted: formatSajuForEnglish(saju),
  };
}

// Export all types
export type { EnvConfig, ReadingResult };
