'use strict';

/**
 * 4학년 2학기 3단원 — 소수의 덧셈과 뺄셈
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

function dec(value) {
  return Number(value.toFixed(2)).toString();
}

export function genG42U3DecimalAddTenths() {
  const a = rand(1, 89);
  const b = rand(1, 99 - a);
  return horizProblem(`${dec(a / 10)} + ${dec(b / 10)}`, numBlank(dec((a + b) / 10)));
}

export function genG42U3DecimalSubTenths() {
  const b = rand(1, 89);
  const a = rand(b + 1, 99);
  return horizProblem(`${dec(a / 10)} − ${dec(b / 10)}`, numBlank(dec((a - b) / 10)));
}

export function genG42U3DecimalAddHundredths() {
  const a = rand(1, 899);
  const b = rand(1, 999 - a);
  return horizProblem(`${dec(a / 100)} + ${dec(b / 100)}`, numBlank(dec((a + b) / 100)));
}

export function genG42U3DecimalSubHundredths() {
  const b = rand(1, 899);
  const a = rand(b + 1, 999);
  return horizProblem(`${dec(a / 100)} − ${dec(b / 100)}`, numBlank(dec((a - b) / 100)));
}
