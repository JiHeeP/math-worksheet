'use strict';

/**
 * 4학년 1학기 카탈로그
 *
 * 5-1 선수학습 generator 들이 본래 다루는 학기.
 * 곱셈/나눗셈은 세로셈(PDF) 표준 출력.
 *
 * 현재 구현 단원:
 *   1단원 큰 수
 *   3단원 곱셈과 나눗셈(7) — 세 자리 × 두 자리, 세 자리 ÷ 두 자리
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genG41U1TenThousands, genG41U1PlaceValue, genG41U1CompareBig,
} from '../generators/g4-1/u1.js';

import {
  genU1PreMul3x2, genDiv3d2, genU1PreDiv,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';

const GRADE_ID = 'g4-1';

const u1 = defineUnit(GRADE_ID, 'u1', '큰 수', [
  차시('1차시 만 이상의 수', { grid: 'concept', count: 8 }, [
    학습지('만 단위 수 쓰기', genG41U1TenThousands, { id: 'u1_main_ten_thousands' }),
    학습지('큰 수의 자릿값', genG41U1PlaceValue, { id: 'u1_main_place_value' }),
  ]),
  차시('2차시 큰 수의 크기 비교', { grid: 'standard', count: 20 }, [
    학습지('큰 수 크기 비교', genG41U1CompareBig, { id: 'u1_main_compare_big' }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '곱셈과 나눗셈(7)', [
  차시('1차시 세 자리 × 두 자리 (세로셈)', { kind: 'pdf', grid: 'standard', count: 12 }, [
    학습지('세 자리 × 두 자리 (세로셈)', genU1PreMul3x2, { id: 'u3_main_mul_3d2d' }),
  ]),
  차시('2차시 세 자리 ÷ 두 자리 (세로셈)', { kind: 'pdf', grid: 'divgrid', count: 9 }, [
    학습지('세 자리 ÷ 두 자리 (세로셈)', genDiv3d2, { id: 'u3_main_div_3d2d' }),
  ]),
  차시('3차시 두 자리 수로 나누는 가로셈 (몫·나머지)', { kind: 'html', grid: 'standard', count: 20 }, [
    학습지('두 자리 수로 나누는 가로셈', genU1PreDiv, { id: 'u3_main_div_2d_horiz' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '4-1',
  name: '4학년 1학기',
  units: {
    u1: { short: '1단원', name: '큰 수' },
    u3: { short: '3단원', name: '곱셈과 나눗셈(7)' },
  },
};

export const entries = [...u1, ...u3];

export const pdfMap = {
  'g4-1_u3_main_mul_3d2d': 'mul_3d2d',
  'g4-1_u3_main_div_3d2d': 'div_3d2d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
