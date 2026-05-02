'use strict';

/**
 * 4학년 1학기 카탈로그
 *
 * 5-1 선수학습 generator 들이 본래 다루는 학기.
 * 곱셈/나눗셈은 세로셈(PDF) 표준 출력.
 *
 * 현재 구현 단원:
 *   3단원 곱셈과 나눗셈(7) — 세 자리 × 두 자리, 세 자리 ÷ 두 자리
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genU1PreMul3x2, genDiv3d2,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';

const GRADE_ID = 'g4-1';

const u3 = defineUnit(GRADE_ID, 'u3', '곱셈과 나눗셈(7)', [
  차시('1차시 세 자리 × 두 자리 (세로셈)', { kind: 'pdf', grid: 'standard', count: 12 }, [
    학습지('세 자리 × 두 자리 (세로셈)', genU1PreMul3x2, { id: 'u3_main_mul_3d2d' }),
  ]),
  차시('2차시 세 자리 ÷ 두 자리 (세로셈)', { kind: 'pdf', grid: 'divgrid', count: 9 }, [
    학습지('세 자리 ÷ 두 자리 (세로셈)', genDiv3d2, { id: 'u3_main_div_3d2d' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '4-1',
  name: '4학년 1학기',
  units: {
    u3: { short: '3단원', name: '곱셈과 나눗셈(7)' },
  },
};

export const entries = [...u3];

export const pdfMap = {
  'g4-1_u3_main_mul_3d2d': 'mul_3d2d',
  'g4-1_u3_main_div_3d2d': 'div_3d2d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
