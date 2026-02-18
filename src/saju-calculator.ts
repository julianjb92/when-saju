/**
 * WHEN - Korean Saju (Four Pillars) Calculator
 * 한국식 사주팔자 계산 라이브러리
 */

// 천간 (Heavenly Stems) - 10개
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

// 지지 (Earthly Branches) - 12개
export const EARTHLY_BRANCHES = [
  { korean: '자', chinese: '子', element: '수', elementEn: 'Water', animal: '쥐', animalEn: 'Rat', hours: '23:00-01:00', index: 0 },
  { korean: '축', chinese: '丑', element: '토', elementEn: 'Earth', animal: '소', animalEn: 'Ox', hours: '01:00-03:00', index: 1 },
  { korean: '인', chinese: '寅', element: '목', elementEn: 'Wood', animal: '호랑이', animalEn: 'Tiger', hours: '03:00-05:00', index: 2 },
  { korean: '묘', chinese: '卯', element: '목', elementEn: 'Wood', animal: '토끼', animalEn: 'Rabbit', hours: '05:00-07:00', index: 3 },
  { korean: '진', chinese: '辰', element: '토', elementEn: 'Earth', animal: '용', animalEn: 'Dragon', hours: '07:00-09:00', index: 4 },
  { korean: '사', chinese: '巳', element: '화', elementEn: 'Fire', animal: '뱀', animalEn: 'Snake', hours: '09:00-11:00', index: 5 },
  { korean: '오', chinese: '午', element: '화', elementEn: 'Fire', animal: '말', animalEn: 'Horse', hours: '11:00-13:00', index: 6 },
  { korean: '미', chinese: '未', element: '토', elementEn: 'Earth', animal: '양', animalEn: 'Goat', hours: '13:00-15:00', index: 7 },
  { korean: '신', chinese: '申', element: '금', elementEn: 'Metal', animal: '원숭이', animalEn: 'Monkey', hours: '15:00-17:00', index: 8 },
  { korean: '유', chinese: '酉', element: '금', elementEn: 'Metal', animal: '닭', animalEn: 'Rooster', hours: '17:00-19:00', index: 9 },
  { korean: '술', chinese: '戌', element: '토', elementEn: 'Earth', animal: '개', animalEn: 'Dog', hours: '19:00-21:00', index: 10 },
  { korean: '해', chinese: '亥', element: '수', elementEn: 'Water', animal: '돼지', animalEn: 'Pig', hours: '21:00-23:00', index: 11 },
];

// 오행 (Five Elements)
export const FIVE_ELEMENTS = {
  목: { korean: '목', chinese: '木', english: 'Wood', color: 'green', season: 'spring', direction: 'east' },
  화: { korean: '화', chinese: '火', english: 'Fire', color: 'red', season: 'summer', direction: 'south' },
  토: { korean: '토', chinese: '土', english: 'Earth', color: 'yellow', season: 'between seasons', direction: 'center' },
  금: { korean: '금', chinese: '金', english: 'Metal', color: 'white', season: 'autumn', direction: 'west' },
  수: { korean: '수', chinese: '水', english: 'Water', color: 'black', season: 'winter', direction: 'north' },
};

// 십신 (Ten Gods) relationships
export const TEN_GODS = {
  비견: { korean: '비견', english: 'Companion', meaning: 'Same element, same polarity - peers, siblings' },
  겁재: { korean: '겁재', english: 'Rob Wealth', meaning: 'Same element, different polarity - competition' },
  식신: { korean: '식신', english: 'Eating God', meaning: 'Element I produce, same polarity - creativity' },
  상관: { korean: '상관', english: 'Hurting Officer', meaning: 'Element I produce, different polarity - rebellion' },
  편재: { korean: '편재', english: 'Indirect Wealth', meaning: 'Element I control, same polarity - unexpected gains' },
  정재: { korean: '정재', english: 'Direct Wealth', meaning: 'Element I control, different polarity - stable income' },
  편관: { korean: '편관', english: 'Seven Killings', meaning: 'Element controlling me, same polarity - pressure' },
  정관: { korean: '정관', english: 'Direct Officer', meaning: 'Element controlling me, different polarity - authority' },
  편인: { korean: '편인', english: 'Indirect Seal', meaning: 'Element producing me, same polarity - unconventional wisdom' },
  정인: { korean: '정인', english: 'Direct Seal', meaning: 'Element producing me, different polarity - traditional support' },
};

// 대운 주기 (Major Luck Cycles) - 10 year periods
export interface MajorCycle {
  startAge: number;
  endAge: number;
  stem: typeof HEAVENLY_STEMS[0];
  branch: typeof EARTHLY_BRANCHES[0];
  theme: string;
}

// 사주 결과 타입
export interface SajuResult {
  // 사주 (Four Pillars)
  yearPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] };
  monthPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] };
  dayPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] };
  hourPillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] } | null;
  
  // 일간 (Day Master) - 가장 중요한 요소
  dayMaster: typeof HEAVENLY_STEMS[0];
  
  // 오행 분포
  elementCount: { [key: string]: number };
  dominantElement: string;
  weakestElement: string;
  
  // 음양 균형
  yinYangBalance: { yin: number; yang: number };
  
  // 띠 (Zodiac)
  zodiac: typeof EARTHLY_BRANCHES[0];
  
  // 현재 대운 (Current Major Cycle)
  currentCycle?: MajorCycle;
  
  // 올해 운세 기본 정보
  currentYearEnergy: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] };
}

/**
 * 년주 계산 (Year Pillar)
 * 입춘(2월 4일경)을 기준으로 년이 바뀜
 */
function calculateYearPillar(year: number, month: number, day: number) {
  // 입춘 전이면 전년도 사용
  let adjustedYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    adjustedYear = year - 1;
  }
  
  // 천간: (년도 - 4) % 10
  const stemIndex = (adjustedYear - 4) % 10;
  // 지지: (년도 - 4) % 12
  const branchIndex = (adjustedYear - 4) % 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

/**
 * 월주 계산 (Month Pillar)
 * 절기를 기준으로 월이 바뀜 (간략화 버전)
 */
function calculateMonthPillar(year: number, month: number, day: number, yearStemIndex: number) {
  // 절기 기준 월 (간략화)
  const solarTerms = [
    { month: 2, day: 4 },   // 입춘 - 인월 시작
    { month: 3, day: 6 },   // 경칩 - 묘월 시작
    { month: 4, day: 5 },   // 청명 - 진월 시작
    { month: 5, day: 6 },   // 입하 - 사월 시작
    { month: 6, day: 6 },   // 망종 - 오월 시작
    { month: 7, day: 7 },   // 소서 - 미월 시작
    { month: 8, day: 8 },   // 입추 - 신월 시작
    { month: 9, day: 8 },   // 백로 - 유월 시작
    { month: 10, day: 8 },  // 한로 - 술월 시작
    { month: 11, day: 7 },  // 입동 - 해월 시작
    { month: 12, day: 7 },  // 대설 - 자월 시작
    { month: 1, day: 6 },   // 소한 - 축월 시작
  ];
  
  // 현재 날짜가 어느 절기에 해당하는지 확인
  let monthBranchIndex: number;
  
  if (month === 1 && day < 6) {
    monthBranchIndex = 1; // 축월 (전년도)
  } else if (month === 1) {
    monthBranchIndex = 1; // 축월
  } else if (month === 2 && day < 4) {
    monthBranchIndex = 1; // 축월
  } else if (month === 2) {
    monthBranchIndex = 2; // 인월
  } else {
    // 간략화: 월에서 1을 빼고 2를 더함
    monthBranchIndex = (month + 1) % 12;
  }
  
  // 월간 계산: 년간에 따른 월간 시작점
  // 갑/기년 → 병인월 시작, 을/경년 → 무인월 시작...
  const monthStemStart = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 년간별 인월 천간
  const stemStart = monthStemStart[yearStemIndex];
  const monthStemIndex = (stemStart + monthBranchIndex - 2 + 10) % 10;
  
  return {
    stem: HEAVENLY_STEMS[monthStemIndex],
    branch: EARTHLY_BRANCHES[monthBranchIndex],
  };
}

/**
 * 일주 계산 (Day Pillar)
 * 1900년 1월 1일 = 갑진일 기준으로 계산
 */
function calculateDayPillar(year: number, month: number, day: number) {
  // 1900년 1월 1일은 갑진일 (천간 0, 지지 4)
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 1900년 1월 1일의 간지 = 갑진 (stem: 0, branch: 4)
  const baseStemIndex = 0;
  const baseBranchIndex = 4;
  
  const stemIndex = (baseStemIndex + diffDays) % 10;
  const branchIndex = (baseBranchIndex + diffDays) % 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

/**
 * 시주 계산 (Hour Pillar)
 */
function calculateHourPillar(hour: number, dayStemIndex: number) {
  // 시간 → 지지 변환 (2시간 단위)
  // 23:00-01:00 = 자시(0), 01:00-03:00 = 축시(1), ...
  let hourBranchIndex: number;
  if (hour >= 23 || hour < 1) {
    hourBranchIndex = 0; // 자시
  } else {
    hourBranchIndex = Math.floor((hour + 1) / 2);
  }
  
  // 시간 천간: 일간에 따른 자시 천간 시작점
  // 갑/기일 → 갑자시 시작, 을/경일 → 병자시 시작...
  const hourStemStart = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]; // 일간별 자시 천간
  const stemStart = hourStemStart[dayStemIndex];
  const hourStemIndex = (stemStart + hourBranchIndex) % 10;
  
  return {
    stem: HEAVENLY_STEMS[hourStemIndex],
    branch: EARTHLY_BRANCHES[hourBranchIndex],
  };
}

/**
 * 오행 분포 계산
 */
function calculateElementDistribution(pillars: SajuResult) {
  const count: { [key: string]: number } = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  
  // 년주
  count[pillars.yearPillar.stem.element]++;
  count[pillars.yearPillar.branch.element]++;
  
  // 월주
  count[pillars.monthPillar.stem.element]++;
  count[pillars.monthPillar.branch.element]++;
  
  // 일주
  count[pillars.dayPillar.stem.element]++;
  count[pillars.dayPillar.branch.element]++;
  
  // 시주
  if (pillars.hourPillar) {
    count[pillars.hourPillar.stem.element]++;
    count[pillars.hourPillar.branch.element]++;
  }
  
  // 가장 많은/적은 오행 찾기
  let dominant = '목';
  let weakest = '목';
  for (const element of Object.keys(count)) {
    if (count[element] > count[dominant]) dominant = element;
    if (count[element] < count[weakest]) weakest = element;
  }
  
  return { count, dominant, weakest };
}

/**
 * 음양 균형 계산
 */
function calculateYinYang(pillars: SajuResult) {
  let yin = 0;
  let yang = 0;
  
  const checkPillar = (pillar: { stem: typeof HEAVENLY_STEMS[0]; branch: typeof EARTHLY_BRANCHES[0] }) => {
    if (pillar.stem.yin) yin++; else yang++;
  };
  
  checkPillar(pillars.yearPillar);
  checkPillar(pillars.monthPillar);
  checkPillar(pillars.dayPillar);
  if (pillars.hourPillar) checkPillar(pillars.hourPillar);
  
  return { yin, yang };
}

/**
 * 현재 년도 에너지 계산
 */
function calculateCurrentYearEnergy(currentYear: number) {
  const stemIndex = (currentYear - 4) % 10;
  const branchIndex = (currentYear - 4) % 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

/**
 * 대운 시작 나이 계산 (간략화)
 */
function calculateMajorCycleStartAge(gender: 'male' | 'female', yearStem: typeof HEAVENLY_STEMS[0]): number {
  // 양년(양 천간) 남자, 음년 여자 = 순행
  // 양년 여자, 음년 남자 = 역행
  // 대운 시작 나이는 보통 1-9세 사이
  // 간략화: 평균 3세 시작으로 가정
  return 3;
}

/**
 * 메인 사주 계산 함수
 */
export function calculateSaju(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour?: number,
  gender?: 'male' | 'female'
): SajuResult {
  // 년주 계산
  const yearPillar = calculateYearPillar(birthYear, birthMonth, birthDay);
  
  // 월주 계산
  const monthPillar = calculateMonthPillar(birthYear, birthMonth, birthDay, yearPillar.stem.index);
  
  // 일주 계산
  const dayPillar = calculateDayPillar(birthYear, birthMonth, birthDay);
  
  // 시주 계산 (시간이 있는 경우만)
  const hourPillar = birthHour !== undefined ? calculateHourPillar(birthHour, dayPillar.stem.index) : null;
  
  // 기본 결과 구성
  const result: SajuResult = {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayPillar.stem,
    zodiac: yearPillar.branch,
    elementCount: {},
    dominantElement: '',
    weakestElement: '',
    yinYangBalance: { yin: 0, yang: 0 },
    currentYearEnergy: calculateCurrentYearEnergy(new Date().getFullYear()),
  };
  
  // 오행 분포 계산
  const elements = calculateElementDistribution(result);
  result.elementCount = elements.count;
  result.dominantElement = elements.dominant;
  result.weakestElement = elements.weakest;
  
  // 음양 균형 계산
  result.yinYangBalance = calculateYinYang(result);
  
  return result;
}

/**
 * 사주 결과를 영어로 포맷팅
 */
export function formatSajuForEnglish(saju: SajuResult): object {
  return {
    fourPillars: {
      year: {
        stem: { korean: saju.yearPillar.stem.korean, english: saju.yearPillar.stem.elementEn },
        branch: { korean: saju.yearPillar.branch.korean, english: saju.yearPillar.branch.animalEn },
        combined: `${saju.yearPillar.stem.elementEn} ${saju.yearPillar.branch.animalEn}`,
      },
      month: {
        stem: { korean: saju.monthPillar.stem.korean, english: saju.monthPillar.stem.elementEn },
        branch: { korean: saju.monthPillar.branch.korean, english: saju.monthPillar.branch.animalEn },
        combined: `${saju.monthPillar.stem.elementEn} ${saju.monthPillar.branch.animalEn}`,
      },
      day: {
        stem: { korean: saju.dayPillar.stem.korean, english: saju.dayPillar.stem.elementEn },
        branch: { korean: saju.dayPillar.branch.korean, english: saju.dayPillar.branch.animalEn },
        combined: `${saju.dayPillar.stem.elementEn} ${saju.dayPillar.branch.animalEn}`,
      },
      hour: saju.hourPillar ? {
        stem: { korean: saju.hourPillar.stem.korean, english: saju.hourPillar.stem.elementEn },
        branch: { korean: saju.hourPillar.branch.korean, english: saju.hourPillar.branch.animalEn },
        combined: `${saju.hourPillar.stem.elementEn} ${saju.hourPillar.branch.animalEn}`,
      } : null,
    },
    dayMaster: {
      element: saju.dayMaster.elementEn,
      korean: saju.dayMaster.korean,
      chinese: saju.dayMaster.chinese,
      yinYang: saju.dayMaster.yin ? 'Yin' : 'Yang',
      description: `${saju.dayMaster.yin ? 'Yin' : 'Yang'} ${saju.dayMaster.elementEn}`,
    },
    zodiac: {
      animal: saju.zodiac.animalEn,
      korean: saju.zodiac.animal,
      element: saju.zodiac.elementEn,
    },
    elementBalance: {
      Wood: saju.elementCount['목'] || 0,
      Fire: saju.elementCount['화'] || 0,
      Earth: saju.elementCount['토'] || 0,
      Metal: saju.elementCount['금'] || 0,
      Water: saju.elementCount['수'] || 0,
      dominant: FIVE_ELEMENTS[saju.dominantElement as keyof typeof FIVE_ELEMENTS]?.english || saju.dominantElement,
      weakest: FIVE_ELEMENTS[saju.weakestElement as keyof typeof FIVE_ELEMENTS]?.english || saju.weakestElement,
    },
    yinYangBalance: {
      yin: saju.yinYangBalance.yin,
      yang: saju.yinYangBalance.yang,
      dominant: saju.yinYangBalance.yin > saju.yinYangBalance.yang ? 'Yin' : 'Yang',
    },
    currentYear: {
      year: new Date().getFullYear(),
      energy: `${saju.currentYearEnergy.stem.elementEn} ${saju.currentYearEnergy.branch.animalEn}`,
    },
  };
}

// 테스트용 export
export { calculateYearPillar, calculateMonthPillar, calculateDayPillar, calculateHourPillar };
