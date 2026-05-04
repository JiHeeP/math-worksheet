'use strict';

/**
 * 3학년 2학기 카탈로그
 *
 * 5-1 선수학습 generator 들이 본래 다루는 학기.
 * 곱셈/나눗셈은 세로셈(PDF) 표준 출력.
 *
 * 현재 구현 단원:
 *   1단원 곱셈 — 두 자리 × 두 자리 (세로셈)
 *   2단원 나눗셈 — 두/세 자리 ÷ 한 자리 (세로셈, 나머지 ±)
 *   4단원 분수 — 분모 같은 분수 비교, 가분수 ↔ 대분수
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genU1PreMul,
  genU1PreDiv2d1d, genU1PreDiv2d1dNoRem, genU1PreDiv2d1dRem,
  genDiv3d1,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';
import { genU4PreCmp, genU4PreConv } from '../generators/g5-1/u4.js';
import {
  genU5PreMixedToImproperProcess, genU5PreMixedToImproper,
} from '../generators/g5-1/u5.js';

const GRADE_ID = 'g3-2';

const u1 = defineUnit(GRADE_ID, 'u1', '곱셈', [
  차시('1차시 두 자리 × 두 자리 (세로셈)', { kind: 'pdf', grid: 'standard', count: 12 }, [
    학습지('두 자리 × 두 자리 (세로셈)', genU1PreMul, { id: 'u1_main_mul_2d2d' }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '나눗셈', [
  차시('1차시 두 자리 ÷ 한 자리 (세로셈)', { kind: 'html', grid: 'standard', count: 12 }, [
    학습지('두 자리 ÷ 한 자리 (세로셈)', genU1PreDiv2d1d, { id: 'u3_main_div_2d1d' }),
  ]),
  차시('2차시 두 자리 ÷ 한 자리 (나머지 없음)', { kind: 'pdf', grid: 'standard', count: 12 }, [
    학습지('두 자리 ÷ 한 자리 (나머지 없음)', genU1PreDiv2d1dNoRem, { id: 'u3_main_div_norem' }),
  ]),
  차시('3차시 두 자리 ÷ 한 자리 (나머지 있음)', { kind: 'pdf', grid: 'standard', count: 12 }, [
    학습지('두 자리 ÷ 한 자리 (나머지 있음)', genU1PreDiv2d1dRem, { id: 'u3_main_div_rem' }),
  ]),
  차시('4차시 세 자리 ÷ 한 자리 (세로셈)', { kind: 'pdf', grid: 'divgrid', count: 9 }, [
    학습지('세 자리 ÷ 한 자리 (세로셈)', genDiv3d1, { id: 'u3_main_div_3d1' }),
  ]),
]);

const u5 = defineUnit(GRADE_ID, 'u5', '분수', [
  차시('1차시 분모가 같은 분수의 크기 비교', { grid: 'practice', count: 15 }, [
    학습지('분모 같은 분수 크기 비교', genU4PreCmp, { id: 'u5_main_frac_cmp' }),
  ]),
  차시('2차시 가분수 → 대분수 변환 (과정 연습)', { grid: 'concept', count: 8 }, [
    학습지('가분수 → 대분수 (과정 연습)', genU5PreMixedToImproperProcess, { id: 'u5_main_improper_process' }),
  ]),
  차시('3차시 가분수 → 대분수 변환', { grid: 'practice', count: 15 }, [
    학습지('가분수 → 대분수 변환', genU4PreConv, { id: 'u5_main_improper_to_mixed' }),
  ]),
  차시('4차시 대분수 → 가분수 변환', { grid: 'practice', count: 15 }, [
    학습지('대분수 → 가분수', genU5PreMixedToImproper, { id: 'u5_main_mixed_to_improper' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '3-2',
  name: '3학년 2학기',
  units: {
    u1: { short: '1단원', name: '곱셈' },
    u3: { short: '2단원', name: '나눗셈' },
    u5: { short: '4단원', name: '분수' },
  },
};

export const entries = [...u1, ...u3, ...u5];

export const pdfMap = {
  'g3-2_u1_main_mul_2d2d': 'mul_2d2d',
  'g3-2_u3_main_div_2d1d': 'div_2d1d',
  'g3-2_u3_main_div_norem': 'div_2d1d_norem',
  'g3-2_u3_main_div_rem': 'div_2d1d_rem',
  'g3-2_u3_main_div_3d1': 'div_3d1d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
