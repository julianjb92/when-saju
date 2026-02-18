# Lovable 프롬프트 1: 사주 계산 라이브러리 추가

아래 내용을 Lovable 채팅창에 붙여넣으세요:

---

Create a new file `src/lib/saju-calculator.ts` with the Korean Four Pillars (Saju) calculation logic:

```typescript
/**
 * WHEN - Korean Saju (Four Pillars) Calculator
 */

export const HEAVENLY_STEMS = [
  { korean: '갑', chinese: '甲', element: '목', elementEn: 'Wood', yin: false, index: 0 },
  { korean: '을', chinese: '乙', element: '목', elementEn: 'Wood', yin: true, index: 1 },
  { korean: '병', chinese: '丙', element: '화', elementEn: 'Fire', yin: false, index: 2 },
  { korean: '정', chinese: '丁', element: '화', elementEn: 'Fire', yin: true, index: 3 },
  { korean: '무', chinese: '戊', element: '토', elementEn: 'Earth', yin: false, index: 4 },
  { korean: '기', chinese: '己', element: '토', elementEn: 'Earth', yin: true, index: 5 },
  { korean: '경', chinese: '庚', element: '금', elementEn: 'Metal', yin: false, index: 6 },
  { korean: '신', chinese: '辛', element: '금', elementEn: 'Metal', yin: true, index: 7 },
  { korean: '임', chinese: '壬', element: '수', elementEn: 'Water', yin: false, index: 8 },
  { korean: '계', chinese: '癸', element: '수', elementEn: 'Water', yin: true, index: 9 },
];

export const EARTHLY_BRANCHES = [
  { korean: '자', chinese: '子', element: '수', elementEn: 'Water', animal: '쥐', animalEn: 'Rat', index: 0 },
  { korean: '축', chinese: '丑', element: '토', elementEn: 'Earth', animal: '소', animalEn: 'Ox', index: 1 },
  { korean: '인', chinese: '寅', element: '목', elementEn: 'Wood', animal: '호랑이', animalEn: 'Tiger', index: 2 },
  { korean: '묘', chinese: '卯', element: '목', elementEn: 'Wood', animal: '토끼', animalEn: 'Rabbit', index: 3 },
  { korean: '진', chinese: '辰', element: '토', elementEn: 'Earth', animal: '용', animalEn: 'Dragon', index: 4 },
  { korean: '사', chinese: '巳', element: '화', elementEn: 'Fire', animal: '뱀', animalEn: 'Snake', index: 5 },
  { korean: '오', chinese: '午', element: '화', elementEn: 'Fire', animal: '말', animalEn: 'Horse', index: 6 },
  { korean: '미', chinese: '未', element: '토', elementEn: 'Earth', animal: '양', animalEn: 'Goat', index: 7 },
  { korean: '신', chinese: '申', element: '금', elementEn: 'Metal', animal: '원숭이', animalEn: 'Monkey', index: 8 },
  { korean: '유', chinese: '酉', element: '금', elementEn: 'Metal', animal: '닭', animalEn: 'Rooster', index: 9 },
  { korean: '술', chinese: '戌', element: '토', elementEn: 'Earth', animal: '개', animalEn: 'Dog', index: 10 },
  { korean: '해', chinese: '亥', element: '수', elementEn: 'Water', animal: '돼지', animalEn: 'Pig', index: 11 },
];

export const FIVE_ELEMENTS = {
  목: { korean: '목', chinese: '木', english: 'Wood', color: 'green', season: 'spring' },
  화: { korean: '화', chinese: '火', english: 'Fire', color: 'red', season: 'summer' },
  토: { korean: '토', chinese: '土', english: 'Earth', color: 'yellow', season: 'between seasons' },
  금: { korean: '금', chinese: '金', english: 'Metal', color: 'white', season: 'autumn' },
  수: { korean: '수', chinese: '水', english: 'Water', color: 'black', season: 'winter' },
};

export interface SajuResult {
  yearPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] };
  monthPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] };
  dayPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] };
  hourPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] } | null;
  dayMaster: typeof HEAVENLY_STEMS[0];
  zodiac: typeof EARTHLY_BRANCHES[0];
  elementCount: { [key: string]: number };
  dominantElement: string;
  weakestElement: string;
  yinYangBalance: { yin: number; yang: number };
}

function calculateYearPillar(year: number, month: number, day: number) {
  let adjustedYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    adjustedYear = year - 1;
  }
  const stemIndex = (adjustedYear - 4) % 10;
  const branchIndex = (adjustedYear - 4) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

function calculateMonthPillar(year: number, month: number, day: number, yearStemIndex: number) {
  let monthBranchIndex: number;
  if (month === 1 && day < 6) monthBranchIndex = 1;
  else if (month === 1) monthBranchIndex = 1;
  else if (month === 2 && day < 4) monthBranchIndex = 1;
  else if (month === 2) monthBranchIndex = 2;
  else monthBranchIndex = (month + 1) % 12;
  
  const monthStemStart = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemStart = monthStemStart[yearStemIndex];
  const monthStemIndex = (stemStart + monthBranchIndex - 2 + 10) % 10;
  return {
    stem: HEAVENLY_STEMS[monthStemIndex],
    branch: EARTHLY_BRANCHES[monthBranchIndex],
  };
}

function calculateDayPillar(year: number, month: number, day: number) {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const stemIndex = (0 + diffDays) % 10;
  const branchIndex = (4 + diffDays) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

function calculateHourPillar(hour: number, dayStemIndex: number) {
  let hourBranchIndex: number;
  if (hour >= 23 || hour < 1) hourBranchIndex = 0;
  else hourBranchIndex = Math.floor((hour + 1) / 2);
  
  const hourStemStart = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const stemStart = hourStemStart[dayStemIndex];
  const hourStemIndex = (stemStart + hourBranchIndex) % 10;
  return {
    stem: HEAVENLY_STEMS[hourStemIndex],
    branch: EARTHLY_BRANCHES[hourBranchIndex],
  };
}

export function calculateSaju(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour?: number
): SajuResult {
  const yearPillar = calculateYearPillar(birthYear, birthMonth, birthDay);
  const monthPillar = calculateMonthPillar(birthYear, birthMonth, birthDay, yearPillar.stem.index);
  const dayPillar = calculateDayPillar(birthYear, birthMonth, birthDay);
  const hourPillar = birthHour !== undefined ? calculateHourPillar(birthHour, dayPillar.stem.index) : null;

  const result: SajuResult = {
    yearPillar, monthPillar, dayPillar, hourPillar,
    dayMaster: dayPillar.stem,
    zodiac: yearPillar.branch,
    elementCount: { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 },
    dominantElement: '',
    weakestElement: '',
    yinYangBalance: { yin: 0, yang: 0 },
  };

  // Count elements
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    if (pillar) {
      result.elementCount[pillar.stem.element]++;
      result.elementCount[pillar.branch.element]++;
    }
  });

  // Find dominant/weakest
  let dominant = '목', weakest = '목';
  for (const el of Object.keys(result.elementCount)) {
    if (result.elementCount[el] > result.elementCount[dominant]) dominant = el;
    if (result.elementCount[el] < result.elementCount[weakest]) weakest = el;
  }
  result.dominantElement = dominant;
  result.weakestElement = weakest;

  // Yin-Yang balance
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    if (pillar) {
      if (pillar.stem.yin) result.yinYangBalance.yin++;
      else result.yinYangBalance.yang++;
    }
  });

  return result;
}

export function formatSajuForEnglish(saju: SajuResult) {
  return {
    fourPillars: {
      year: `${saju.yearPillar.stem.elementEn} ${saju.yearPillar.branch.animalEn}`,
      month: `${saju.monthPillar.stem.elementEn} ${saju.monthPillar.branch.animalEn}`,
      day: `${saju.dayPillar.stem.elementEn} ${saju.dayPillar.branch.animalEn}`,
      hour: saju.hourPillar ? `${saju.hourPillar.stem.elementEn} ${saju.hourPillar.branch.animalEn}` : null,
    },
    dayMaster: {
      element: saju.dayMaster.elementEn,
      yinYang: saju.dayMaster.yin ? 'Yin' : 'Yang',
      description: `${saju.dayMaster.yin ? 'Yin' : 'Yang'} ${saju.dayMaster.elementEn}`,
    },
    zodiac: { animal: saju.zodiac.animalEn, element: saju.zodiac.elementEn },
    elementBalance: {
      Wood: saju.elementCount['목'],
      Fire: saju.elementCount['화'],
      Earth: saju.elementCount['토'],
      Metal: saju.elementCount['금'],
      Water: saju.elementCount['수'],
      dominant: FIVE_ELEMENTS[saju.dominantElement as keyof typeof FIVE_ELEMENTS]?.english,
      weakest: FIVE_ELEMENTS[saju.weakestElement as keyof typeof FIVE_ELEMENTS]?.english,
    },
    yinYangBalance: saju.yinYangBalance,
  };
}
```
