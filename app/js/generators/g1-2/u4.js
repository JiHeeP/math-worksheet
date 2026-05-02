'use strict';

/**
 * 1학년 2학기 4단원 — 덧셈과 뺄셈(2)
 * 받아올림·내림이 없는 두 자리 수 사칙.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

// (두 자리) + (한 자리), 받아올림 없음 (일의 자리 합 < 10)
export function genG12U4Add2d1d() {
  const tens = rand(1, 8);
  const ones = rand(1, 7);
  const a = tens * 10 + ones;
  const b = rand(1, 9 - ones);
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}

// (두 자리) + (두 자리), 받아올림 없음 (각 자릿값 합 < 10)
export function genG12U4Add2d2d() {
  const t1 = rand(1, 4);
  const o1 = rand(1, 4);
  const t2 = rand(1, 9 - t1);
  const o2 = rand(1, 9 - o1);
  const a = t1 * 10 + o1;
  const b = t2 * 10 + o2;
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}

// (두 자리) − (한 자리), 받아내림 없음 (일의 자리 ≥ b)
export function genG12U4Sub2d1d() {
  const tens = rand(1, 9);
  const ones = rand(1, 9);
  const a = tens * 10 + ones;
  const b = rand(1, ones);
  return horizProblem(`${a} − ${b}`, numBlank(a - b));
}

// (두 자리) − (두 자리), 받아내림 없음
export function genG12U4Sub2d2d() {
  const t1 = rand(2, 9);
  const o1 = rand(1, 9);
  const t2 = rand(1, t1 - 1);
  const o2 = rand(1, o1);
  const a = t1 * 10 + o1;
  const b = t2 * 10 + o2;
  return horizProblem(`${a} − ${b}`, numBlank(a - b));
}
