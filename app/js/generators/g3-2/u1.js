'use strict';

/**
 * 3학년 2학기 1단원 곱셈 — (두 자리 수) × (두 자리 수) 곱셈의 원리
 *   + 계산 연습 (세 자리×한 자리 올림 단계, 몇십 곱하기, 어림셈 — 파일 아래쪽)
 *
 * 원리 학습지 6종이 같은 데이터 { a, b, tens, ones } 를 쓰고,
 * 템플릿(templates.js 의 T.mul2d2d*)이 풀이 모양을 그린다.
 *
 *   25 × 35 = 25 × 5 + 25 × 30
 *   25 × 30 = 25 × 3 × 10 = 75 × 10 = 750   ← 0은 한 개만 붙는다
 *
 * 수 범위
 *   곱해지는 수 a : 12~99, 일의 자리 0 제외
 *   곱하는 수 b  : 십의 자리 2~9, 일의 자리 2~9
 *     (일의 자리 0·1, 십의 자리 1 이면 부분곱 한 줄이 너무 쉬워져 원리가 흐려짐)
 *   모든 답은 자연수 (곱셈만 사용 — 음수·0·소수 결과 없음)
 */

import { rand, pickBalanced } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem, horizProblem } from '../../templates.js';
import { mulCarryCount, roundToUnit } from '../calc-steps.js';

function pickPair({ distinctDigits = false } = {}) {
  let a;
  do { a = rand(12, 99); } while (a % 10 === 0);
  let tens, ones;
  do {
    tens = rand(2, 9);
    ones = rand(2, 9);
  } while (distinctDigits && tens === ones);
  return { a, b: tens * 10 + ones, tens, ones };
}

/** 원리 학습지 공통 데이터 (①~④, ⑥) */
export function genG32U1Mul2d2dPrinciple() {
  return pickPair();
}

/**
 * ⑤ 틀린 풀이 고치기 — 학급에서 관찰된 두 가지 오류를 번갈아 낸다.
 *   extraZero  : 25 × 30 을 7500 으로 씀 (0을 하나 더 붙임)
 *   missingZero: 25 × 30 을 75 로 씀 (십의 자리 3을 일의 자리처럼 곱함)
 * 십의 자리 = 일의 자리이면 두 부분곱(25×5, 25×3)이 같은 수가 되어
 * 어느 줄이 틀렸는지 헷갈리므로 제외.
 */
export function genG32U1Mul2d2dErrorFix(_ctx, problemIndex) {
  const errorType = pickBalanced('g32Mul2d2dErrorFix', ['extraZero', 'missingZero'], problemIndex);
  return { ...pickPair({ distinctDigits: true }), errorType };
}

/* ================================================================
 * 계산 연습 (2026-11-18 추가) — 성취기준 [4수01-04], [4수01-08]
 * ================================================================ */


function mulProblem(a, b) {
  return { num1: a, num2: b, op: '×', ans: a * b, uniqueKeys: [`${a}x${b}`] };
}

/**
 * (세 자리 수) × (한 자리 수) — 올림 횟수별
 *   none: 올림 없음 (예: 213 × 3)
 *   one : 올림 한 번 (예: 216 × 3)
 *   many: 올림 두 번 이상 (예: 487 × 6)
 */
function genMul3d1dByCarry(kind) {
  while (true) {
    const a = rand(111, 999);
    const b = rand(2, 9);
    if (a % 100 === 0) continue;
    const c = mulCarryCount(a, b);
    if (kind === 'none' && c === 0) return mulProblem(a, b);
    if (kind === 'one' && c === 1) return mulProblem(a, b);
    if (kind === 'many' && c >= 2) return mulProblem(a, b);
  }
}

export function genG32U1Mul3d1dNoCarry() { return genMul3d1dByCarry('none'); }
export function genG32U1Mul3d1dCarry1() { return genMul3d1dByCarry('one'); }
export function genG32U1Mul3d1dCarryMany() { return genMul3d1dByCarry('many'); }

function withKeys(p, keys) { p.uniqueKeys = keys; return p; }

/** (몇십) × (몇십), (몇십몇) × (몇십) — 번갈아 출제 */
export function genG32U1MulTensTens(_ctx, problemIndex) {
  const type = pickBalanced('g32MulTensTens', ['tens', 'tensOnes'], problemIndex);
  const b = rand(2, 9) * 10;
  let a;
  if (type === 'tens') a = rand(2, 9) * 10;
  else do { a = rand(12, 99); } while (a % 10 === 0);
  return withKeys(horizProblem(`${a} × ${b}`, numBlank(a * b)), [`${a}x${b}`]);
}

/** (몇) × (몇십몇) (예: 6 × 27) */
export function genG32U1MulOnesTensOnes() {
  const a = rand(2, 9);
  let b;
  do { b = rand(12, 99); } while (b % 10 === 0);
  return withKeys(horizProblem(`${a} × ${b}`, numBlank(a * b)), [`${a}x${b}`]);
}

/** 곱셈 어림셈 [4수01-08]: (세 자리 수) × (한 자리 수) 를 몇백으로 어림 (예: 297 × 4 → 약 300 × 4 = 1200) */
export function genG32U1MulEstimate() {
  while (true) {
    const a = rand(110, 890);
    const b = rand(2, 9);
    const ra = roundToUnit(a, 100);
    if (ra === null) continue;
    const p = htmlProblem('stack-box',
      `<div class="stack-main">${a} × ${b}</div>`
      + `<div class="stack-sub">약 ${numBlank(ra)} × ${b} = ${numBlank(ra * b)}</div>`);
    return withKeys(p, [`${a}x${b}`]);
  }
}

export const PDF_GENERATORS_G32_U1 = {
  mul_3d1d_c0: () => genG32U1Mul3d1dNoCarry(),
  mul_3d1d_c1: () => genG32U1Mul3d1dCarry1(),
  mul_3d1d_cn: () => genG32U1Mul3d1dCarryMany(),
};
