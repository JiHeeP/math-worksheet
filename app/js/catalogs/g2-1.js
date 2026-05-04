'use strict';

/**
 * 2학년 1학기 카탈로그
 *
 * 3단원 덧셈과 뺄셈(5):
 *  - 가로셈 (받아올림/내림 단계별 학습) — 자체 generator
 *  - 세로셈 (혼합) — 5-1 선수학습용 PDF generator (add_2d, sub_2d) 재사용
 *    교과서가 2-1에서 두 자리 덧·뺄셈을 세로셈 표준으로 가르침.
 *
 * 미구현 단원: 2단원 여러 가지 도형, 4단원 길이재기, 5단원 분류하기
 */

import { defineUnit, 차시, 학습지, unitRef } from '../catalog.js';

import {
  genG21U1ModelToNumber, genG21U1HundredsTensOnes, genG21U1Expanded, genG21U1BeforeAfter, genG21U1Compare3d,
} from '../generators/g2-1/u1.js';

import {
  genG21U3Add2d2dNoCarry, genG21U3Add2d2dSingle, genG21U3Add2d2dDouble, genG21U3Add2d2dMix,
  genG21U3Add2d2dSinglePractice, genG21U3Add2d2dSingleVertical,
  genG21U3Add2d2dDoubleVertical, genG21U3Add2d2dMixVertical,
  genG21U3Sub2d2dNoBorrow, genG21U3Sub2d2dBorrow, genG21U3Sub2d2dMix,
  genG21U3Sub2d2dBorrowPractice, genG21U3Sub2d2dBorrowPractice2,
  genG21U3Sub2d2dBorrowVertical, genG21U3Sub2d2dMixVertical,
  genG21U3Sub2d1dBorrow, genG21U3Sub2d1dBorrowPractice, genG21U3Sub2d1dBorrowPractice2,
  genG21U3Sub2d1dBorrowVertical,
  genG21U3Mix2dAll,
} from '../generators/g2-1/u3.js';

import {
  genG21U6RepeatedAdd, genG21U6GroupsToMul, genG21U6MulBasic,
} from '../generators/g2-1/u6.js';

// 5-1 선수학습으로 쓰던 두 자리 덧/뺄셈 generator 를 본단원에서도 재사용
import { genU1PreAdd2d, genU1PreSub2d, PDF_GENERATORS_U1 } from '../generators/g5-1/u1.js';

const GRADE_ID = 'g2-1';

const u1 = defineUnit(GRADE_ID, 'u1', '세 자리 수', [
  차시('1차시 세 자리 수의 자릿값', { grid: 'concept', count: 8 }, [
    학습지('모형 보고 세 자리 수 쓰기', genG21U1ModelToNumber, { id: 'u1_main_model_to_number', grid: 'wide', count: 6 }),
    학습지('백·십·일의 자리', genG21U1HundredsTensOnes, { id: 'u1_main_place_value' }),
    학습지('세 자리 수 만들기', genG21U1Expanded, { id: 'u1_main_expanded' }),
  ]),
  차시('2차시 세 자리 수의 순서와 크기', { grid: 'standard', count: 20 }, [
    학습지('세 자리 수 앞뒤', genG21U1BeforeAfter, { id: 'u1_main_before_after' }),
    학습지('세 자리 수 크기 비교', genG21U1Compare3d, { id: 'u1_main_compare' }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '덧셈과 뺄셈(5)', [
  차시('1~2차시 두 자리 덧셈 원본 연습형', { grid: 'practice', count: 15 }, [
    학습지('두 자리 수 + 두 자리 수(받아올림) - 연습', genG21U3Add2d2dSinglePractice, {
      id: 'u3_main_2d2d_carry_prac',
      prereqs: [unitRef('g1-2', 'u7')],
    }),
  ]),
  차시('1차시 (두 자리) + (두 자리), 받아올림 없음', { grid: 'standard', count: 20 }, [
    학습지('두 자리 + 두 자리 (받아올림 없음)', genG21U3Add2d2dNoCarry, {
      id: 'u3_main_add_no_carry',
      prereqs: [unitRef('g1-2', 'u4')],
    }),
  ]),
  차시('2차시 (두 자리) + (두 자리), 받아올림 1회', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 + 두 자리 수(받아올림)', genG21U3Add2d2dSingleVertical, {
      id: 'u3_main_2d2d_carry_vertical',
      prereqs: [unitRef('g1-2', 'u7')],
    }),
    학습지('두 자리 + 두 자리 (받아올림 1회)', genG21U3Add2d2dSingle, {
      id: 'u3_main_add_single',
      prereqs: [unitRef('g1-2', 'u7')],
    }),
  ]),
  차시('3차시 (두 자리) + (두 자리), 받아올림 2회', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 + 두 자리 수(받아올림 2번)', genG21U3Add2d2dDoubleVertical, {
      id: 'u3_main_2d2d_double_carry_vertical',
    }),
    학습지('두 자리 + 두 자리 (받아올림 2회)', genG21U3Add2d2dDouble, {
      id: 'u3_main_add_double',
    }),
  ]),
  차시('4차시 (두 자리) + (두 자리) 혼합', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 + 두 자리 수(혼합)', genG21U3Add2d2dMixVertical, {
      id: 'u3_main_2d2d_add_mix_vertical',
    }),
    학습지('두 자리 + 두 자리 (혼합)', genG21U3Add2d2dMix, {
      id: 'u3_main_add_mix',
    }),
  ]),
  차시('4차시 (두 자리) + (두 자리) 세로셈', { kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 + 두 자리 (세로셈)', genU1PreAdd2d, { id: 'u3_main_add_2d_vertical' }),
  ]),
  차시('5차시 (두 자리) − (한 자리), 받아내림', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 - 한 자리 수(받아내림) - 연습', genG21U3Sub2d1dBorrowPractice, {
      id: 'u3_main_2d1d_borrow_prac',
      grid: 'practice',
      count: 15,
      prereqs: [unitRef('g1-2', 'u7')],
    }),
    학습지('두 자리 수 - 한 자리 수(받아내림) - 연습 2', genG21U3Sub2d1dBorrowPractice2, {
      id: 'u3_main_2d1d_sub_opt2',
      grid: 'practice',
      count: 15,
      prereqs: [unitRef('g1-2', 'u7')],
    }),
    학습지('두 자리 수 - 한 자리 수(받아내림)', genG21U3Sub2d1dBorrowVertical, {
      id: 'u3_main_2d1d_borrow_vertical',
      prereqs: [unitRef('g1-2', 'u7')],
    }),
    학습지('두 자리 − 한 자리 (받아내림)', genG21U3Sub2d1dBorrow, {
      id: 'u3_main_sub_2d1d_borrow',
      prereqs: [unitRef('g1-2', 'u7')],
    }),
  ]),
  차시('6차시 (두 자리) − (두 자리), 받아내림 없음', { grid: 'standard', count: 20 }, [
    학습지('두 자리 − 두 자리 (받아내림 없음)', genG21U3Sub2d2dNoBorrow, {
      id: 'u3_main_sub_no_borrow',
      prereqs: [unitRef('g1-2', 'u4')],
    }),
  ]),
  차시('7차시 (두 자리) − (두 자리), 받아내림 있음', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 - 두 자리 수(받아내림) - 연습', genG21U3Sub2d2dBorrowPractice, {
      id: 'u3_main_2d2d_borrow_prac',
      grid: 'practice',
      count: 15,
    }),
    학습지('두 자리 수 - 두 자리 수(받아내림) - 연습 2', genG21U3Sub2d2dBorrowPractice2, {
      id: 'u3_main_2d2d_sub_opt2',
      grid: 'practice',
      count: 15,
    }),
    학습지('두 자리 수 - 두 자리 수(받아내림)', genG21U3Sub2d2dBorrowVertical, {
      id: 'u3_main_2d2d_borrow_vertical',
    }),
    학습지('두 자리 − 두 자리 (받아내림 있음)', genG21U3Sub2d2dBorrow, {
      id: 'u3_main_sub_borrow',
    }),
  ]),
  차시('8차시 (두 자리) − (두 자리) 혼합', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 - 두 자리 수(혼합)', genG21U3Sub2d2dMixVertical, {
      id: 'u3_main_2d2d_sub_mix_vertical',
    }),
    학습지('두 자리 − 두 자리 (혼합)', genG21U3Sub2d2dMix, {
      id: 'u3_main_sub_mix',
    }),
  ]),
  차시('8차시 (두 자리) − (두 자리) 세로셈', { kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 − 두 자리 (세로셈)', genU1PreSub2d, { id: 'u3_main_sub_2d_vertical' }),
  ]),
  차시('9차시 두 자리 덧셈과 뺄셈 혼합', { grid: 'standard', count: 20 }, [
    학습지('두 자리 수 덧셈과 뺄셈 혼합', genG21U3Mix2dAll, { id: 'u3_main_mix_2d_all' }),
  ]),
]);

const u6 = defineUnit(GRADE_ID, 'u6', '곱셈(1)', [
  차시('1차시 여러 묶음으로 세기', { grid: 'standard', count: 20 }, [
    학습지('같은 수 여러 번 더하기', genG21U6RepeatedAdd, { id: 'u6_main_repeated_add' }),
    학습지('묶음을 곱셈식으로 나타내기', genG21U6GroupsToMul, { id: 'u6_main_groups_to_mul' }),
  ]),
  차시('2차시 곱셈식 익히기', { grid: 'standard', count: 20 }, [
    학습지('곱셈식 기초', genG21U6MulBasic, { id: 'u6_main_mul_basic' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '2-1',
  name: '2학년 1학기',
  units: {
    u1: { short: '1단원', name: '세 자리 수' },
    u3: { short: '3단원', name: '덧셈과 뺄셈(5)' },
    u6: { short: '6단원', name: '곱셈(1)' },
  },
};

export const entries = [...u1, ...u3, ...u6];

export const pdfMap = {
  'g2-1_u3_main_add_2d_vertical': 'add_2d',
  'g2-1_u3_main_sub_2d_vertical': 'sub_2d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
