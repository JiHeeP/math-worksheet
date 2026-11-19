'use strict';

/**
 * 4학년 1학기 카탈로그
 *
 * 5-1 선수학습 generator 들이 본래 다루는 학기.
 * 곱셈/나눗셈은 세로셈(PDF) 표준 출력.
 *
 * 현재 구현 단원:
 *   1단원 큰 수
 *   3단원 곱셈과 나눗셈 — 세 자리 × 몇십·두 자리, 몇십·몇십몇으로 나누기, 세 자리 ÷ 두 자리, 어림셈
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genG41U1TenThousands, genG41U1PlaceValue, genG41U1CompareBig,
} from '../generators/g4-1/u1.js';

import {
  genU1PreMul3x2, genDiv3d2, genU1PreDiv,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';

import {
  genG41U3Mul3dTens, genG41U3DivByTens, genG41U3DivBy2dQuot1,
  genG41U3MulEstimate, genG41U3DivEstimate, PDF_GENERATORS_G41_U3,
} from '../generators/g4-1/u3.js';

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

const u3 = defineUnit(GRADE_ID, 'u3', '곱셈과 나눗셈', [
  // [4수01-04] 차시 순서 참고: 비상교육 비바샘 4-1 3단원 (세 자리 수에 몇십을 곱해 볼까요)
  차시('(세 자리 수) × (몇십)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('(세 자리 수) × (몇십) (세로셈)', genG41U3Mul3dTens, { id: 'u3_main_mul_3d_tens' }),
  ]),
  차시('1차시 세 자리 × 두 자리 (세로셈)', { kind: 'pdf', grid: 'standard', count: 12 }, [
    학습지('세 자리 × 두 자리 (세로셈)', genU1PreMul3x2, { id: 'u3_main_mul_3d2d' }),
  ]),
  차시('2차시 세 자리 ÷ 두 자리 (세로셈)', { kind: 'pdf', grid: 'divgrid', count: 9 }, [
    학습지('세 자리 ÷ 두 자리 (세로셈)', genDiv3d2, { id: 'u3_main_div_3d2d' }),
  ]),
  // [4수01-07] 몇십으로 나누기 → 몇십몇으로 나누기 (비바샘 4-1 3단원 5·6차시)
  차시('몇십으로 나누기, 몇십몇으로 나누기 (몫 한 자리)', { kind: 'pdf', grid: 'divgrid', count: 9 }, [
    학습지('몇십으로 나누기 (몫 한 자리)', genG41U3DivByTens, { id: 'u3_main_div_by_tens', layout: { countMultiple: 2 } }),
    학습지('몇십몇으로 나누기 (몫 한 자리)', genG41U3DivBy2dQuot1, { id: 'u3_main_div_by_2d_q1', layout: { countMultiple: 2 } }),
  ]),
  // [4수01-08] 어림셈
  차시('곱셈과 나눗셈 어림셈', { grid: 'practice', count: 12 }, [
    학습지('곱셈 어림셈 (몇백 × 몇십)', genG41U3MulEstimate, { id: 'u3_main_mul_estimate', grid: 'concept', count: 10 }),
    학습지('나눗셈 어림셈 (몇백 ÷ 몇십)', genG41U3DivEstimate, { id: 'u3_main_div_estimate' }),
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
    u3: { short: '3단원', name: '곱셈과 나눗셈' },
  },
};

export const entries = [...u1, ...u3];

export const pdfMap = {
  'g4-1_u3_main_mul_3d2d': 'mul_3d2d',
  'g4-1_u3_main_div_3d2d': 'div_3d2d',
  'g4-1_u3_main_mul_3d_tens': 'mul_3d_tens',
  'g4-1_u3_main_div_by_tens': 'div_by_tens',
  'g4-1_u3_main_div_by_2d_q1': 'div_by_2d_q1',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1, ...PDF_GENERATORS_G41_U3 };
