'use strict';

/**
 * 2학년 1학기 3단원 — 덧셈과 뺄셈(5)
 * 두 자리 ± 두 자리 (받아올림 0/1/2회), 두 자리 − 한 자리 받아내림.
 *
 * 받아올림/내림 시각 풀이는 Phase 3 에서 단계 풀이 템플릿으로 추가 예정.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

/* ── (두 자리) + (두 자리) ── */

// 받아올림 없음: 일의 자리 합 < 10 AND 합 < 100
export function genG21U3Add2d2dNoCarry() {
  while (true) {
    const a = rand(10, 89);
    const b = rand(10, 89);
    if ((a % 10) + (b % 10) < 10 && a + b < 100) {
      return horizProblem(`${a} + ${b}`, numBlank(a + b));
    }
  }
}

// 받아올림 1회 (일의 자리 → 십의 자리), 합 < 100
export function genG21U3Add2d2dSingle() {
  while (true) {
    const a = rand(10, 89);
    const b = rand(10, 89);
    const hasUnitCarry = (a % 10) + (b % 10) >= 10;
    if (hasUnitCarry && a + b < 100) {
      return horizProblem(`${a} + ${b}`, numBlank(a + b));
    }
  }
}

// 받아올림 2회 (일의 자리·십의 자리 모두), 합 ≥ 100
export function genG21U3Add2d2dDouble() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(20, 99);
    const hasUnitCarry = (a % 10) + (b % 10) >= 10;
    if (hasUnitCarry && a + b >= 100) {
      return horizProblem(`${a} + ${b}`, numBlank(a + b));
    }
  }
}

// 혼합 (받아올림 횟수 무작위)
export function genG21U3Add2d2dMix() {
  const r = rand(1, 3);
  if (r === 1) return genG21U3Add2d2dNoCarry();
  if (r === 2) return genG21U3Add2d2dSingle();
  return genG21U3Add2d2dDouble();
}

/* ── (두 자리) − (두 자리) ── */

// 받아내림 없음: a > b, 일의 자리 ≥ 일의 자리
export function genG21U3Sub2d2dNoBorrow() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if ((a % 10) >= (b % 10)) {
      return horizProblem(`${a} − ${b}`, numBlank(a - b));
    }
  }
}

// 받아내림 있음: a > b, 일의 자리 < 일의 자리
export function genG21U3Sub2d2dBorrow() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if ((a % 10) < (b % 10)) {
      return horizProblem(`${a} − ${b}`, numBlank(a - b));
    }
  }
}

// 혼합
export function genG21U3Sub2d2dMix() {
  return rand(1, 2) === 1 ? genG21U3Sub2d2dNoBorrow() : genG21U3Sub2d2dBorrow();
}

/* ── (두 자리) − (한 자리), 받아내림 있음 ── */

export function genG21U3Sub2d1dBorrow() {
  while (true) {
    const a = rand(20, 98);
    const b = rand(2, 9);
    if ((a % 10) < b) {
      return horizProblem(`${a} − ${b}`, numBlank(a - b));
    }
  }
}
