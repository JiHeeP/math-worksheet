'use strict';

/**
 * 4학년 2학기 1단원 — 분수의 덧셈과 뺄셈(1)
 * 분모가 같은 분수의 사칙연산.
 *
 * 받아올림/받아내림이 있는 학습지는 데이터 객체를 반환하고
 * catalog 에서 단계별 풀이 템플릿(T.sameMixedAddCarryStep 등)에 바인딩.
 * 단순한 학습지는 htmlProblem 으로 한 줄 직접 렌더링.
 */

import { rand } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_PLUS = '<span class="op-txt">+</span>';
const OP_MINUS = '<span class="op-txt">−</span>';
const EQ = '<span class="eq-txt">=</span>';

/* ── 1차시 (진분수)+(진분수), 합이 1 미만 ── */
export function genG42U1AddLt1() {
  const d = rand(5, 12);
  const a = rand(1, Math.floor(d / 2));
  const b = rand(1, d - a - 1);
  return htmlProblem('frac-row', `${fracD(a, d)} ${OP_PLUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(a + b, d)}`);
}

/* ── 2차시 (진분수)+(진분수), 합이 1 이상 (단계 풀이) ── */
export function genG42U1AddGe1() {
  const d = rand(3, 10);
  let a, b;
  do { a = rand(1, d - 1); b = rand(1, d - 1); } while (a + b < d);
  return { a, b, d };
}

/* ── 3차시 (진분수) - (진분수) ── */
export function genG42U1Sub() {
  const d = rand(5, 12);
  const b = rand(1, d - 2);
  const a = rand(b + 1, d - 1);
  return htmlProblem('frac-row', `${fracD(a, d)} ${OP_MINUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(a - b, d)}`);
}

/* ── 4차시 1 - (진분수) (단계 풀이) ── */
export function genG42U11MinusFrac() {
  const d = rand(3, 12);
  const n = rand(1, d - 1);
  return { n, d };
}

/* ── 5차시 (자연수) - (진분수) (단계 풀이) ── */
export function genG42U1IntMinusFrac() {
  const d = rand(3, 10);
  const n = rand(1, d - 1);
  const w = rand(2, 5);
  return { w, n, d };
}

/* ── 6차시 분모 같은 (대분수)+(대분수), 받아올림 없음 ── */
export function genG42U1MixedAddNoCarry() {
  const d = rand(4, 10);
  let w1, w2, n1, n2;
  do {
    w1 = rand(1, 4); w2 = rand(1, 4);
    n1 = rand(1, d - 2); n2 = rand(1, d - 1 - n1);
  } while (n1 + n2 >= d);
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_PLUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 + w2) * d + (n1 + n2), d)}`);
}

/* ── 7차시 분모 같은 (대분수)+(대분수), 받아올림 있음 (단계 풀이) ── */
export function genG42U1MixedAddCarry() {
  const d = rand(3, 10);
  let w1, w2, n1, n2;
  do {
    w1 = rand(1, 4); w2 = rand(1, 4);
    n1 = rand(1, d - 1); n2 = rand(1, d - 1);
  } while (n1 + n2 < d);
  return { w1, n1, w2, n2, d };
}

/* ── 8차시 분모 같은 (대분수)-(대분수), 받아내림 없음 ── */
export function genG42U1MixedSubNoBorrow() {
  const d = rand(4, 10);
  let w1, w2, n1, n2;
  do {
    w2 = rand(1, 3); w1 = rand(w2 + 1, w2 + 4);
    n2 = rand(1, d - 2); n1 = rand(n2 + 1, d - 1);
  } while (n1 <= n2 || w1 <= w2);
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_MINUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 - w2) * d + (n1 - n2), d)}`);
}

/* ── 9차시 (자연수) - (대분수) (단계 풀이) ── */
export function genG42U1IntMinusMixed() {
  const d = rand(3, 10);
  const n = rand(1, d - 1);
  const wm = rand(1, 3);
  const w = rand(wm + 1, wm + 4);
  return { w, wm, n, d };
}

/* ── 10차시 분모 같은 (대분수)-(대분수), 받아내림 있음 (단계 풀이) ── */
export function genG42U1MixedSubBorrow() {
  const d = rand(3, 10);
  let w1, w2, n1, n2;
  do {
    w2 = rand(1, 3); w1 = rand(w2 + 2, w2 + 5);  // w1 >= w2 + 2 to ensure w1-w2-1 >= 1
    n1 = rand(1, d - 2); n2 = rand(n1 + 1, d - 1);
  } while (n1 >= n2);
  return { w1, n1, w2, n2, d };
}
