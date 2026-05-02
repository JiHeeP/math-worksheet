'use strict';

/**
 * 3학년 1학기 카탈로그
 *
 * 5-1 선수학습 generator 들이 본래 다루는 학기.
 * 본단원 학습지는 세로셈(PDF) 형태가 표준 — 5-1 의 선수학습 매핑과 동일.
 *
 * 현재 구현 단원:
 *   1단원 덧셈과 뺄셈(6) — 세 자리 수 덧·뺄셈 (세로셈)
 *   3단원 나눗셈(3) — 두 자리 ÷ 한 자리
 *   4단원 곱셈(4) — 두 자리 × 한 자리 (세로셈)
 *   5단원 길이와 시간
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genU1PreAdd, genU1PreSub,
  genU1PreMul2d1d,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';
import { genU2PreDiv } from '../generators/g5-1/u2.js';
import { genU6PreUnit, genU6PreLen } from '../generators/g5-1/u6.js';

const GRADE_ID = 'g3-1';

const u1 = defineUnit(GRADE_ID, 'u1', '덧셈과 뺄셈(6)', [
  차시('1차시 세 자리 수 덧셈 (세로셈)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('세 자리 수 덧셈 (세로셈)', genU1PreAdd, { id: 'u1_main_add_3d' }),
  ]),
  차시('2차시 세 자리 수 뺄셈 (세로셈)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('세 자리 수 뺄셈 (세로셈)', genU1PreSub, { id: 'u1_main_sub_3d' }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '나눗셈(3)', [
  차시('1차시 한 자리 수로 나누는 나눗셈 (몫 한 자리)', { grid: 'dense', count: 36 }, [
    학습지('나눗셈 (한 자리 나누기)', genU2PreDiv, { id: 'u3_main_div_one_digit' }),
  ]),
]);

const u4 = defineUnit(GRADE_ID, 'u4', '곱셈(4)', [
  차시('1차시 두 자리 × 한 자리 (세로셈)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('두 자리 × 한 자리 (세로셈)', genU1PreMul2d1d, { id: 'u4_main_mul_2d1d' }),
  ]),
]);

const u5 = defineUnit(GRADE_ID, 'u5', '길이와 시간', [
  차시('1차시 단위 변환 (cm, m, km)', { grid: 'standard', count: 20 }, [
    학습지('단위 변환 (cm, m, km)', genU6PreUnit, { id: 'u5_main_unit_convert' }),
  ]),
  차시('2차시 길이의 합과 차', { grid: 'standard', count: 20 }, [
    학습지('길이의 합과 차', genU6PreLen, { id: 'u5_main_len_sum_diff' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '3-1',
  name: '3학년 1학기',
  units: {
    u1: { short: '1단원', name: '덧셈과 뺄셈(6)' },
    u3: { short: '3단원', name: '나눗셈(3)' },
    u4: { short: '4단원', name: '곱셈(4)' },
    u5: { short: '5단원', name: '길이와 시간' },
  },
};

export const entries = [...u1, ...u3, ...u4, ...u5];

/* ── PDF 매핑 (세로셈 출력 학습지 ID → PDF 제너레이터 키) ── */

export const pdfMap = {
  'g3-1_u1_main_add_3d': 'add_3d',
  'g3-1_u1_main_sub_3d': 'sub_3d',
  'g3-1_u4_main_mul_2d1d': 'mul_2d1d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
