'use strict';

/**
 * 1학년 2학기 1단원 — 100까지의 수
 */

import { rand } from '../../utils.js';
import { baseTenModelHtml, numBlank, symBlank } from '../../helpers.js';
import { conceptProblem, horizProblem, htmlProblem, modelCountProblem } from '../../templates.js';

export function genG12U1CountTo100() {
  const tens = rand(1, 9);
  const ones = rand(0, 9);
  const n = tens * 10 + ones;
  return modelCountProblem(baseTenModelHtml(tens, ones), numBlank(n));
}

export function genG12U1TensOnes() {
  const n = rand(20, 99);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return conceptProblem(`${n}은 십 ${numBlank(tens)}개, 낱개 ${numBlank(ones)}개입니다.`, '');
}

export function genG12U1BeforeAfter() {
  const n = rand(11, 98);
  return htmlProblem('horiz-box', `${numBlank(n - 1)}, ${n}, ${numBlank(n + 1)}`);
}

export function genG12U1CompareTo100() {
  let a, b;
  do { a = rand(10, 100); b = rand(10, 100); } while (a === b);
  const ans = a > b ? '>' : '<';
  return htmlProblem('horiz-box', `${a} ${symBlank(ans)} ${b}`);
}
