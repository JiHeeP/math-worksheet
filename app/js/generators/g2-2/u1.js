'use strict';

/**
 * 2학년 2학기 1단원 — 네 자리 수
 */

import { rand } from '../../utils.js';
import { numBlank, placeValueModelHtml, symBlank } from '../../helpers.js';
import { conceptProblem, htmlProblem, modelCountProblem } from '../../templates.js';

export function genG22U1ModelToNumber() {
  const th = rand(1, 9);
  const h = rand(0, 9);
  const t = rand(0, 9);
  const o = rand(0, 9);
  const n = th * 1000 + h * 100 + t * 10 + o;
  return modelCountProblem(placeValueModelHtml({ thousands: th, hundreds: h, tens: t, ones: o }), numBlank(n));
}

export function genG22U1PlaceValue() {
  const n = rand(1001, 9999);
  const th = Math.floor(n / 1000);
  const h = Math.floor((n % 1000) / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  return conceptProblem(`${n}은 천 ${numBlank(th)}개, 백 ${numBlank(h)}개, 십 ${numBlank(t)}개, 낱개 ${numBlank(o)}개입니다.`, '');
}

export function genG22U1Expanded() {
  const th = rand(1, 9);
  const h = rand(0, 9);
  const t = rand(0, 9);
  const o = rand(0, 9);
  const n = th * 1000 + h * 100 + t * 10 + o;
  return conceptProblem(`${th}000 + ${h}00 + ${t}0 + ${o} = ${numBlank(n)}`, '');
}

export function genG22U1Compare4d() {
  let a, b;
  do { a = rand(1000, 9999); b = rand(1000, 9999); } while (a === b);
  const ans = a > b ? '>' : '<';
  return htmlProblem('horiz-box', `${a} ${symBlank(ans)} ${b}`);
}
