'use strict';

/**
 * 3학년 1학기 카탈로그
 *
 * 5-1 선수학습 generator 들이 본래 다루는 학기.
 * 본단원 학습지는 세로셈(PDF) 형태가 표준 — 5-1 의 선수학습 매핑과 동일.
 *
 * 현재 구현 단원:
 *   1단원 덧셈과 뺄셈 — 세 자리 수 덧·뺄셈 (세로셈, 받아올림·받아내림 단계별), 어림셈
 *   3단원 나눗셈 — 곱셈과 나눗셈의 관계, 두 자리 ÷ 한 자리
 *   4단원 곱셈 — 두 자리 × 한 자리 (세로셈)
 *   5단원 길이와 시간
 *   6단원 분수와 소수
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genU1PreAdd, genU1PreSub,
  genU1PreMul2d1d,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';
import { genU2PreDiv } from '../generators/g5-1/u2.js';
import {
  genG31U1Add3dNoCarry, genG31U1Add3dCarry1, genG31U1Add3dCarry2, genG31U1Add3dCarry3,
  genG31U1Sub3dNoBorrow, genG31U1Sub3dBorrow1, genG31U1Sub3dBorrow2, genG31U1Sub3dZeroBorrow,
  genG31U1Estimate3d, PDF_GENERATORS_G31_U1,
} from '../generators/g3-1/u1.js';
import { genG31U3MulToDiv, genG31U3DivByTimesTable } from '../generators/g3-1/u3.js';
import { genU6PreUnit, genU6PreLen } from '../generators/g5-1/u6.js';
import {
  genG31U6TenthsToDecimal, genG31U6HundredthsToDecimal,
  genG31U6DecimalToFraction, genG31U6DecimalCompare,
} from '../generators/g3-1/u6.js';

const GRADE_ID = 'g3-1';

const u1 = defineUnit(GRADE_ID, 'u1', '덧셈과 뺄셈', [
  // 받아올림·받아내림 횟수별 단계 연습 [4수01-03] — 차시명은 성취기준 기준(교과서 차시명 미확인)
  차시('세 자리 수의 덧셈 (받아올림 단계별)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('세 자리 수 덧셈 (받아올림 없음)', genG31U1Add3dNoCarry, { id: 'u1_main_add_3d_c0' }),
    학습지('세 자리 수 덧셈 (받아올림 1번)', genG31U1Add3dCarry1, { id: 'u1_main_add_3d_c1' }),
    학습지('세 자리 수 덧셈 (받아올림 2번)', genG31U1Add3dCarry2, { id: 'u1_main_add_3d_c2' }),
    학습지('세 자리 수 덧셈 (받아올림 3번)', genG31U1Add3dCarry3, { id: 'u1_main_add_3d_c3' }),
  ]),
  차시('세 자리 수의 뺄셈 (받아내림 단계별)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('세 자리 수 뺄셈 (받아내림 없음)', genG31U1Sub3dNoBorrow, { id: 'u1_main_sub_3d_b0' }),
    학습지('세 자리 수 뺄셈 (받아내림 1번)', genG31U1Sub3dBorrow1, { id: 'u1_main_sub_3d_b1' }),
    학습지('세 자리 수 뺄셈 (받아내림 2번)', genG31U1Sub3dBorrow2, { id: 'u1_main_sub_3d_b2' }),
    학습지('세 자리 수 뺄셈 (0이 있는 수에서 받아내림)', genG31U1Sub3dZeroBorrow, { id: 'u1_main_sub_3d_zero' }),
  ]),
  차시('1차시 세 자리 수 덧셈 (세로셈)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('세 자리 수 덧셈 (세로셈)', genU1PreAdd, { id: 'u1_main_add_3d' }),
  ]),
  차시('2차시 세 자리 수 뺄셈 (세로셈)', { kind: 'pdf', grid: 'standard', count: 15 }, [
    학습지('세 자리 수 뺄셈 (세로셈)', genU1PreSub, { id: 'u1_main_sub_3d' }),
  ]),
  // [4수01-08] 어림셈
  차시('덧셈과 뺄셈 어림셈', { grid: 'practice', count: 12 }, [
    학습지('덧셈과 뺄셈 어림셈 (몇백으로 어림하기)', genG31U1Estimate3d, { id: 'u1_main_estimate_3d' }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '나눗셈', [
  // [4수01-05] 곱셈과 나눗셈의 관계
  차시('곱셈과 나눗셈의 관계', { grid: 'practice', count: 12 }, [
    학습지('곱셈식을 나눗셈식으로 바꾸기', genG31U3MulToDiv, { id: 'u3_main_mul_to_div' }),
    학습지('곱셈구구로 나눗셈의 몫 구하기', genG31U3DivByTimesTable, { id: 'u3_main_div_by_times_table' }),
  ]),
  차시('1차시 한 자리 수로 나누는 나눗셈 (몫 한 자리)', { grid: 'dense', count: 36 }, [
    학습지('나눗셈 (한 자리 나누기)', genU2PreDiv, { id: 'u3_main_div_one_digit' }),
  ]),
]);

const u4 = defineUnit(GRADE_ID, 'u4', '곱셈', [
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

const u6 = defineUnit(GRADE_ID, 'u6', '분수와 소수', [
  차시('1차시 분수를 소수로 나타내기', { grid: 'practice', count: 15 }, [
    학습지('분모 10인 분수 → 소수', genG31U6TenthsToDecimal, { id: 'u6_main_tenths_to_decimal' }),
    학습지('분모 100인 분수 → 소수', genG31U6HundredthsToDecimal, { id: 'u6_main_hundredths_to_decimal' }),
  ]),
  차시('2차시 소수와 분수의 관계', { grid: 'practice', count: 15 }, [
    학습지('소수 → 분수', genG31U6DecimalToFraction, { id: 'u6_main_decimal_to_frac' }),
    학습지('소수 크기 비교', genG31U6DecimalCompare, { id: 'u6_main_decimal_compare' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '3-1',
  name: '3학년 1학기',
  units: {
    u1: { short: '1단원', name: '덧셈과 뺄셈' },
    u3: { short: '3단원', name: '나눗셈' },
    u4: { short: '4단원', name: '곱셈' },
    u5: { short: '5단원', name: '길이와 시간' },
    u6: { short: '6단원', name: '분수와 소수' },
  },
};

export const entries = [...u1, ...u3, ...u4, ...u5, ...u6];

/* ── PDF 매핑 (세로셈 출력 학습지 ID → PDF 제너레이터 키) ── */

export const pdfMap = {
  'g3-1_u1_main_add_3d': 'add_3d',
  'g3-1_u1_main_sub_3d': 'sub_3d',
  'g3-1_u4_main_mul_2d1d': 'mul_2d1d',
  'g3-1_u1_main_add_3d_c0': 'add_3d_c0',
  'g3-1_u1_main_add_3d_c1': 'add_3d_c1',
  'g3-1_u1_main_add_3d_c2': 'add_3d_c2',
  'g3-1_u1_main_add_3d_c3': 'add_3d_c3',
  'g3-1_u1_main_sub_3d_b0': 'sub_3d_b0',
  'g3-1_u1_main_sub_3d_b1': 'sub_3d_b1',
  'g3-1_u1_main_sub_3d_b2': 'sub_3d_b2',
  'g3-1_u1_main_sub_3d_zero': 'sub_3d_zero',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1, ...PDF_GENERATORS_G31_U1 };
