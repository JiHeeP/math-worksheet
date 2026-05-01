'use strict';

import { rand, randChoice, lcm } from '../../utils.js';
import { fracD, mixedD, numBlank, fracBlank, mixedBlank, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

/* ── 선수학습: 분모 같은 분수 (직접 렌더링) ── */

export function genU5PreAdd() {
  const d = rand(5, 12), a = rand(1, Math.floor(d / 2)), b = rand(1, d - a - 1);
  return htmlProblem('frac-row', `${fracD(a, d)} <span class="op-txt">+</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(a + b, d)}`);
}

export function genU5PreAddGe1() {
  const d = rand(3, 10);
  let a, b;
  do { a = rand(1, d - 1); b = rand(1, d - 1); } while (a + b < d);
  return htmlProblem('frac-row', `${fracD(a, d)} <span class="op-txt">+</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(a + b, d)}`);
}

export function genU5PreSub() {
  const d = rand(5, 12), b = rand(1, d - 2), a = rand(b + 1, d - 1);
  return htmlProblem('frac-row', `${fracD(a, d)} <span class="op-txt">\u2212</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(a - b, d)}`);
}

export function genU5PreMixedSub() {
  const d = rand(3, 10), w = rand(1, 3), wn = rand(0, d - 1), b = rand(1, d - 1);
  const totalNum = w * d + wn;
  if (totalNum <= b) return genU5PreMixedSub();
  return htmlProblem('frac-row', `${wn === 0 ? w : mixedD(w, wn, d)} <span class="op-txt">\u2212</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(totalNum - b, d)}`);
}

export function genU5PreMixedToImproperProcess() {
  const d = rand(2, 8), w = rand(1, 4), n = rand(1, d - 1), imp = w * d + n;
  return htmlProblem('concept-layout', `<div class="concept-card"><div class="concept-answer">${mixedD(w, n, d)} <span class="eq-txt">=</span> ${fracD(`${numBlank(w)} \u00d7 ${numBlank(d)} + ${numBlank(n)}`, d)} <span class="eq-txt">=</span> ${fracBlank(imp, d)}</div></div>`);
}

export function genU5PreMixedToImproper() {
  const d = rand(2, 8), w = rand(1, 4), n = rand(1, d - 1), imp = w * d + n;
  return htmlProblem('frac-row', `${mixedD(w, n, d)} <span class="eq-txt">=</span> ${fracBlank(imp, d)}`);
}

/* ── 본단원: 템플릿용 순수 데이터 제너레이터 ── */

export function genFracAddLt1() {
  let d1, d2, n1, n2, total, common;
  do {
    d1 = rand(2, 8); d2 = rand(2, 8);
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    common = lcm(d1, d2);
    total = (n1 * (common / d1)) + (n2 * (common / d2));
  } while (total >= common || d1 === d2);
  return { n1, d1, n2, d2, op: '+' };
}

export function genFracAddGe1() {
  let d1, d2, n1, n2, total, common;
  do {
    d1 = rand(2, 6); d2 = rand(2, 6);
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    common = lcm(d1, d2);
    total = (n1 * (common / d1)) + (n2 * (common / d2));
  } while (total < common || d1 === d2);
  return { n1, d1, n2, d2, op: '+' };
}

export function genFracSub() {
  let d1, d2, n1, n2, diff, common;
  do {
    d1 = rand(3, 8); d2 = rand(2, 7);
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    common = lcm(d1, d2);
    diff = (n1 * (common / d1)) - (n2 * (common / d2));
  } while (diff <= 0 || d1 === d2);
  return { n1, d1, n2, d2, op: '-' };
}

export function genMixedAddNoCarry() {
  let d1, d2;
  do { d1 = rand(2, 5); d2 = rand(2, 5); } while (d1 === d2);
  const w1 = rand(1, 3), w2 = rand(1, 3), n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
  const common = lcm(d1, d2);
  if (n1 * (common / d1) + n2 * (common / d2) >= common) return genMixedAddNoCarry();
  return { w1, n1, d1, w2, n2, d2, op: '+' };
}

export function genMixedAddCarry() {
  let d1, d2;
  do { d1 = rand(2, 5); d2 = rand(2, 5); } while (d1 === d2);
  const w1 = rand(1, 3), w2 = rand(1, 3), n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
  const common = lcm(d1, d2);
  if (n1 * (common / d1) + n2 * (common / d2) < common) return genMixedAddCarry();
  return { w1, n1, d1, w2, n2, d2, op: '+' };
}

export function genMixedSubNoBorrow() {
  const d1 = rand(2, 6), d2 = rand(2, 6), common = lcm(d1, d2);
  const n2 = rand(1, d2 - 1), n2c = n2 * (common / d2);
  const n1c = rand(n2c, common - 1), n1 = n1c / (common / d1);
  if (!Number.isInteger(n1) || n1 < 1 || n1 >= d1 || d1 === d2) return genMixedSubNoBorrow();
  const w2 = rand(1, 3), w1 = w2 + rand(1, 3);
  return { w1, n1, d1, w2, n2, d2, op: '-' };
}

export function genMixedSubBorrow() {
  const d1 = rand(2, 6), d2 = rand(2, 6), common = lcm(d1, d2);
  const n2 = rand(1, d2 - 1), n2c = n2 * (common / d2);
  const n1c = rand(1, Math.max(1, n2c - 1)), n1 = n1c / (common / d1);
  if (!Number.isInteger(n1) || n1 < 1 || n1 >= d1 || d1 === d2) return genMixedSubBorrow();
  const w2 = rand(1, 3), w1 = w2 + rand(1, 3);
  return { w1, n1, d1, w2, n2, d2, op: '-' };
}
