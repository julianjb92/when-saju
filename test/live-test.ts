import { calculateSaju, formatSajuForEnglish } from '../src/saju-calculator';

// 테스트: 1992년 7월 15일 오후 2시 (예시)
const testInput = {
  year: 1992,
  month: 7,
  day: 15,
  hour: 14,
  name: "Test User"
};

console.log('🔮 WHEN 사주 분석 테스트');
console.log('========================\n');
console.log(`입력: ${testInput.year}년 ${testInput.month}월 ${testInput.day}일 ${testInput.hour}시\n`);

const saju = calculateSaju(testInput.year, testInput.month, testInput.day, testInput.hour);
const formatted = formatSajuForEnglish(saju);

console.log('📊 Four Pillars (사주):');
console.log(`  Year:  ${formatted.fourPillars.year}`);
console.log(`  Month: ${formatted.fourPillars.month}`);
console.log(`  Day:   ${formatted.fourPillars.day}`);
console.log(`  Hour:  ${formatted.fourPillars.hour}\n`);

console.log('🎯 Day Master (일간):');
console.log(`  ${formatted.dayMaster.description}\n`);

console.log('🐲 Zodiac (띠):');
console.log(`  ${formatted.zodiac.animal} (${formatted.zodiac.element})\n`);

console.log('⚖️ Element Balance (오행):');
console.log(`  Wood: ${formatted.elementBalance.Wood}`);
console.log(`  Fire: ${formatted.elementBalance.Fire}`);
console.log(`  Earth: ${formatted.elementBalance.Earth}`);
console.log(`  Metal: ${formatted.elementBalance.Metal}`);
console.log(`  Water: ${formatted.elementBalance.Water}`);
console.log(`  → Dominant: ${formatted.elementBalance.dominant}`);
console.log(`  → Weakest: ${formatted.elementBalance.weakest}\n`);

console.log('☯️ Yin-Yang:');
console.log(`  Yin: ${formatted.yinYangBalance.yin}, Yang: ${formatted.yinYangBalance.yang}\n`);

// 간단한 해석 생성
console.log('📝 기본 해석 (AI 없이):');
const dayMasterTraits: Record<string, string> = {
  'Wood': 'growth-oriented, flexible, creative, and compassionate',
  'Fire': 'passionate, charismatic, enthusiastic, and expressive',
  'Earth': 'stable, nurturing, reliable, and grounded',
  'Metal': 'disciplined, precise, determined, and refined',
  'Water': 'adaptable, intuitive, wise, and flowing',
};
const yinYangTrait = formatted.dayMaster.yinYang === 'Yin' 
  ? 'receptive, introspective, and subtle' 
  : 'active, outgoing, and direct';

console.log(`  As a ${formatted.dayMaster.description} person, you are naturally ${dayMasterTraits[formatted.dayMaster.element]}.`);
console.log(`  Your ${formatted.dayMaster.yinYang} nature makes you more ${yinYangTrait}.`);
console.log(`  With ${formatted.elementBalance.dominant} as your dominant element, you have strong ${formatted.elementBalance.dominant?.toLowerCase()} energy.`);
console.log(`  Your ${formatted.zodiac.animal} zodiac suggests ${formatted.zodiac.element?.toLowerCase()} qualities in your personality.\n`);

console.log('✅ 테스트 완료!');
