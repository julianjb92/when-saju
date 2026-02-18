/**
 * WHEN - Saju Reading Service
 * 한국식 사주팔자 기반 타이밍 서비스
 * 
 * Usage:
 * import { processFreeReading, processFullReading } from 'when-saju';
 */

// Core calculator
export { 
  calculateSaju, 
  formatSajuForEnglish,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  FIVE_ELEMENTS,
  TEN_GODS,
} from './saju-calculator';

export type { SajuResult, MajorCycle } from './saju-calculator';

// AI interpreter
export {
  generateFreeReading,
  generateFullReading,
  formatFreeReadingForEmail,
  formatFullReadingForEmail,
} from './ai-interpreter';

// Email service
export {
  sendEmail,
  sendFreeReadingEmail,
  sendFullReadingEmail,
  sendPaymentConfirmationEmail,
} from './email-service';

// Main API handlers
export {
  processFreeReading,
  processFullReading,
  sendFullReadingToEmail,
  calculateSajuOnly,
} from './api-handler';

export type { UserInput, ReadingResult, EnvConfig } from './api-handler';
