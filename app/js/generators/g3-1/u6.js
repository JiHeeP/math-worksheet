'use strict';

/**
 * 3학년 1학기 6단원 — 분수와 소수
 */

import { rand } from '../../utils.js';
import { fracD, numBlank, symBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

function dec(value) {
  return Number(value.toFixed(2)).toString();
}

export function genG31U6TenthsToDecimal() {
  const n = rand(1, 9);
  return htmlProblem('frac-row', `${fracD(n, 10)} = ${numBlank(dec(n / 10))}`);
}

export function genG31U6HundredthsToDecimal() {
  const n = rand(1, 99);
  return htmlProblem('frac-row', `${fracD(n, 100)} = ${numBlank(dec(n / 100))}`);
}

export function genG31U6DecimalToFraction() {
  const n = rand(1, 9);
  return htmlProblem('frac-row', `${dec(n / 10)} = ${fracD(numBlank(n), 10)}`);
}

export function genG31U6DecimalCompare() {
  let a, b;
  do { a = rand(1, 99); b = rand(1, 99); } while (a === b);
  const da = dec(a / 10);
  const db = dec(b / 10);
  const ans = a > b ? '>' : '<';
  return htmlProblem('horiz-box', `${da} ${symBlank(ans)} ${db}`);
}
