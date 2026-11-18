'use strict';

/**
 * 4학년 2학기 3단원 — 소수의 덧셈과 뺄셈
 */

import { rand, pickBalanced } from '../../utils.js';
import { numBlank, fracD } from '../../helpers.js';
import { horizProblem, conceptProblem } from '../../templates.js';

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

/* ================================================================
 * 소수 두·세 자리 수와 소수 사이의 관계 (2026-11-18 추가)
 * 성취기준 [4수01-13] 자릿값의 원리를 바탕으로 소수 두 자리 수와 소수 세 자리 수를 이해하고 읽고 쓸 수 있다.
 * 모든 값은 정수(천분의 몇)로 계산한 뒤 문자열로 바꾼다 (부동소수점 오차 방지).
 * ================================================================ */

/** 천분의 n → '2.345', '0.03', '4' 처럼 끝의 0을 지운 소수 문자열 */
function milli(n) {
  const whole = Math.floor(n / 1000);
  const frac = String(n % 1000).padStart(3, '0').replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : String(whole);
}

const PLACE_NAMES = ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'];
const PLACE_VALUES = [1000, 100, 10, 1];

/**
 * 소수 세 자리 수 알기 — 세 유형을 번갈아
 *   count : 0.001이 2345개인 수 → 2.345
 *   value : 1.234 에서 3이 나타내는 수 → 0.03
 *   digit : 4.586 의 소수 둘째 자리 숫자 → 8
 */
export function genG42U3ThousandthsPlace(_ctx, problemIndex) {
  const type = pickBalanced('g42Thousandths', ['count', 'value', 'digit'], problemIndex);
  let n;
  do { n = rand(1111, 9999); } while (String(n).includes('0') || new Set(String(n)).size < 4);
  const digits = String(n).split('').map(Number);
  let p;
  if (type === 'count') {
    p = conceptProblem(`0.001이 ${n}개인 수`, numBlank(milli(n)));
  } else {
    const pos = rand(1, 3);
    if (type === 'value') {
      p = conceptProblem(`${milli(n)}에서 ${digits[pos]}${[2, 4, 5, 9].includes(digits[pos]) ? '가' : '이'} 나타내는 수`,
        numBlank(milli(digits[pos] * PLACE_VALUES[pos])));
    } else {
      p = conceptProblem(`${milli(n)}의 ${PLACE_NAMES[pos]} 숫자`, numBlank(digits[pos]));
    }
  }
  p.uniqueKeys = [`${type}${n}`];
  return p;
}

/**
 * 소수 사이의 관계 — 10배·100배, 1/10·1/100 (예: 0.04의 10배, 3.6의 1/10)
 * 답이 소수 셋째 자리 안, 1000 미만이 되도록 고른다.
 */
export function genG42U3DecimalRelation(_ctx, problemIndex) {
  const type = pickBalanced('g42DecRelation', ['x10', 'x100', 'd10', 'd100'], problemIndex);
  const factor = type.endsWith('100') ? 100 : 10;
  const up = type.startsWith('x');
  while (true) {
    const n = rand(1, 9999);           // 천분의 n
    if (n % 10 === 0 && n % 1000 !== 0 && rand(0, 1)) continue; // 끝자리 0인 수는 덜 나오게
    const ans = up ? n * factor : n / factor;
    if (!Number.isInteger(ans) || ans < 1 || ans >= 1000000) continue;
    const label = up ? `${factor}배` : fracD(1, factor);
    const p = horizProblem(`${milli(n)}의 ${label}`, numBlank(milli(ans)));
    p.uniqueKeys = [`${n}${type}`];
    return p;
  }
}
