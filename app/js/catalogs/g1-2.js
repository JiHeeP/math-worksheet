'use strict';

/**
 * 1학년 2학기 카탈로그
 *
 * 현재 구현 단원:
 *   1단원 100까지의 수
 *   2단원 덧셈과 뺄셈(1) — 받아올림·내림 없음
 *   4단원 덧셈과 뺄셈(2) — 10이 되는 더하기
 *   6단원 덧셈과 뺄셈(3) — 받아올림·내림 있음
 *
 * 미구현: 3단원 여러가지 모양, 5단원 시계보기와 규칙 찾기
 */

import { defineUnit, 차시, 학습지, sheetRef } from '../catalog.js';
import { T } from '../templates.js';

import {
  genG12U1CountTo100, genG12U1TensOnes, genG12U1BeforeAfter, genG12U1CompareTo100,
} from '../generators/g1-2/u1.js';

import {
  genG12U4Add2d1d, genG12U4Add2d2d, genG12U4Sub2d1d, genG12U4Sub2d2d,
} from '../generators/g1-2/u4.js';

import {
  genG12U6MakeTenAdd, genG12U6MakeTenSub, genG12U6MakeTenOriginal,
} from '../generators/g1-2/u6.js';

import {
  genG12U71d1dCarry, genG12U71d1dCarryHorizPractice, genG12U71d1dCarryPractice,
  genG12U71d1dCarryHoriz, genG12U71d1dCarryVertical,
  genG12U7TeenBorrow, genG12U7TeenBorrowHorizPractice, genG12U7TeenBorrowPractice,
  genG12U7TeenBorrowHoriz, genG12U7TeenBorrowVertical,
  genG12U72d1dCarry, genG12U72d1dCarryHorizPractice, genG12U72d1dCarryPractice,
  genG12U72d1dCarryVertical, genG12U7CarryBorrowMix,
} from '../generators/g1-2/u7.js';

const GRADE_ID = 'g1-2';

/* ── 1단원 100까지의 수 ── */

const u1 = defineUnit(GRADE_ID, 'u1', '100까지의 수', [
  차시('1차시 100까지의 수 세기', { grid: 'concept', count: 8 }, [
    학습지('100까지의 수 세기', genG12U1CountTo100, { id: 'u1_main_count_to_100' }),
    학습지('십과 낱개로 나타내기', genG12U1TensOnes, { id: 'u1_main_tens_ones' }),
  ]),
  차시('2차시 수의 순서와 크기', { grid: 'standard', count: 20 }, [
    학습지('100까지의 수 앞뒤', genG12U1BeforeAfter, { id: 'u1_main_before_after' }),
    학습지('100까지의 수 크기 비교', genG12U1CompareTo100, { id: 'u1_main_compare_to_100' }),
  ]),
]);

/* ── 2단원 덧셈과 뺄셈(1) — 받아올림·내림 없음 ── */

const u4 = defineUnit(GRADE_ID, 'u4', '덧셈과 뺄셈(1)', [
  차시('1차시 (두 자리) ± (한 자리), 받아올림·내림 없음', { grid: 'standard', count: 20 }, [
    학습지('(두 자리) + (한 자리)', genG12U4Add2d1d, { id: 'u4_main_add_2d1d' }),
    학습지('(두 자리) − (한 자리)', genG12U4Sub2d1d, { id: 'u4_main_sub_2d1d' }),
  ]),
  차시('2차시 (두 자리) ± (두 자리), 받아올림·내림 없음', { grid: 'standard', count: 20 }, [
    학습지('(두 자리) + (두 자리)', genG12U4Add2d2d, { id: 'u4_main_add_2d2d', controls: { numberDifficulty: { stages: [1, 2] } } }),
    학습지('(두 자리) − (두 자리)', genG12U4Sub2d2d, { id: 'u4_main_sub_2d2d', controls: { numberDifficulty: { stages: [1, 2] } } }),
  ]),
]);

/* ── 4단원 덧셈과 뺄셈(2) — 10이 되는 더하기 ── */

const u6 = defineUnit(GRADE_ID, 'u6', '덧셈과 뺄셈(2)', [
  차시('1~2차시 10의 보수 원본형', { grid: 'dense', count: 36 }, [
    학습지('10의 보수 (가로셈 빈칸)', genG12U6MakeTenOriginal, { id: 'u6_main_make_ten_original' }),
  ]),
  차시('1차시 10이 되는 더하기', { grid: 'standard', count: 20 }, [
    학습지('10이 되는 더하기 (□ 위치 무작위)', genG12U6MakeTenAdd, { id: 'u6_main_make_ten_add' }),
  ]),
  차시('2차시 10에서 빼기', { grid: 'standard', count: 20 }, [
    학습지('10에서 빼기 (□ 위치 무작위)', genG12U6MakeTenSub, { id: 'u6_main_make_ten_sub' }),
  ]),
]);

/* ── 6단원 덧셈과 뺄셈(3) — 받아올림·내림 ── */

const u7 = defineUnit(GRADE_ID, 'u7', '덧셈과 뺄셈(3)', [
  차시('1차시 (한 자리) + (한 자리), 받아올림 - 원본 연습형', { grid: 'practice', count: 15 }, [
    학습지('한 자리 수 + 한 자리 수(받아올림) - 가로 연습', genG12U71d1dCarryHorizPractice, { id: 'u7_main_1d1d_carry_horiz_prac' }),
    학습지('한 자리 수 + 한 자리 수(받아올림) - 연습', genG12U71d1dCarryPractice, { id: 'u7_main_1d1d_carry_prac' }),
  ]),
  차시('1차시 (한 자리) + (한 자리), 받아올림 - 원본 일반형', [
    학습지('한 자리 수 + 한 자리 수(받아올림) - 가로', genG12U71d1dCarryHoriz, { id: 'u7_main_1d1d_carry_horiz', grid: 'dense', count: 36 }),
    학습지('한 자리 수 + 한 자리 수(받아올림)', genG12U71d1dCarryVertical, { id: 'u7_main_1d1d_carry_vertical', grid: 'standard', count: 20 }),
  ]),
  차시('1차시 (한 자리) + (한 자리), 받아올림 (가르기 풀이)', [
    학습지('(한 자리) + (한 자리), 받아올림', T.makeTenAddStep, genG12U71d1dCarry, {
      id: 'u7_main_1d1d_carry',
      prereqs: [sheetRef('u6_main_make_ten_add')],
    }),
  ]),
  차시('2차시 (십몇) − (몇), 받아내림 - 원본 연습형', { grid: 'practice', count: 15 }, [
    학습지('십몇 - 몇(받아내림) - 가로 연습', genG12U7TeenBorrowHorizPractice, { id: 'u7_main_teen_borrow_horiz_prac' }),
    학습지('십몇 - 몇(받아내림) - 연습', genG12U7TeenBorrowPractice, { id: 'u7_main_teen_borrow_prac' }),
  ]),
  차시('2차시 (십몇) − (몇), 받아내림 - 원본 일반형', [
    학습지('십몇 - 몇(받아내림) - 가로', genG12U7TeenBorrowHoriz, { id: 'u7_main_teen_borrow_horiz', grid: 'dense', count: 36 }),
    학습지('십몇 - 몇(받아내림)', genG12U7TeenBorrowVertical, { id: 'u7_main_teen_borrow_vertical', grid: 'standard', count: 20 }),
  ]),
  차시('2차시 (십몇) − (몇), 받아내림 (가르기 풀이)', [
    학습지('(십몇) − (몇), 받아내림', T.teenBorrowStep, genG12U7TeenBorrow, {
      id: 'u7_main_teen_borrow',
      prereqs: [sheetRef('u6_main_make_ten_sub')],
    }),
  ]),
  차시('2~3차시 받아올림·받아내림 혼합', { grid: 'standard', count: 20 }, [
    학습지('한 자리 수 + 한 자리 수(받아올림), 십몇 - 몇(받아내림) 혼합', genG12U7CarryBorrowMix, {
      id: 'u7_main_mix_1d_2d',
      prereqs: [sheetRef('u7_main_1d1d_carry'), sheetRef('u7_main_teen_borrow')],
    }),
  ]),
  차시('3차시 (두 자리) + (한 자리), 받아올림 - 원본 연습형', { grid: 'practice', count: 15 }, [
    학습지('두 자리 수 + 한 자리 수(받아올림) - 가로 연습', genG12U72d1dCarryHorizPractice, { id: 'u7_main_2d1d_carry_horiz_prac' }),
    학습지('두 자리 수 + 한 자리 수(받아올림) - 연습', genG12U72d1dCarryPractice, { id: 'u7_main_2d1d_carry_prac' }),
  ]),
  차시('3차시 (두 자리) + (한 자리), 받아올림 - 원본 일반형', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 + 한 자리 수(받아올림)', genG12U72d1dCarryVertical, { id: 'u7_main_2d1d_carry_vertical' }),
  ]),
  차시('3차시 (두 자리) + (한 자리), 받아올림 (가르기 풀이)', [
    학습지('(두 자리) + (한 자리), 받아올림', T.twoDigitOneDigitCarryStep, genG12U72d1dCarry, {
      id: 'u7_main_2d1d_carry',
      prereqs: [sheetRef('u7_main_1d1d_carry')],
    }),
  ]),
]);

/* ── 학기 메타 ── */

export const meta = {
  id: GRADE_ID,
  short: '1-2',
  name: '1학년 2학기',
  units: {
    u1: { short: '1단원', name: '100까지의 수' },
    u4: { short: '2단원', name: '덧셈과 뺄셈(1)' },
    u6: { short: '4단원', name: '덧셈과 뺄셈(2)' },
    u7: { short: '6단원', name: '덧셈과 뺄셈(3)' },
  },
};

export const entries = [...u1, ...u4, ...u6, ...u7];

export const pdfMap = {};
export const pdfGenerators = {};
