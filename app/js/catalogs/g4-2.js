'use strict';

/**
 * 4학년 2학기 카탈로그
 *
 * 현재는 1단원 (분수의 덧셈과 뺄셈) 만 구현. 나머지 단원은 추후 추가.
 */

import { defineUnit, 차시, 학습지, ext, sheetRef } from '../catalog.js';
import { T } from '../templates.js';

import {
  genG42U1AddLt1, genG42U1AddGe1, genG42U1Sub,
  genG42U11MinusFrac, genG42U1IntMinusFrac,
  genG42U1MixedAddNoCarry, genG42U1MixedAddCarry,
  genG42U1MixedSubNoBorrow, genG42U1IntMinusMixed, genG42U1MixedSubBorrow,
} from '../generators/g4-2/u1.js';

const GRADE_ID = 'g4-2';

/* ── 단원 정의 ── */

const u1 = defineUnit(GRADE_ID, 'u1', '분수의 덧셈과 뺄셈', [
  차시('1차시 (진분수)+(진분수), 합이 1 미만', { grid: 'practice', count: 15 }, [
    학습지('분모 같은 진분수의 덧셈 (합이 1 미만)', genG42U1AddLt1, {
      id: 'u1_main_add',
      prereqs: [ext('[3-2] 분수')],
    }),
  ]),
  차시('2차시 (진분수)+(진분수), 합이 1 이상 (받아올림)', [
    학습지('분모 같은 진분수의 덧셈 (합이 1 이상)', T.sameFracAddGe1Step, genG42U1AddGe1, {
      id: 'u1_main_add_ge1',
      prereqs: [sheetRef('u1_main_add')],
    }),
  ]),
  차시('3차시 (진분수)-(진분수)', { grid: 'practice', count: 15 }, [
    학습지('분모 같은 진분수의 뺄셈', genG42U1Sub, {
      id: 'u1_main_sub',
      prereqs: [sheetRef('u1_main_add')],
    }),
  ]),
  차시('4차시 1 − (진분수) (받아내림)', [
    학습지('1 − (진분수)', T.oneMinusFracStep, genG42U11MinusFrac, {
      id: 'u1_main_one_minus_frac',
      prereqs: [sheetRef('u1_main_sub')],
    }),
  ]),
  차시('5차시 (자연수) − (진분수) (받아내림)', [
    학습지('(자연수) − (진분수)', T.intMinusFracStep, genG42U1IntMinusFrac, {
      id: 'u1_main_int_minus_frac',
      prereqs: [sheetRef('u1_main_one_minus_frac')],
    }),
  ]),
  차시('6차시 분모 같은 (대분수)+(대분수), 받아올림 없음', { grid: 'practice', count: 15 }, [
    학습지('대분수의 덧셈 (받아올림 없음)', genG42U1MixedAddNoCarry, {
      id: 'u1_main_mixed_add',
      prereqs: [sheetRef('u1_main_add')],
    }),
  ]),
  차시('7차시 분모 같은 (대분수)+(대분수), 받아올림 있음', [
    학습지('대분수의 덧셈 (받아올림 있음)', T.sameMixedAddCarryStep, genG42U1MixedAddCarry, {
      id: 'u1_main_mixed_add_carry',
      prereqs: [sheetRef('u1_main_mixed_add')],
    }),
  ]),
  차시('8차시 분모 같은 (대분수)-(대분수), 받아내림 없음', { grid: 'practice', count: 15 }, [
    학습지('대분수의 뺄셈 (받아내림 없음)', genG42U1MixedSubNoBorrow, {
      id: 'u1_main_mixed_sub',
      prereqs: [sheetRef('u1_main_sub')],
    }),
  ]),
  차시('9차시 (자연수) − (대분수) (받아내림)', [
    학습지('(자연수) − (대분수)', T.intMinusMixedStep, genG42U1IntMinusMixed, {
      id: 'u1_main_int_minus_mixed',
      prereqs: [sheetRef('u1_main_mixed_sub'), sheetRef('u1_main_int_minus_frac')],
    }),
  ]),
  차시('10차시 분모 같은 (대분수)-(대분수), 받아내림 있음', [
    학습지('대분수의 뺄셈 (받아내림 있음)', T.sameMixedSubBorrowStep, genG42U1MixedSubBorrow, {
      id: 'u1_main_mixed_sub_borrow',
      prereqs: [sheetRef('u1_main_int_minus_mixed')],
    }),
  ]),
]);

/* ── 학기 메타 ── */

export const meta = {
  id: GRADE_ID,
  short: '4-2',
  name: '4학년 2학기',
  units: {
    u1: { short: '1단원', name: '분수의 덧셈과 뺄셈' },
  },
};

export const entries = [...u1];

/* ── PDF 매핑 (없음) ── */

export const pdfMap = {};
export const pdfGenerators = {};
