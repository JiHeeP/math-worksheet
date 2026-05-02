'use strict';

/**
 * 1학년 1학기 3단원 — 덧셈과 뺄셈(1)
 * 9 이하 한 자리 수 덧셈/뺄셈. 결과도 9 이하.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

// 9 이하 한 자리 덧셈: a + b ≤ 9, a·b ≥ 1
export function genG11U3Add9() {
  const result = rand(2, 9);
  const a = rand(1, result - 1);
  const b = result - a;
  return horizProblem(`${a} + ${b}`, numBlank(result));
}

// 9 이하 한 자리 뺄셈: a − b ≥ 1
export function genG11U3Sub9() {
  const a = rand(2, 9);
  const b = rand(1, a - 1);
  return horizProblem(`${a} − ${b}`, numBlank(a - b));
}
