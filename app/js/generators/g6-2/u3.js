'use strict';

/**
 * 6학년 2학기 3단원 — 소수의 나눗셈
 */

import { rand } from '../../utils.js';

function dec(value) {
  return Number(value.toFixed(3)).toString();
}

export function genG62U3DecimalDivDecimalTenths() {
  const divisor = rand(2, 9);
  const q = rand(2, 99);
  const dividend = (divisor * q) / 100;
  return {
    dvsr: dec(divisor / 10),
    dvnd: dec(dividend),
    workDvsr: String(divisor),
    workDvnd: dec(dividend * 10),
    quot: dec(q / 10),
    workRows: 5,
  };
}

export function genG62U3DecimalDivDecimalHundredths() {
  const divisor = rand(2, 99);
  const q = rand(2, 99);
  const dividend = (divisor * q) / 10000;
  return {
    dvsr: dec(divisor / 100),
    dvnd: dec(dividend),
    workDvsr: String(divisor),
    workDvnd: dec(dividend * 100),
    quot: dec(q / 100),
    workRows: 5,
  };
}

export function genG62U3DecimalDivMix() {
  return rand(1, 2) === 1 ? genG62U3DecimalDivDecimalTenths() : genG62U3DecimalDivDecimalHundredths();
}
