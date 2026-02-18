import { calculateSaju } from '@fullstackfamily/manseryeok';

// 사용자 생년월일: 1992년 12월 12일 11시 22분
const saju = calculateSaju(1992, 12, 12, 11, 22);

console.log('🔮 만세력 라이브러리 테스트');
console.log('입력: 1992년 12월 12일 11:22\n');

console.log('=== 사주팔자 ===');
console.log(`년주: ${saju.yearPillar} (${saju.yearPillarHanja})`);
console.log(`월주: ${saju.monthPillar} (${saju.monthPillarHanja})`);
console.log(`일주: ${saju.dayPillar} (${saju.dayPillarHanja})`);
console.log(`시주: ${saju.hourPillar} (${saju.hourPillarHanja})`);

if (saju.isTimeCorrected) {
  console.log(`\n시간 보정: ${saju.correctedTime!.hour}시 ${saju.correctedTime!.minute}분 (진태양시)`);
}

// 정답과 비교
console.log('\n=== 정답 비교 ===');
console.log('정답: 임신년 임자월 임술일 을사시');
console.log(`결과: ${saju.yearPillar}년 ${saju.monthPillar}월 ${saju.dayPillar}일 ${saju.hourPillar}시`);

const correct = saju.yearPillar === '임신' && 
                saju.monthPillar === '임자' && 
                saju.dayPillar === '임술' && 
                saju.hourPillar === '을사';

console.log(`\n✅ 정확도: ${correct ? '완벽!' : '불일치 - 확인 필요'}`);
