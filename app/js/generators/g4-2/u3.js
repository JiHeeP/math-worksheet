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

/* ── 자릿수가 다른 소수의 뺄셈 ──
 * 정수 단위(1/10, 1/100)로 뽑아서 계산 → 부동소수 오차 없음.
 * "소수 한 자리 수"는 소수 첫째 자리가 0이 아니고,
 * "소수 두 자리 수"는 소수 둘째 자리가 0이 아니도록 강제 (끝자리 0이 사라져 자릿수가 바뀌는 것 방지).
 * 결과는 항상 0보다 큼.
 */

function randNonZeroLast(min, max) {
  let v;
  do { v = rand(min, max); } while (v % 10 === 0);
  return v;
}

// (소수 두 자리 수) − (소수 한 자리 수)  예: 4.57 − 2.3
export function genG42U3DecimalSubHundredthsMinusTenths() {
  const b = randNonZeroLast(1, 89);              // 0.1 ~ 8.9 (1/10 단위)
  const a = randNonZeroLast(b * 10 + 1, 999);    // b보다 큰 0.01 ~ 9.99 (1/100 단위)
  return horizProblem(`${dec(a / 100)} − ${dec(b / 10)}`, numBlank(dec((a - b * 10) / 100)));
}

// (소수 한 자리 수) − (소수 두 자리 수)  예: 5.4 − 1.26
export function genG42U3DecimalSubTenthsMinusHundredths() {
  const a = randNonZeroLast(2, 99);              // 0.2 ~ 9.9 (1/10 단위)
  const b = randNonZeroLast(1, a * 10 - 1);      // a보다 작은 0.01 ~ (1/100 단위)
  return horizProblem(`${dec(a / 10)} − ${dec(b / 100)}`, numBlank(dec((a * 10 - b) / 100)));
}

// (자연수) − (소수 한 자리 수)  예: 7 − 2.6
export function genG42U3IntMinusTenths() {
  const n = rand(1, 9);
  const b = randNonZeroLast(1, n * 10 - 1);      // n보다 작은 소수 한 자리 수
  return horizProblem(`${n} − ${dec(b / 10)}`, numBlank(dec((n * 10 - b) / 10)));
}

// (자연수) − (소수 두 자리 수)  예: 6 − 3.48
export function genG42U3IntMinusHundredths() {
  const n = rand(1, 9);
  const b = randNonZeroLast(1, n * 100 - 1);     // n보다 작은 소수 두 자리 수
  return horizProblem(`${n} − ${dec(b / 100)}`, numBlank(dec((n * 100 - b) / 100)));
}
