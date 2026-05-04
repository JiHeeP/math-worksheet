'use strict';

/**
 * 5학년 2학기 4단원 — 소수의 곱셈
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

function dec(value) {
  return Number(value.toFixed(3)).toString();
}

export function genG52U4DecimalTimesInt() {
  const a = rand(2, 99);
  const b = rand(2, 9);
  return horizProblem(`${dec(a / 10)} × ${b}`, numBlank(dec((a * b) / 10)));
}

export function genG52U4IntTimesDecimal() {
  const a = rand(2, 9);
  const b = rand(2, 99);
  return horizProblem(`${a} × ${dec(b / 10)}`, numBlank(dec((a * b) / 10)));
}

export function genG52U4DecimalTimesDecimalTenths() {
  const a = rand(2, 99);
  const b = rand(2, 99);
  return horizProblem(`${dec(a / 10)} × ${dec(b / 10)}`, numBlank(dec((a * b) / 100)));
}

export function genG52U4DecimalTimes10() {
  const a = rand(2, 999);
  const unit = [10, 100][rand(0, 1)];
  return horizProblem(`${dec(a / 10)} × ${unit}`, numBlank(dec((a / 10) * unit)));
}
