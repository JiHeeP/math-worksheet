'use strict';

/**
 * 6학년 2학기 3단원 — 소수의 나눗셈
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

function dec(value) {
  return Number(value.toFixed(3)).toString();
}

export function genG62U3DecimalDivDecimalTenths() {
  const divisor = rand(2, 9);
  const q = rand(2, 99);
  const dividend = (divisor * q) / 100;
  return horizProblem(`${dec(dividend)} ÷ ${dec(divisor / 10)}`, numBlank(dec(q / 10)));
}

export function genG62U3DecimalDivDecimalHundredths() {
  const divisor = rand(2, 99);
  const q = rand(2, 99);
  const dividend = (divisor * q) / 10000;
  return horizProblem(`${dec(dividend)} ÷ ${dec(divisor / 100)}`, numBlank(dec(q / 100)));
}

export function genG62U3DecimalDivMix() {
  return rand(1, 2) === 1 ? genG62U3DecimalDivDecimalTenths() : genG62U3DecimalDivDecimalHundredths();
}
