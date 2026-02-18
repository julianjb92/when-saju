import { calculateSaju, formatSajuForEnglish, FIVE_ELEMENTS } from '../src/saju-calculator';

// 테스트: 1992년 7월 15일 오후 2시
const saju = calculateSaju(1992, 7, 15, 14);

console.log('🔮 WHEN 사주 분석');
console.log('==================\n');
console.log('입력: 1992년 7월 15일 14시\n');

console.log('📊 Four Pillars (사주팔자):');
console.log(`  년주: ${saju.yearPillar.stem.korean}${saju.yearPillar.branch.korean} → ${saju.yearPillar.stem.elementEn} ${saju.yearPillar.branch.animalEn}`);
console.log(`  월주: ${saju.monthPillar.stem.korean}${saju.monthPillar.branch.korean} → ${saju.monthPillar.stem.elementEn} ${saju.monthPillar.branch.animalEn}`);
console.log(`  일주: ${saju.dayPillar.stem.korean}${saju.dayPillar.branch.korean} → ${saju.dayPillar.stem.elementEn} ${saju.dayPillar.branch.animalEn}`);
console.log(`  시주: ${saju.hourPillar?.stem.korean}${saju.hourPillar?.branch.korean} → ${saju.hourPillar?.stem.elementEn} ${saju.hourPillar?.branch.animalEn}\n`);

console.log('🎯 Day Master (일간 - 본인의 핵심 에너지):');
console.log(`  ${saju.dayMaster.korean} (${saju.dayMaster.yin ? 'Yin' : 'Yang'} ${saju.dayMaster.elementEn})\n`);

console.log('🐲 Zodiac (띠):');
console.log(`  ${saju.zodiac.animal} (${saju.zodiac.animalEn})\n`);

console.log('⚖️ Element Balance (오행 분포):');
const elements = ['목', '화', '토', '금', '수'] as const;
elements.forEach(el => {
  const bar = '█'.repeat(saju.elementCount[el]) + '░'.repeat(4 - saju.elementCount[el]);
  const eng = FIVE_ELEMENTS[el].english;
  console.log(`  ${eng.padEnd(6)} ${bar} ${saju.elementCount[el]}`);
});
console.log(`  → 강한 오행: ${FIVE_ELEMENTS[saju.dominantElement as keyof typeof FIVE_ELEMENTS].english}`);
console.log(`  → 약한 오행: ${FIVE_ELEMENTS[saju.weakestElement as keyof typeof FIVE_ELEMENTS].english}\n`);

console.log('☯️ Yin-Yang Balance:');
console.log(`  Yin: ${saju.yinYangBalance.yin}, Yang: ${saju.yinYangBalance.yang}\n`);

// FREE Reading 미리보기 (AI 없이 간단 버전)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📖 FREE READING PREVIEW (AI 미적용 버전)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const dayMasterDesc: Record<string, { trait: string; phase: string }> = {
  'Metal': { 
    trait: 'precise, refined, and determined. Like polished metal, you value quality, structure, and clarity.',
    phase: 'a period of refinement and consolidation'
  },
  'Wood': {
    trait: 'growth-oriented, flexible, and creative. Like a tree, you naturally reach toward new possibilities.',
    phase: 'a period of expansion and new beginnings'
  },
  'Fire': {
    trait: 'passionate, expressive, and charismatic. You naturally light up spaces and inspire others.',
    phase: 'a period of visibility and self-expression'
  },
  'Earth': {
    trait: 'stable, nurturing, and reliable. You provide grounding energy to those around you.',
    phase: 'a period of stability and building foundations'
  },
  'Water': {
    trait: 'intuitive, adaptable, and wise. You flow around obstacles rather than fighting them.',
    phase: 'a period of reflection and inner wisdom'
  },
};

const element = saju.dayMaster.elementEn;
const yinYang = saju.dayMaster.yin ? 'Yin' : 'Yang';

console.log(`## Your Current Phase: ${dayMasterDesc[element].phase.charAt(0).toUpperCase() + dayMasterDesc[element].phase.slice(1)}\n`);
console.log(`You're currently in ${dayMasterDesc[element].phase}. This is a time to embrace your natural ${element.toLowerCase()} energy.\n`);

console.log(`## Your Core Energy: ${yinYang} ${element}\n`);
console.log(`As a ${yinYang} ${element} person, you are naturally ${dayMasterDesc[element].trait}\n`);
console.log(`Your ${yinYang.toLowerCase()} nature means you tend to be more ${yinYang === 'Yin' ? 'introspective, receptive, and subtle' : 'outgoing, active, and direct'} in how you express this energy.\n`);

console.log(`## Your Element Balance\n`);
console.log(`With ${FIVE_ELEMENTS[saju.dominantElement as keyof typeof FIVE_ELEMENTS].english} as your strongest element (${saju.elementCount[saju.dominantElement]} of 8), you have abundant ${saju.dominantElement === '금' ? 'Metal' : saju.dominantElement === '목' ? 'Wood' : saju.dominantElement === '화' ? 'Fire' : saju.dominantElement === '토' ? 'Earth' : 'Water'} energy to draw from.\n`);
console.log(`Your ${FIVE_ELEMENTS[saju.weakestElement as keyof typeof FIVE_ELEMENTS].english} element (${saju.elementCount[saju.weakestElement]} of 8) is an area for growth and balance.\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔒 Unlock your Full Timing Map for $19.99');
console.log('   8 life categories · Personalized insights');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
