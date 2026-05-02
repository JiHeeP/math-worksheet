'use strict';

/**
 * 4학년 2학기 1단원 — 분수의 덧셈과 뺄셈(1)
 * 분모가 같은 분수의 사칙연산 (5학년에서 분모 다른 경우로 확장됨).
 */

import { rand } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_PLUS = '<span class="op-txt">+</span>';
const OP_MINUS = '<span class="op-txt">−</span>';
const EQ = '<span class="eq-txt">=</span>';

/* ── 1·2차시 (진분수) + (진분수) ── */

export function genG42U1AddLt1() {
  // 합이 1 미만 (a/d + b/d, a+b < d)
  const d = rand(5, 12);
  const a = rand(1, Math.floor(d / 2));
  const b = rand(1, d - a - 1);
  return htmlProblem('frac-row', `${fracD(a, d)} ${OP_PLUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(a + b, d)}`);
}

export function genG42U1AddGe1() {
  // 합이 1 이상 (가분수 또는 대분수 결과)
  const d = rand(3, 10);
  let a, b;
  do { a = rand(1, d - 1); b = rand(1, d - 1); } while (a + b < d);
  return htmlProblem('frac-row', `${fracD(a, d)} ${OP_PLUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(a + b, d)}`);
}

/* ── 3차시 (진분수) - (진분수) ── */

export function genG42U1Sub() {
  const d = rand(5, 12);
  const b = rand(1, d - 2);
  const a = rand(b + 1, d - 1);
  return htmlProblem('frac-row', `${fracD(a, d)} ${OP_MINUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(a - b, d)}`);
}

/* ── 4차시 1 - (진분수) ── */

export function genG42U11MinusFrac() {
  const d = rand(3, 12);
  const n = rand(1, d - 1);
  return htmlProblem('frac-row', `1 ${OP_MINUS} ${fracD(n, d)} ${EQ} ${formulaResultHtml(d - n, d)}`);
}

/* ── 5차시 (자연수) - (진분수) ── */

export function genG42U1IntMinusFrac() {
  const d = rand(3, 10);
  const n = rand(1, d - 1);
  const w = rand(2, 5);
  // w - n/d = (w-1) + (d-n)/d
  return htmlProblem('frac-row', `${w} ${OP_MINUS} ${fracD(n, d)} ${EQ} ${formulaResultHtml((w - 1) * d + (d - n), d)}`);
}

/* ── 6차시 (대분수) + (대분수), 받아올림 없음 ── */

export function genG42U1MixedAddNoCarry() {
  const d = rand(4, 10);
  let w1, w2, n1, n2;
  do {
    w1 = rand(1, 4); w2 = rand(1, 4);
    n1 = rand(1, d - 2); n2 = rand(1, d - 1 - n1);
  } while (n1 + n2 >= d);
  // 결과 = (w1+w2)와 (n1+n2)/d
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_PLUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 + w2) * d + (n1 + n2), d)}`);
}

/* ── 7차시 (대분수) + (대분수), 받아올림 있음 ── */

export function genG42U1MixedAddCarry() {
  const d = rand(3, 10);
  let w1, w2, n1, n2;
  do {
    w1 = rand(1, 4); w2 = rand(1, 4);
    n1 = rand(1, d - 1); n2 = rand(1, d - 1);
  } while (n1 + n2 < d);
  // 받아올림: (w1+w2+1)과 (n1+n2-d)/d
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_PLUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 + w2) * d + (n1 + n2), d)}`);
}

/* ── 8차시 (대분수) - (대분수), 받아내림 없음 ── */

export function genG42U1MixedSubNoBorrow() {
  const d = rand(4, 10);
  let w1, w2, n1, n2;
  do {
    w2 = rand(1, 3); w1 = rand(w2 + 1, w2 + 4);
    n2 = rand(1, d - 2); n1 = rand(n2 + 1, d - 1);
  } while (n1 <= n2 || w1 <= w2);
  // 결과 = (w1-w2)와 (n1-n2)/d
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_MINUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 - w2) * d + (n1 - n2), d)}`);
}

/* ── 9차시 (자연수) - (대분수) ── */

export function genG42U1IntMinusMixed() {
  const d = rand(3, 10);
  const n = rand(1, d - 1);
  const wm = rand(1, 3);
  const w = rand(wm + 1, wm + 4);
  // w - (wm과 n/d) = (w - wm - 1)와 (d - n)/d
  return htmlProblem('frac-row', `${w} ${OP_MINUS} ${mixedD(wm, n, d)} ${EQ} ${formulaResultHtml((w - wm - 1) * d + (d - n), d)}`);
}

/* ── 10차시 (대분수) - (대분수), 받아내림 있음 ── */

export function genG42U1MixedSubBorrow() {
  const d = rand(3, 10);
  let w1, w2, n1, n2;
  do {
    w2 = rand(1, 3); w1 = rand(w2 + 1, w2 + 4);
    n1 = rand(1, d - 2); n2 = rand(n1 + 1, d - 1);
  } while (n1 >= n2);
  // 받아내림: (w1-w2-1)과 (n1+d-n2)/d
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_MINUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 - w2 - 1) * d + (n1 + d - n2), d)}`);
}
