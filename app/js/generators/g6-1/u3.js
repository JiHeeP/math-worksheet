'use strict';

/**
 * 6학년 1학기 3단원 — 소수의 나눗셈
 */

import { rand } from '../../utils.js';

function dec(value) {
  return Number(value.toFixed(3)).toString();
}

// 나누어지는 수가 이름대로 소수 한 자리(두 자리) 수가 되게 한다.
// (divisor × q 가 10의 배수면 8 ÷ 8 = 1, 3 ÷ 5 = 0.6 처럼 자연수·자릿수가 다른 수가 나와 다시 뽑는다.)
function pickDecimalDividendParts() {
  let divisor, q;
  do {
    divisor = rand(2, 9);
    q = rand(2, 99);
  } while ((divisor * q) % 10 === 0);
  return { divisor, q };
}

export function genG61U3DecimalDivInt() {
  const { divisor, q } = pickDecimalDividendParts();
  const dividend = (divisor * q) / 10;
  return { dvsr: String(divisor), dvnd: dec(dividend), quot: dec(q / 10), workRows: 5 };
}

export function genG61U3DecimalDivIntHundredths() {
  const { divisor, q } = pickDecimalDividendParts();
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
