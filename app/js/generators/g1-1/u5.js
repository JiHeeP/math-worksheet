'use strict';

/**
 * 1학년 1학기 5단원 — 50까지의 수
 */

import { rand } from '../../utils.js';
import { baseTenModelHtml, numBlank, symBlank } from '../../helpers.js';
import { conceptProblem, htmlProblem, modelCountProblem } from '../../templates.js';

export function genG11U5CountTo50() {
  const tens = rand(1, 4);
  const ones = rand(1, 9);
  const n = tens * 10 + ones;
  return modelCountProblem(baseTenModelHtml(tens, ones), numBlank(n));
}

export function genG11U5TensOnes() {
  const n = rand(11, 50);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return conceptProblem(`${n}은 십 ${numBlank(tens)}개, 낱개 ${numBlank(ones)}개입니다.`, '');
}

export function genG11U5CompareTo50() {
  let a, b;
  do { a = rand(10, 50); b = rand(10, 50); } while (a === b);
  const ans = a > b ? '>' : '<';
  return htmlProblem('horiz-box', `${a} ${symBlank(ans)} ${b}`);
}
