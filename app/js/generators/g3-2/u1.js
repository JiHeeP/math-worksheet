'use strict';

/**
 * 3학년 2학기 1단원 곱셈 — (두 자리 수) × (두 자리 수) 곱셈의 원리
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
