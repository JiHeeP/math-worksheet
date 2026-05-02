'use strict';

/**
 * 5학년 2학기 카탈로그
 *
 * 현재 구현 단원:
 *   1단원 수의 범위와 어림하기
 *   2단원 분수의 곱셈
 * 미구현: 3단원 합동과 대칭, 4단원 소수의 곱셈, 5단원 직육면체, 6단원 평균과 가능성
 */

import { defineUnit, 차시, 학습지, ext, unitRef } from '../catalog.js';

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
} from '../generators/g5-2/u2.js';

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

const u2 = defineUnit(GRADE_ID, 'u2', '분수의 곱셈', [
  차시('1차시 (진분수) × (자연수)', { grid: 'practice', count: 15 }, [
    학습지('(진분수) × (자연수)', genG52U2FracTimesInt, {
      id: 'u2_main_frac_times_int',
      prereqs: [unitRef('g5-1', 'u4')],
    }),
  ]),
  차시('2차시 (대분수) × (자연수)', { grid: 'practice', count: 15 }, [
    학습지('(대분수) × (자연수)', genG52U2MixedTimesInt, {
      id: 'u2_main_mixed_times_int',
      prereqs: [unitRef('g5-1', 'u5'), unitRef('g4-2', 'u1')],
    }),
  ]),
  차시('3차시 (자연수) × (진분수)', { grid: 'practice', count: 15 }, [
    학습지('(자연수) × (진분수)', genG52U2IntTimesFrac, { id: 'u2_main_int_times_frac' }),
  ]),
  차시('4차시 (자연수) × (대분수)', { grid: 'practice', count: 15 }, [
    학습지('(자연수) × (대분수)', genG52U2IntTimesMixed, { id: 'u2_main_int_times_mixed' }),
  ]),
  차시('5차시 (단위분수) × (단위분수)', { grid: 'practice', count: 15 }, [
    학습지('(단위분수) × (단위분수)', genG52U2UnitFracTimesUnitFrac, { id: 'u2_main_unit_times_unit' }),
  ]),
  차시('6차시 (진분수) × (진분수)', { grid: 'practice', count: 15 }, [
    학습지('(진분수) × (진분수)', genG52U2FracTimesFrac, { id: 'u2_main_frac_times_frac' }),
  ]),
  차시('7차시 (대분수) × (대분수)', { grid: 'practice', count: 15 }, [
    학습지('(대분수) × (대분수)', genG52U2MixedTimesMixed, { id: 'u2_main_mixed_times_mixed' }),
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
  },
};

export const entries = [...u1, ...u2];

export const pdfMap = {};
export const pdfGenerators = {};
