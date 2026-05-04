'use strict';

/**
 * 4학년 1학기 1단원 — 큰 수
 */

import { rand } from '../../utils.js';
import { numBlank, symBlank } from '../../helpers.js';
import { conceptProblem, htmlProblem } from '../../templates.js';

export function genG41U1TenThousands() {
  const man = rand(1, 99);
  const rest = rand(1, 9999);
  const n = man * 10000 + rest;
  return conceptProblem(`${man}만 ${rest} = ${numBlank(n)}`, '');
}

export function genG41U1PlaceValue() {
  const n = rand(10000, 999999);
  const place = [10000, 100000][rand(0, 1)];
  const digit = Math.floor(n / place) % 10;
  const label = place === 10000 ? '만' : '십만';
  return conceptProblem(`${n}에서 ${label}의 자리 숫자`, numBlank(digit));
}

export function genG41U1CompareBig() {
  let a, b;
  do { a = rand(10000, 999999); b = rand(10000, 999999); } while (a === b);
  const ans = a > b ? '>' : '<';
  return htmlProblem('horiz-box', `${a} ${symBlank(ans)} ${b}`);
}
