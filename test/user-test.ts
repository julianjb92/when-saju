import { calculateSaju, formatSajuForEnglish, FIVE_ELEMENTS } from '../src/saju-calculator';

// 사용자 생년월일: 1992년 12월 12일 오전 11시 22분
const saju = calculateSaju(1992, 12, 12, 11);

console.log('🔮 사주팔자 분석: 1992년 12월 12일 11시');
console.log('==========================================\n');

console.log('📊 Four Pillars (사주):');
console.log(`  년주: ${saju.yearPillar.stem.korean}${saju.yearPillar.branch.korean} (${saju.yearPillar.stem.elementEn} ${saju.yearPillar.branch.animalEn})`);
console.log(`  월주: ${saju.monthPillar.stem.korean}${saju.monthPillar.branch.korean} (${saju.monthPillar.stem.elementEn} ${saju.monthPillar.branch.animalEn})`);
console.log(`  일주: ${saju.dayPillar.stem.korean}${saju.dayPillar.branch.korean} (${saju.dayPillar.stem.elementEn} ${saju.dayPillar.branch.animalEn})`);
console.log(`  시주: ${saju.hourPillar?.stem.korean}${saju.hourPillar?.branch.korean} (${saju.hourPillar?.stem.elementEn} ${saju.hourPillar?.branch.animalEn})\n`);

console.log('🎯 Day Master (일간):');
console.log(`  ${saju.dayMaster.korean} (${saju.dayMaster.yin ? 'Yin' : 'Yang'} ${saju.dayMaster.elementEn})\n`);

console.log('🐲 Zodiac (띠):');
console.log(`  ${saju.zodiac.animal} (${saju.zodiac.animalEn})\n`);

console.log('⚖️ Element Balance (오행 분포):');
const elements = ['목', '화', '토', '금', '수'] as const;
const elementEn = { '목': 'Wood', '화': 'Fire', '토': 'Earth', '금': 'Metal', '수': 'Water' };
let total = 0;
elements.forEach(el => total += saju.elementCount[el]);

elements.forEach(el => {
  const count = saju.elementCount[el];
  const percent = Math.round((count / total) * 100);
  const bar = '█'.repeat(count) + '░'.repeat(Math.max(0, 4 - count));
  console.log(`  ${elementEn[el].padEnd(6)} ${bar} ${count}개 (${percent}%)`);
});

console.log(`\n  → 가장 강한 오행: ${FIVE_ELEMENTS[saju.dominantElement as keyof typeof FIVE_ELEMENTS].english} (${saju.elementCount[saju.dominantElement]}개)`);
console.log(`  → 가장 약한 오행: ${FIVE_ELEMENTS[saju.weakestElement as keyof typeof FIVE_ELEMENTS].english} (${saju.elementCount[saju.weakestElement]}개)\n`);

console.log('☯️ Yin-Yang Balance:');
console.log(`  음(Yin): ${saju.yinYangBalance.yin}, 양(Yang): ${saju.yinYangBalance.yang}\n`);

// 퍼센트로 변환
console.log('📈 Element Percentages (for email):');
const totalCount = Object.values(saju.elementCount).reduce((a, b) => a + b, 0);
console.log(`  Wood: ${Math.round((saju.elementCount['목'] / totalCount) * 100)}%`);
console.log(`  Fire: ${Math.round((saju.elementCount['화'] / totalCount) * 100)}%`);
console.log(`  Earth: ${Math.round((saju.elementCount['토'] / totalCount) * 100)}%`);
console.log(`  Metal: ${Math.round((saju.elementCount['금'] / totalCount) * 100)}%`);
console.log(`  Water: ${Math.round((saju.elementCount['수'] / totalCount) * 100)}%`);
