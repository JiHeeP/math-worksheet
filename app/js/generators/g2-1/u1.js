'use strict';

/**
 * 2학년 1학기 1단원 — 세 자리 수
 */

import { rand } from '../../utils.js';
import { numBlank, placeValueModelHtml, symBlank } from '../../helpers.js';
import { conceptProblem, horizProblem, htmlProblem, modelCountProblem } from '../../templates.js';

export function genG21U1ModelToNumber() {
  const h = rand(1, 9);
  const t = rand(0, 9);
  const o = rand(0, 9);
  const n = h * 100 + t * 10 + o;
  return modelCountProblem(placeValueModelHtml({ hundreds: h, tens: t, ones: o }), numBlank(n));
}

export function genG21U1HundredsTensOnes() {
  const n = rand(101, 999);
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  return conceptProblem(`${n}은 백 ${numBlank(h)}개, 십 ${numBlank(t)}개, 낱개 ${numBlank(o)}개입니다.`, '');
}

export function genG21U1Expanded() {
  const h = rand(1, 9);
  const t = rand(0, 9);
  const o = rand(0, 9);
  const n = h * 100 + t * 10 + o;
  return conceptProblem(`${h}00 + ${t}0 + ${o} = ${numBlank(n)}`, '');
}

export function genG21U1BeforeAfter() {
  const n = rand(101, 998);
  return htmlProblem('horiz-box', `${numBlank(n - 1)}, ${n}, ${numBlank(n + 1)}`);
}

export function genG21U1Compare3d() {
  let a, b;
  do { a = rand(100, 999); b = rand(100, 999); } while (a === b);
  const ans = a > b ? '>' : '<';
  return htmlProblem('horiz-box', `${a} ${symBlank(ans)} ${b}`);
}
