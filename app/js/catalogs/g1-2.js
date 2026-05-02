'use strict';

/**
 * 1학년 2학기 카탈로그
 *
 * 현재 구현 단원:
 *   4단원 덧셈과 뺄셈(2) — 받아올림·내림 없음
 *   6단원 덧셈과 뺄셈(3) — 10이 되는 더하기
 *   7단원 덧셈과 뺄셈(4) — 받아올림·내림 있음
 *   8단원 □가 사용된 식
 *
 * 미구현: 1단원 100까지의 수, 2단원 여러 가지 모양, 3단원 모양과 시각, 5단원 규칙찾기
 */

import { defineUnit, 차시, 학습지, sheetRef } from '../catalog.js';

import {
  genG12U4Add2d1d, genG12U4Add2d2d, genG12U4Sub2d1d, genG12U4Sub2d2d,
} from '../generators/g1-2/u4.js';

import {
  genG12U6MakeTenAdd, genG12U6MakeTenSub,
} from '../generators/g1-2/u6.js';

import {
  genG12U71d1dCarry, genG12U7TeenBorrow, genG12U72d1dCarry,
} from '../generators/g1-2/u7.js';

import {
  genG12U8BoxAdd, genG12U8BoxSub,
} from '../generators/g1-2/u8.js';

const GRADE_ID = 'g1-2';

/* ── 4단원 덧셈과 뺄셈(2) — 받아올림·내림 없음 ── */

const u4 = defineUnit(GRADE_ID, 'u4', '덧셈과 뺄셈(2)', [
  차시('1차시 (두 자리) ± (한 자리), 받아올림·내림 없음', { grid: 'standard', count: 20 }, [
    학습지('(두 자리) + (한 자리)', genG12U4Add2d1d, { id: 'u4_main_add_2d1d' }),
    학습지('(두 자리) − (한 자리)', genG12U4Sub2d1d, { id: 'u4_main_sub_2d1d' }),
  ]),
  차시('2차시 (두 자리) ± (두 자리), 받아올림·내림 없음', { grid: 'standard', count: 20 }, [
    학습지('(두 자리) + (두 자리)', genG12U4Add2d2d, { id: 'u4_main_add_2d2d' }),
    학습지('(두 자리) − (두 자리)', genG12U4Sub2d2d, { id: 'u4_main_sub_2d2d' }),
  ]),
]);

/* ── 6단원 덧셈과 뺄셈(3) — 10이 되는 더하기 ── */

const u6 = defineUnit(GRADE_ID, 'u6', '덧셈과 뺄셈(3)', [
  차시('1차시 10이 되는 더하기', { grid: 'standard', count: 20 }, [
    학습지('10이 되는 더하기 (□ 위치 무작위)', genG12U6MakeTenAdd, { id: 'u6_main_make_ten_add' }),
  ]),
  차시('2차시 10에서 빼기', { grid: 'standard', count: 20 }, [
    학습지('10에서 빼기 (□ 위치 무작위)', genG12U6MakeTenSub, { id: 'u6_main_make_ten_sub' }),
  ]),
]);

/* ── 7단원 덧셈과 뺄셈(4) — 받아올림·내림 ── */

const u7 = defineUnit(GRADE_ID, 'u7', '덧셈과 뺄셈(4)', [
  차시('1차시 (한 자리) + (한 자리), 받아올림', { grid: 'standard', count: 20 }, [
    학습지('(한 자리) + (한 자리), 받아올림', genG12U71d1dCarry, {
      id: 'u7_main_1d1d_carry',
      prereqs: [sheetRef('u6_main_make_ten_add')],
    }),
  ]),
  차시('2차시 (십몇) − (몇), 받아내림', { grid: 'standard', count: 20 }, [
    학습지('(십몇) − (몇), 받아내림', genG12U7TeenBorrow, {
      id: 'u7_main_teen_borrow',
      prereqs: [sheetRef('u6_main_make_ten_sub')],
    }),
  ]),
  차시('3차시 (두 자리) + (한 자리), 받아올림', { grid: 'standard', count: 20 }, [
    학습지('(두 자리) + (한 자리), 받아올림', genG12U72d1dCarry, {
      id: 'u7_main_2d1d_carry',
      prereqs: [sheetRef('u7_main_1d1d_carry')],
    }),
  ]),
]);

/* ── 8단원 □가 사용된 식 ── */

const u8 = defineUnit(GRADE_ID, 'u8', '□가 사용된 식', [
  차시('1차시 □가 들어간 덧셈', { grid: 'standard', count: 20 }, [
    학습지('□가 들어간 덧셈', genG12U8BoxAdd, { id: 'u8_main_box_add' }),
  ]),
  차시('2차시 □가 들어간 뺄셈', { grid: 'standard', count: 20 }, [
    학습지('□가 들어간 뺄셈', genG12U8BoxSub, { id: 'u8_main_box_sub' }),
  ]),
]);

/* ── 학기 메타 ── */

export const meta = {
  id: GRADE_ID,
  short: '1-2',
  name: '1학년 2학기',
  units: {
    u4: { short: '4단원', name: '덧셈과 뺄셈(2)' },
    u6: { short: '6단원', name: '덧셈과 뺄셈(3)' },
    u7: { short: '7단원', name: '덧셈과 뺄셈(4)' },
    u8: { short: '8단원', name: '□가 사용된 식' },
  },
};

export const entries = [...u4, ...u6, ...u7, ...u8];

export const pdfMap = {};
export const pdfGenerators = {};
