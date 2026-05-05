'use strict';

/**
 * 6학년 1학기 3단원 — 소수의 나눗셈
 */

import { rand } from '../../utils.js';

function dec(value) {
  return Number(value.toFixed(3)).toString();
}

export function genG61U3DecimalDivInt() {
  const divisor = rand(2, 9);
  const q = rand(2, 99);
  const dividend = (divisor * q) / 10;
  return { dvsr: String(divisor), dvnd: dec(dividend), quot: dec(q / 10), workRows: 5 };
}

export function genG61U3DecimalDivIntHundredths() {
  const divisor = rand(2, 9);
  const q = rand(2, 99);
  const dividend = (divisor * q) / 100;
  return { dvsr: String(divisor), dvnd: dec(dividend), quot: dec(q / 100), workRows: 5 };
}

export function genG61U3IntDivIntDecimal() {
  while (true) {
    const divisor = [2, 4, 5, 8][rand(0, 3)];
    const dividend = rand(divisor + 1, 99);
    if (dividend % divisor !== 0) {
      return { dvsr: String(divisor), dvnd: String(dividend), quot: dec(dividend / divisor), workRows: 5 };
    }
  }
}
