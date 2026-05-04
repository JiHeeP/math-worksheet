'use strict';

/**
 * 1학년 1학기 1단원 — 9까지의 수
 */

import { rand } from '../../utils.js';
import { numBlank, symBlank } from '../../helpers.js';
import { conceptProblem, horizProblem, htmlProblem } from '../../templates.js';

function dots(n) {
  return Array.from({ length: n }, () => '●').join(' ');
}

export function genG11U1CountTo9() {
  const n = rand(1, 9);
  return conceptProblem(dots(n), numBlank(n));
}

export function genG11U1NumberOrder() {
  const start = rand(1, 7);
  return htmlProblem('horiz-box', `${start}, ${start + 1}, ${numBlank(start + 2)}`);
}

export function genG11U1CompareTo9() {
  let a, b;
  do { a = rand(1, 9); b = rand(1, 9); } while (a === b);
  const ans = a > b ? '>' : '<';
  return htmlProblem('horiz-box', `${a} ${symBlank(ans)} ${b}`);
}
