'use strict';

/**
 * 5학년 2학기 카탈로그
 *
 * 현재 구현 단원:
 *   1단원 수의 범위와 어림하기
 *   2단원 분수의 곱셈
 *   4단원 소수의 곱셈
 *   분수 총연습 (분모 같은 분수 덧셈·뺄셈 유형 섞기 + 5-1 분모 다른 분수 + 5-2 분수의 곱셈)
 *   곱셈과 나눗셈 총연습 (두 자리×두 자리 원리 6종·세로셈, 세 자리÷한 자리, 세 자리÷두 자리 세로셈)
 * 미구현: 3단원 합동과 대칭, 5단원 직육면체, 6단원 평균과 가능성
 */

import { defineUnit, 차시, 학습지, ext, unitRef } from '../catalog.js';
import { T } from '../templates.js';

import {
  genG52U1IneqGE, genG52U1IneqLE, genG52U1IneqGT, genG52U1IneqLT,
  genG52U1RangeGELE,
  genG52U1RoundUp, genG52U1RoundDown, genG52U1RoundHalf, genG52U1RoundMix,
} from '../generators/g5-2/u1.js';

import {
  genG52U2FracTimesInt, genG52U2MixedTimesInt,
  genG52U2IntTimesFrac, genG52U2IntTimesMixed,
  genG52U2UnitFracTimesUnitFrac,
  genG52U2FracTimesFrac, genG52U2MixedTimesMixed,
  genG52U2FracTimesIntStep, genG52U2MixedTimesIntStep,
  genG52U2IntTimesFracStep, genG52U2IntTimesMixedStep,
  genG52U2UnitFracTimesUnitFracStep,
  genG52U2FracTimesFracStep, genG52U2MixedTimesMixedStep,
  genG52U2UnitFracTimesUnitFracModel,
  genG52U2FracTimesFracModel, genG52U2MixedTimesMixedModel,
} from '../generators/g5-2/u2.js';

import {
  genG52U4DecimalTimesInt, genG52U4IntTimesDecimal,
  genG52U4DecimalTimesIntMixedPlaces, genG52U4IntTimesDecimalMixedPlaces,
  genG52U4DecimalTimesDecimalMixedPlaces, genG52U4DecimalTimes10,
  genG52U4PointShift, genG52U4ProductToDecimal,
} from '../generators/g5-2/u4.js';

import {
  genG52ReviewSameAdd13, genG52ReviewSameAdd24, genG52ReviewSameAddAll,
  genG52ReviewSameSub13, genG52ReviewSameSub24, genG52ReviewSameSubAll,
} from '../generators/g5-2/fracReview.js';

import {
  genG52CalcMul2d2d, genG52CalcDiv3d1d, genG52CalcDiv3d2d,
  PDF_GENERATORS_CALC_REVIEW,
} from '../generators/g5-2/calcReview.js';

import { entries as g51Entries } from './g5-1.js';
import { mul2d2dPrincipleSheets } from './g3-2.js';

const GRADE_ID = 'g5-2';

/* ── 1단원 수의 범위와 어림하기 ── */

const u1 = defineUnit(GRADE_ID, 'u1', '수의 범위와 어림하기', [
  차시('1차시 이상과 이하 알아보기', { grid: 'concept', count: 8 }, [
    학습지('이상인 수 찾기', genG52U1IneqGE, { id: 'u1_main_ineq_ge' }),
    학습지('이하인 수 찾기', genG52U1IneqLE, { id: 'u1_main_ineq_le' }),
  ]),
  차시('2차시 초과와 미만 알아보기', { grid: 'concept', count: 8 }, [
    학습지('초과인 수 찾기', genG52U1IneqGT, { id: 'u1_main_ineq_gt' }),
    학습지('미만인 수 찾기', genG52U1IneqLT, { id: 'u1_main_ineq_lt' }),
  ]),
  차시('3차시 수의 범위', { grid: 'concept', count: 8 }, [
    학습지('이상과 이하의 범위', genG52U1RangeGELE, { id: 'u1_main_range_gele' }),
  ]),
  차시('4차시 올림', { grid: 'standard', count: 20 }, [
    학습지('올림', genG52U1RoundUp, { id: 'u1_main_round_up' }),
  ]),
  차시('5차시 버림', { grid: 'standard', count: 20 }, [
    학습지('버림', genG52U1RoundDown, { id: 'u1_main_round_down' }),
  ]),
  차시('6차시 반올림', { grid: 'standard', count: 20 }, [
    학습지('반올림', genG52U1RoundHalf, { id: 'u1_main_round_half' }),
  ]),
  차시('4~6차시 어림 혼합', { grid: 'standard', count: 20 }, [
    학습지('어림 혼합 (올림·버림·반올림)', genG52U1RoundMix, { id: 'u1_main_round_mix' }),
  ]),
]);

/* ── 2단원 분수의 곱셈 ── */

const FRAC_MUL_PREREQS = [unitRef('g5-1', 'u5'), unitRef('g3-2', 'u1')];
const FRAC_MUL_STEP_LAYOUT = { grid: 'wide', count: 6 };

const u2 = defineUnit(GRADE_ID, 'u2', '분수의 곱셈', [
  차시('1차시 (진분수) × (자연수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(진분수) × (자연수)', genG52U2FracTimesInt, {
      id: 'u2_main_frac_times_int',
      prereqs: FRAC_MUL_PREREQS,
    }),
    학습지('(진분수) × (자연수) 계산 과정', T.fracMulStep, genG52U2FracTimesIntStep, {
      id: 'u2_main_frac_times_int_step', layout: 'oneCol',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
  ]),
  차시('2차시 (대분수) × (자연수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(대분수) × (자연수)', genG52U2MixedTimesInt, {
      id: 'u2_main_mixed_times_int',
      prereqs: FRAC_MUL_PREREQS,
    }),
    학습지('(대분수) × (자연수) 계산 과정 1 (가분수로 바꾸기)', T.fracMulStep, genG52U2MixedTimesIntStep, {
      id: 'u2_main_mixed_times_int_step', layout: 'twoColAtNormalFont',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
    학습지('(대분수) × (자연수) 계산 과정 2 (자연수·분수 따로)', T.mixedMulSeparateStep, genG52U2MixedTimesIntStep, {
      id: 'u2_main_mixed_times_int_separate', layout: 'mixedSeparate',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
  ]),
  차시('3차시 (자연수) × (진분수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(자연수) × (진분수)', genG52U2IntTimesFrac, {
      id: 'u2_main_int_times_frac',
      prereqs: FRAC_MUL_PREREQS,
    }),
    학습지('(자연수) × (진분수) 계산 과정', T.fracMulStep, genG52U2IntTimesFracStep, {
      id: 'u2_main_int_times_frac_step', layout: 'oneCol',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
  ]),
  차시('4차시 (자연수) × (대분수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(자연수) × (대분수)', genG52U2IntTimesMixed, {
      id: 'u2_main_int_times_mixed',
      prereqs: FRAC_MUL_PREREQS,
    }),
    학습지('(자연수) × (대분수) 계산 과정 1 (가분수로 바꾸기)', T.fracMulStep, genG52U2IntTimesMixedStep, {
      id: 'u2_main_int_times_mixed_step', layout: 'twoColAtNormalFont',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
    학습지('(자연수) × (대분수) 계산 과정 2 (자연수·분수 따로)', T.mixedMulSeparateStep, genG52U2IntTimesMixedStep, {
      id: 'u2_main_int_times_mixed_separate', layout: 'mixedSeparate',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
  ]),
  차시('5차시 (단위분수) × (단위분수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(단위분수) × (단위분수)', genG52U2UnitFracTimesUnitFrac, {
      id: 'u2_main_unit_times_unit',
      prereqs: FRAC_MUL_PREREQS,
    }),
    학습지('(단위분수) × (단위분수) 계산 과정', T.fracMulStep, genG52U2UnitFracTimesUnitFracStep, {
      id: 'u2_main_unit_times_unit_step', layout: 'oneCol',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
    학습지('(단위분수) × (단위분수) 그림으로 알아보기', T.fracAreaModel, genG52U2UnitFracTimesUnitFracModel, {
      id: 'u2_main_unit_times_unit_model',
      prereqs: FRAC_MUL_PREREQS,
      grid: 'wide', count: 6,
    }),
  ]),
  차시('6차시 (진분수) × (진분수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(진분수) × (진분수)', genG52U2FracTimesFrac, {
      id: 'u2_main_frac_times_frac',
      prereqs: FRAC_MUL_PREREQS,
    }),
    학습지('(진분수) × (진분수) 계산 과정', T.fracMulStep, genG52U2FracTimesFracStep, {
      id: 'u2_main_frac_times_frac_step', layout: 'oneCol',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
    학습지('(진분수) × (진분수) 그림으로 알아보기', T.fracAreaModel, genG52U2FracTimesFracModel, {
      id: 'u2_main_frac_times_frac_model',
      prereqs: FRAC_MUL_PREREQS,
      grid: 'wide', count: 6,
    }),
  ]),
  차시('7차시 (대분수) × (대분수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(대분수) × (대분수)', genG52U2MixedTimesMixed, {
      id: 'u2_main_mixed_times_mixed', layout: 'fracTwoCol',
      prereqs: FRAC_MUL_PREREQS,
    }),
    학습지('(대분수) × (대분수) 계산 과정', T.fracMulStep, genG52U2MixedTimesMixedStep, {
      id: 'u2_main_mixed_times_mixed_step', layout: 'oneCol',
      prereqs: FRAC_MUL_PREREQS,
      ...FRAC_MUL_STEP_LAYOUT,
    }),
    학습지('(대분수) × (대분수) 그림으로 알아보기 (가분수로 바꾸기)', T.mixedAreaModel, genG52U2MixedTimesMixedModel, {
      id: 'u2_main_mixed_times_mixed_model',
      prereqs: FRAC_MUL_PREREQS,
      grid: 'wide', count: 4,
    }),
  ]),
]);

/* ── 4단원 소수의 곱셈 ── */

const DECIMAL_MUL_GRID_LAYOUT = { grid: 'wide', count: 8 };
const DECIMAL_MUL_FRAC_STEP_LAYOUT = { grid: 'wide', count: 6 };
const DECIMAL_MUL_NATURAL_STEP_LAYOUT = { grid: 'wide', count: 6 };
const DECIMAL_MUL_PREREQS = [unitRef('g4-2', 'u3')];

const u4 = defineUnit(GRADE_ID, 'u4', '소수의 곱셈', [
  차시('1차시 (소수) × (자연수)', { grid: 'practice', count: 15 }, [
    학습지('(소수) × (자연수) 계산 과정 1 (분수로)', T.decimalFracStep, genG52U4DecimalTimesIntMixedPlaces, {
      id: 'u4_main_decimal_times_int_frac_step', layout: 'oneCol',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_FRAC_STEP_LAYOUT,
    }),
    학습지('(소수) × (자연수) 계산 과정 2 (자연수로)', T.decimalNaturalStep, genG52U4DecimalTimesIntMixedPlaces, {
      id: 'u4_main_decimal_times_int_natural_step',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_NATURAL_STEP_LAYOUT,
    }),
    학습지('(소수) × (자연수) 계산 과정 3 (가로셈)', T.decimalNaturalHorizontal, genG52U4DecimalTimesIntMixedPlaces, {
      id: 'u4_main_decimal_times_int_natural_horizontal',
      prereqs: DECIMAL_MUL_PREREQS,
    }),
    학습지('(소수) × (자연수) 세로셈', T.decimalVertical, genG52U4DecimalTimesInt, {
      id: 'u4_main_decimal_times_int',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_GRID_LAYOUT,
    }),
    학습지('(소수) × (자연수) 가로셈', T.decimalHorizontal, genG52U4DecimalTimesInt, {
      id: 'u4_main_decimal_times_int_horizontal',
      prereqs: DECIMAL_MUL_PREREQS,
    }),
  ]),
  차시('2차시 (자연수) × (소수)', { grid: 'practice', count: 15 }, [
    학습지('(자연수) × (소수) 계산 과정 1 (분수로)', T.decimalFracStep, genG52U4IntTimesDecimalMixedPlaces, {
      id: 'u4_main_int_times_decimal_frac_step', layout: 'oneCol',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_FRAC_STEP_LAYOUT,
    }),
    학습지('(자연수) × (소수) 계산 과정 2 (자연수로)', T.decimalNaturalStep, genG52U4IntTimesDecimalMixedPlaces, {
      id: 'u4_main_int_times_decimal_natural_step',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_NATURAL_STEP_LAYOUT,
    }),
    학습지('(자연수) × (소수) 계산 과정 3 (가로셈)', T.decimalNaturalHorizontal, genG52U4IntTimesDecimalMixedPlaces, {
      id: 'u4_main_int_times_decimal_natural_horizontal',
      prereqs: DECIMAL_MUL_PREREQS,
    }),
    학습지('(자연수) × (소수) 세로셈', T.decimalVertical, genG52U4IntTimesDecimal, {
      id: 'u4_main_int_times_decimal',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_GRID_LAYOUT,
    }),
    학습지('(자연수) × (소수) 가로셈', T.decimalHorizontal, genG52U4IntTimesDecimal, {
      id: 'u4_main_int_times_decimal_horizontal',
      prereqs: DECIMAL_MUL_PREREQS,
    }),
  ]),
  차시('3차시 (소수) × (소수)', { grid: 'practice', count: 15 }, [
    학습지('(소수) × (소수) 계산 과정 1 (분수로)', T.decimalFracStep, genG52U4DecimalTimesDecimalMixedPlaces, {
      id: 'u4_main_decimal_times_decimal_frac_step', layout: 'oneCol',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_FRAC_STEP_LAYOUT,
    }),
    학습지('(소수) × (소수) 계산 과정 2 (자연수로)', T.decimalNaturalStep, genG52U4DecimalTimesDecimalMixedPlaces, {
      id: 'u4_main_decimal_times_decimal_natural_step',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_NATURAL_STEP_LAYOUT,
    }),
    학습지('(소수) × (소수) 세로셈', T.decimalVertical, genG52U4DecimalTimesDecimalMixedPlaces, {
      id: 'u4_main_decimal_times_decimal',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_GRID_LAYOUT,
    }),
    학습지('(소수) × (소수) 가로셈', T.decimalHorizontal, genG52U4DecimalTimesDecimalMixedPlaces, {
      id: 'u4_main_decimal_times_decimal_horizontal',
      prereqs: DECIMAL_MUL_PREREQS,
    }),
  ]),
  차시('4차시 소수에 10, 100 곱하기', { grid: 'standard', count: 20 }, [
    학습지('소수 × 10, 100', T.decimalVertical, genG52U4DecimalTimes10, {
      id: 'u4_main_decimal_times_10_100',
      prereqs: DECIMAL_MUL_PREREQS,
      ...DECIMAL_MUL_GRID_LAYOUT,
    }),
  ]),
  // [6수01-13] 곱의 소수점 위치
  차시('곱의 소수점 위치', { grid: 'practice', count: 15 }, [
    학습지('곱의 소수점 위치 (× 1000, × 0.1, × 0.01, × 0.001)', genG52U4PointShift, {
      id: 'u4_main_point_shift',
      prereqs: DECIMAL_MUL_PREREQS,
    }),
    학습지('자연수의 곱을 이용한 소수의 곱셈', genG52U4ProductToDecimal, {
      id: 'u4_main_product_to_decimal',
      prereqs: DECIMAL_MUL_PREREQS,
    }),
  ]),
]);

/* ── 분수 총연습 ──
   1) 분모 같은 분수: 덧셈·뺄셈 각각 유형 1·3 반반 / 유형 2·4 반반 / 유형 1~4 모두 섞기
   2) 분모 다른 분수: 5-1 5단원 본단원 학습지를 그대로 가져옴
   3) 분수의 곱셈: 5-2 2단원 본단원 학습지를 그대로 가져옴
   (원본 학습지를 고치면 총연습에도 자동 반영된다.) */

const REVIEW_UNIT_ID = 'frac_review';
const REVIEW_FRAC_CONTROLS = { controls: { fractionDifficulty: { stages: [1, 2, 3] } } };

const reviewSame = defineUnit(GRADE_ID, REVIEW_UNIT_ID, '분수 총연습', [
  차시('분모가 같은 분수의 덧셈', REVIEW_FRAC_CONTROLS, [
    학습지('분모 같은 분수의 덧셈: 진분수끼리 (합이 1 이상·미만 섞기)', T.sameFracMixed, genG52ReviewSameAdd13, { id: 'frac_review_same_add_13', layout: { countMultiple: 2 } }),
    학습지('분모 같은 분수의 덧셈: 대분수끼리 (받아올림 있음·없음 섞기)', T.sameFracMixed, genG52ReviewSameAdd24, { id: 'frac_review_same_add_24', layout: { preset: 'oneColRows', rows: 6, countMultiple: 2 } }),
    학습지('분모 같은 분수의 덧셈: 모두 섞기', T.sameFracMixed, genG52ReviewSameAddAll, { id: 'frac_review_same_add_all', layout: { preset: 'oneColRows', rows: 8 } }),
  ]),
  차시('분모가 같은 분수의 뺄셈', REVIEW_FRAC_CONTROLS, [
    학습지('분모 같은 분수의 뺄셈: 받아내림 있음 ((자연수)−(진분수), (대분수)−(대분수))', T.sameFracMixed, genG52ReviewSameSub13, { id: 'frac_review_same_sub_13', layout: { preset: 'oneColRows', rows: 6, countMultiple: 2 } }),
    학습지('분모 같은 분수의 뺄셈: 받아내림 없음 ((진분수)−(진분수), (대분수)−(대분수))', T.sameFracMixed, genG52ReviewSameSub24, { id: 'frac_review_same_sub_24', layout: { countMultiple: 2 } }),
    학습지('분모 같은 분수의 뺄셈: 모두 섞기', T.sameFracMixed, genG52ReviewSameSubAll, { id: 'frac_review_same_sub_all', layout: { preset: 'oneColRows', rows: 8 } }),
  ]),
]);

/**
 * 다른 단원의 본단원 학습지를 총연습 단원으로 복제.
 * generator·grid·count·controls 는 원본 그대로, id·단원·라벨만 바꾼다.
 */
function cloneForReview(sourceEntries, lessonRef, relabel = (label) => label) {
  return sourceEntries
    .filter((entry) => entry.section === '본단원')
    .map((entry) => {
      const sourceLocalId = entry.id.slice(entry.grade.length + 1);
      return {
        ...entry,
        id: `${GRADE_ID}_${REVIEW_UNIT_ID}_${sourceLocalId}`,
        layoutId: sourceLocalId, // layout.js 의 학습지별 배치(1열·2열 등)를 원본과 똑같이
        grade: GRADE_ID,
        unit: REVIEW_UNIT_ID,
        label: relabel(entry.label),
        lessonRef,
        prereqs: null,
        from: null,
      };
    });
}

// 5-1 대분수 학습지 라벨엔 '분모 다른'이 없어서 총연습 목록에서 구분되도록 앞에 붙인다.
// ('받아올림 대분수 덧셈 (…)' → '분모 다른 대분수 덧셈 - 받아올림 (…)', 뺄셈 라벨과 같은 꼴로)
function withDiffDenom(label) {
  if (label.startsWith('분모 다른')) return label;
  const carry = label.match(/^받아올림 대분수 덧셈 (.+)$/);
  return carry ? `분모 다른 대분수 덧셈 - 받아올림 ${carry[1]}` : `분모 다른 ${label}`;
}

const reviewDiff = cloneForReview(
  g51Entries.filter((entry) => entry.unit === 'u5'),
  '분모가 다른 분수의 덧셈과 뺄셈',
  withDiffDenom,
);
const reviewMul = cloneForReview(u2, '분수의 곱셈');

const fracReview = [...reviewSame, ...reviewDiff, ...reviewMul];

/* ── 곱셈과 나눗셈 총연습 (세로셈 격자, pdfMap 으로 렌더러 연결) ── */

const calcReview = defineUnit(GRADE_ID, 'calc_review', '곱셈과 나눗셈', [
  // 세로셈 전에 원리부터 (3-2 1단원과 같은 학습지 — 자릿값 분해·넓이 그림·부분곱 두 줄·오답 고치기·문장틀)
  차시('두 자리 × 두 자리 곱셈의 원리', mul2d2dPrincipleSheets('calc_review')),
  차시('곱셈', { kind: 'pdf' }, [
    학습지('두 자리 수 × 두 자리 수 (세로셈)', genG52CalcMul2d2d, { id: 'calc_review_mul_2d2d', grid: 'standard', count: 12 }),
  ]),
  차시('나눗셈', { kind: 'pdf', grid: 'divgrid', count: 8 }, [
    학습지('세 자리 수 ÷ 한 자리 수 (나머지 있음·없음 섞기)', genG52CalcDiv3d1d, { id: 'calc_review_div_3d1d', count: 6 }),
    학습지('세 자리 수 ÷ 두 자리 수 (나머지 있음·없음 섞기)', genG52CalcDiv3d2d, { id: 'calc_review_div_3d2d' }),
  ]),
]);

/* ── 학기 메타 ── */

export const meta = {
  id: GRADE_ID,
  short: '5-2',
  name: '5학년 2학기',
  units: {
    u1: { short: '1단원', name: '수의 범위와 어림하기' },
    u2: { short: '2단원', name: '분수의 곱셈' },
    u4: { short: '4단원', name: '소수의 곱셈' },
    frac_review: { short: '총연습', name: '분수 총연습' },
    calc_review: { short: '총연습', name: '곱셈과 나눗셈' },
  },
};

export const entries = [...u1, ...u2, ...u4, ...fracReview, ...calcReview];

export const pdfMap = {
  'g5-2_calc_review_mul_2d2d': 'mul_2d2d_full',
  'g5-2_calc_review_div_3d1d': 'div_3d1d_mixrem',
  'g5-2_calc_review_div_3d2d': 'div_3d2d_mixrem',
};
export const pdfGenerators = { ...PDF_GENERATORS_CALC_REVIEW };
