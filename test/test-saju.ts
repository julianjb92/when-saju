/**
 * 사주 계산 테스트
 */

import { calculateSaju, formatSajuForEnglish } from '../src/saju-calculator';

// 테스트 케이스들
const testCases = [
  {
    name: '테스트 1: 1990년 1월 15일 오전 10시',
    input: { year: 1990, month: 1, day: 15, hour: 10 },
  },
  {
    name: '테스트 2: 1985년 7월 23일 (시간 모름)',
    input: { year: 1985, month: 7, day: 23 },
  },
  {
    name: '테스트 3: 2000년 12월 31일 자정',
    input: { year: 2000, month: 12, day: 31, hour: 0 },
  },
  {
    name: '테스트 4: 1995년 3월 8일 오후 3시',
    input: { year: 1995, month: 3, day: 8, hour: 15 },
  },
];

console.log('====================================');
console.log('WHEN 사주팔자 계산 테스트');
console.log('====================================\n');

for (const testCase of testCases) {
  console.log(`📌 ${testCase.name}`);
  console.log(`   입력: ${testCase.input.year}년 ${testCase.input.month}월 ${testCase.input.day}일 ${testCase.input.hour !== undefined ? testCase.input.hour + '시' : '(시간 없음)'}`);
  
  const result = calculateSaju(
    testCase.input.year,
    testCase.input.month,
    testCase.input.day,
    testCase.input.hour
  );
  
  const formatted = formatSajuForEnglish(result);
  
  console.log('\n   사주 (Four Pillars):');
  console.log(`   - 년주: ${result.yearPillar.stem.korean}${result.yearPillar.branch.korean} (${result.yearPillar.stem.elementEn} ${result.yearPillar.branch.animalEn})`);
  console.log(`   - 월주: ${result.monthPillar.stem.korean}${result.monthPillar.branch.korean} (${result.monthPillar.stem.elementEn} ${result.monthPillar.branch.animalEn})`);
  console.log(`   - 일주: ${result.dayPillar.stem.korean}${result.dayPillar.branch.korean} (${result.dayPillar.stem.elementEn} ${result.dayPillar.branch.animalEn})`);
  if (result.hourPillar) {
    console.log(`   - 시주: ${result.hourPillar.stem.korean}${result.hourPillar.branch.korean} (${result.hourPillar.stem.elementEn} ${result.hourPillar.branch.animalEn})`);
  }
  
  console.log('\n   일간 (Day Master):');
  console.log(`   - ${result.dayMaster.korean} (${result.dayMaster.yin ? 'Yin' : 'Yang'} ${result.dayMaster.elementEn})`);
  
  console.log('\n   띠 (Zodiac):');
  console.log(`   - ${result.zodiac.animal} (${result.zodiac.animalEn})`);
  
  console.log('\n   오행 분포 (Five Elements):');
  console.log(`   - 목(Wood): ${result.elementCount['목']}`);
  console.log(`   - 화(Fire): ${result.elementCount['화']}`);
  console.log(`   - 토(Earth): ${result.elementCount['토']}`);
  console.log(`   - 금(Metal): ${result.elementCount['금']}`);
  console.log(`   - 수(Water): ${result.elementCount['수']}`);
  console.log(`   - 가장 강한 오행: ${result.dominantElement}`);
  console.log(`   - 가장 약한 오행: ${result.weakestElement}`);
  
  console.log('\n   음양 균형 (Yin-Yang):');
  console.log(`   - 음(Yin): ${result.yinYangBalance.yin}, 양(Yang): ${result.yinYangBalance.yang}`);
  
  console.log('\n------------------------------------\n');
}

console.log('✅ 테스트 완료!');
