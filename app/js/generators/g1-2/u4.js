'use strict';

/**
 * 1학년 2학기 4단원 — 덧셈과 뺄셈(2)
 * 받아올림·내림이 없는 두 자리 수 사칙.
 */

import { rand, numberRangeForStage } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

// 1단계 [1, 20] 으로 잡으면 두 자리 수가 [10, 20] 으로 좁아진다.
// 두 자리 수 학습지이므로 분기당 최소 [10, ...] 보장.
function tensRange(lo, hi) {
  return [Math.max(1, Math.floor(Math.max(10, lo) / 10)), Math.min(9, Math.floor(hi / 10))];
}

// (두 자리) + (한 자리), 받아올림 없음 (일의 자리 합 < 10)
export function genG12U4Add2d1d(ctx = {}) {
  const [lo, hi] = numberRangeForStage(ctx.numberStage || 2);
  const [tLo, tHi] = tensRange(lo, hi);
  const tens = rand(Math.max(1, tLo), Math.max(1, tHi - 1, tLo));
  const ones = rand(1, 7);
  const a = tens * 10 + ones;
  const b = rand(1, 9 - ones);
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}

// (두 자리) + (두 자리), 받아올림 없음 (각 자릿값 합 < 10)
export function genG12U4Add2d2d(ctx = {}) {
  const [lo, hi] = numberRangeForStage(ctx.numberStage || 2);
  const [tLo, tHi] = tensRange(lo, hi);
  let a, b, tries = 0;
  do {
    const t1 = rand(tLo, Math.max(tLo, tHi));
    const o1 = rand(1, 8);
    const maxT2 = Math.min(9 - t1, tHi);
    const t2 = rand(Math.max(1, Math.min(tLo, maxT2)), Math.max(1, maxT2));
    const o2 = rand(1, Math.max(1, 9 - o1));
    a = t1 * 10 + o1;
    b = t2 * 10 + o2;
    tries++;
  } while ((a < Math.max(10, lo) || b < Math.max(10, lo) || a > hi || b > hi) && tries < 80);
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}

// (두 자리) − (한 자리), 받아내림 없음 (일의 자리 ≥ b)
export function genG12U4Sub2d1d(ctx = {}) {
  const [lo, hi] = numberRangeForStage(ctx.numberStage || 2);
  const [tLo, tHi] = tensRange(lo, hi);
  const tens = rand(Math.max(1, tLo), Math.max(tLo, tHi));
  const ones = rand(1, 9);
  const a = tens * 10 + ones;
  const b = rand(1, ones);
  return horizProblem(`${a} − ${b}`, numBlank(a - b));
}

// (두 자리) − (두 자리), 받아내림 없음
export function genG12U4Sub2d2d(ctx = {}) {
  const [lo, hi] = numberRangeForStage(ctx.numberStage || 2);
  const [tLo, tHi] = tensRange(lo, hi);
  let a, b, tries = 0;
  do {
    const t1 = rand(Math.max(2, tLo), Math.max(tLo + 1, tHi));
    const o1 = rand(1, 9);
    const t2 = rand(Math.max(1, tLo - 0), Math.max(1, t1 - 1));
    const o2 = rand(1, o1);
    a = t1 * 10 + o1;
    b = t2 * 10 + o2;
    tries++;
  } while ((a < Math.max(10, lo) || b < Math.max(10, lo) || a > hi || b > hi || a <= b) && tries < 80);
  return horizProblem(`${a} − ${b}`, numBlank(a - b));
}
