'use strict';

/**
 * 3학년 2학기 카탈로그
 *
 * 5-1 선수학습 generator 들이 본래 다루는 학기.
 * 곱셈/나눗셈은 세로셈(PDF) 표준 출력.
 *
 * 현재 구현 단원:
 *   1단원 곱셈 — 두 자리 × 두 자리 (세로셈, 난이도 중·상) + 곱셈의 원리 6종
 *   2단원 나눗셈 — 두/세 자리 ÷ 한 자리 (세로셈, 나머지 ±)
 *   4단원 분수 — 분모 같은 분수 비교, 가분수 ↔ 대분수
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';
import { T } from '../templates.js';

import {
  genU1PreMul, genU1PreMulHard,
  genU1PreDiv2d1d, genU1PreDiv2d1dNoRem, genU1PreDiv2d1dRem,
  genDiv3d1,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';
import { genG32U1Mul2d2dPrinciple, genG32U1Mul2d2dErrorFix } from '../generators/g3-2/u1.js';
import { genU4PreCmp, genU4PreConv, genU4PreImproperToMixedProcess } from '../generators/g5-1/u4.js';
import {
  genU5PreMixedToImproperProcess, genU5PreMixedToImproper,
} from '../generators/g5-1/u5.js';

const GRADE_ID = 'g3-2';

/**
 * (두 자리 수) × (두 자리 수) 곱셈의 원리 학습지 6종 (배우는 순서대로).
 * 5-2 '곱셈과 나눗셈' 총연습에서도 같은 목록을 쓰므로 함수로 export.
 * (catalogs 끼리 import 하므로 호이스팅되는 function 선언으로 둔다.)
 *   idPrefix: 'u1_main' → 'u1_main_mul_principle_tens' …
 */
export function mul2d2dPrincipleSheets(idPrefix) {
  const id = (suffix) => ({ id: `${idPrefix}_mul_principle_${suffix}` });
  return [
    학습지('곱셈 원리 ① (두 자리 수) × (몇십) — 0을 붙이는 까닭', T.mul2d2dTens, genG32U1Mul2d2dPrinciple, id('tens')),
    학습지('곱셈 원리 ② 넓이 그림으로 알아보기', T.mul2d2dArea, genG32U1Mul2d2dPrinciple, id('area')),
    학습지('곱셈 원리 ③ 자릿값으로 갈라서 계산하기', T.mul2d2dSplit, genG32U1Mul2d2dPrinciple, id('split')),
    학습지('곱셈 원리 ④ 세로셈 — 두 줄로 나누어 쓰기', T.mul2d2dVertical, genG32U1Mul2d2dPrinciple, id('vertical')),
    학습지('곱셈 원리 ⑤ 틀린 풀이 고치기', T.mul2d2dErrorFix, genG32U1Mul2d2dErrorFix, id('error_fix')),
    학습지('곱셈 원리 ⑥ 문장으로 설명하기 (빈칸 채우기)', T.mul2d2dSentence, genG32U1Mul2d2dPrinciple, id('sentence')),
  ];
}

const u1 = defineUnit(GRADE_ID, 'u1', '곱셈', [
  차시('두 자리 × 두 자리 곱셈의 원리', mul2d2dPrincipleSheets('u1_main')),
  차시('1차시 두 자리 × 두 자리 (세로셈)', { kind: 'pdf', grid: 'standard', count: 12 }, [
    학습지('두 자리 × 두 자리 (세로셈, 난이도 중)', genU1PreMul, { id: 'u1_main_mul_2d2d' }),
    학습지('두 자리 × 두 자리 (세로셈, 난이도 상 · 모든 자리 올림)', genU1PreMulHard, { id: 'u1_main_mul_2d2d_hard' }),
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
  차시('2차시 대분수 → 가분수 변환 (과정 연습)', { grid: 'concept', count: 8 }, [
    학습지('대분수 → 가분수 (과정 연습)', genU5PreMixedToImproperProcess, { id: 'u5_main_mixed_to_improper_process' }),
  ]),
  차시('3차시 가분수 → 대분수 변환 (과정 연습)', { grid: 'concept', count: 8 }, [
    학습지('가분수 → 대분수 (과정 연습)', genU4PreImproperToMixedProcess, { id: 'u5_main_improper_to_mixed_process' }),
  ]),
  차시('4차시 가분수 → 대분수 변환', { grid: 'practice', count: 15 }, [
    학습지('가분수 → 대분수 변환', genU4PreConv, { id: 'u5_main_improper_to_mixed' }),
  ]),
  차시('5차시 대분수 → 가분수 변환', { grid: 'practice', count: 15 }, [
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
  'g3-2_u1_main_mul_2d2d_hard': 'mul_2d2d_hard',
  'g3-2_u3_main_div_2d1d': 'div_2d1d',
  'g3-2_u3_main_div_norem': 'div_2d1d_norem',
  'g3-2_u3_main_div_rem': 'div_2d1d_rem',
  'g3-2_u3_main_div_3d1': 'div_3d1d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
