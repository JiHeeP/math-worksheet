'use strict';

/**
 * 4학년 2학기 1단원 — 분수의 덧셈과 뺄셈(1)
 * 분모가 같은 분수의 사칙연산.
 *
 * 받아올림/받아내림이 있는 학습지는 데이터 객체를 반환하고
 * catalog 에서 단계별 풀이 템플릿(T.sameMixedAddCarryStep 등)에 바인딩.
 * 단순한 학습지는 htmlProblem 으로 한 줄 직접 렌더링.
 */

import { rand, properFracLimitsForStage, mixedWholeForStage } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_PLUS = '<span class="op-txt">+</span>';
const OP_MINUS = '<span class="op-txt">−</span>';
const EQ = '<span class="eq-txt">=</span>';
const FRAC_ADDSUB_ROW = 'frac-addsub-row';

// 4학년 학습지: 진분수 단계 [1, 2] 만 사용 (3단계 부담).
// 모든 분수가 같은 분모이므로 properFracLimitsForStage 적용.
function pickD(ctx, dMinFloor = 3) {
  const { dMin, dMax } = properFracLimitsForStage(ctx.fractionStage || 2);
  return rand(Math.max(dMinFloor, dMin), dMax);
}

/* ── 1차시 (진분수)+(진분수), 합이 1 미만 ── */
export function genG42U1AddLt1(ctx = {}) {
  const d = pickD(ctx, 5);
  const a = rand(1, Math.max(1, Math.floor(d / 2)));
  const b = rand(1, Math.max(1, d - a - 1));
  return htmlProblem('frac-row', `${fracD(a, d)} ${OP_PLUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(a + b, d)}`, FRAC_ADDSUB_ROW);
}

/* ── 2차시 (진분수)+(진분수), 합이 1 이상 (단계 풀이) ── */
export function genG42U1AddGe1(ctx = {}) {
  const d = pickD(ctx, 3);
  let a, b, tries = 0;
  do { a = rand(1, d - 1); b = rand(1, d - 1); tries++; } while (a + b < d && tries < 100);
  if (a + b < d) { a = d - 1; b = d - 1; }
  return { a, b, d };
}

/* ── 3차시 (진분수) - (진분수) ── */
export function genG42U1Sub(ctx = {}) {
  const d = pickD(ctx, 5);
  const b = rand(1, d - 2);
  const a = rand(b + 1, d - 1);
  return htmlProblem('frac-row', `${fracD(a, d)} ${OP_MINUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(a - b, d)}`, FRAC_ADDSUB_ROW);
}

/* ── 4차시 1 - (진분수) (단계 풀이) ── */
export function genG42U11MinusFrac(ctx = {}) {
  const d = pickD(ctx, 3);
  const n = rand(1, d - 1);
  return { n, d };
}

/* ── 5차시 (자연수) - (진분수) (단계 풀이) ── */
export function genG42U1IntMinusFrac(ctx = {}) {
  const d = pickD(ctx, 3);
  const n = rand(1, d - 1);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  const w = rand(Math.max(2, wMin), Math.max(2, wMax));
  return { w, n, d };
}

/* ── 6차시 분모 같은 (대분수)+(대분수), 받아올림 없음 ── */
export function genG42U1MixedAddNoCarry(ctx = {}) {
  const d = pickD(ctx, 4);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let w1, w2, n1, n2, tries = 0;
  do {
    w1 = rand(wMin, wMax); w2 = rand(wMin, wMax);
    n1 = rand(1, d - 2); n2 = rand(1, Math.max(1, d - 1 - n1));
    tries++;
  } while (n1 + n2 >= d && tries < 50);
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_PLUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 + w2) * d + (n1 + n2), d)}`, FRAC_ADDSUB_ROW);
}

/* ── 7차시 분모 같은 (대분수)+(대분수), 받아올림 있음 (단계 풀이) ── */
export function genG42U1MixedAddCarry(ctx = {}) {
  const d = pickD(ctx, 3);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let w1, w2, n1, n2, tries = 0;
  do {
    w1 = rand(wMin, wMax); w2 = rand(wMin, wMax);
    n1 = rand(1, d - 1); n2 = rand(1, d - 1);
    tries++;
  } while (n1 + n2 < d && tries < 50);
  return { w1, n1, w2, n2, d };
}

/* ── (대분수) − (진분수), 분모 같은 (받아내림 가능 — 결과는 양수 보장) ── */
export function genG42U1MixedSubFrac(ctx = {}) {
  const d = pickD(ctx, 3);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  const w = rand(wMin, wMax);
  const wn = rand(1, d - 1);
  const b = rand(1, d - 1);
  const num = w * d + wn;
  if (num <= b) return genG42U1MixedSubFrac(ctx);
  return htmlProblem('frac-row', `${mixedD(w, wn, d)} ${OP_MINUS} ${fracD(b, d)} ${EQ} ${formulaResultHtml(num - b, d)}`, FRAC_ADDSUB_ROW);
}

/* ── 8차시 분모 같은 (대분수)-(대분수), 받아내림 없음 ── */
export function genG42U1MixedSubNoBorrow(ctx = {}) {
  const d = pickD(ctx, 4);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let w1, w2, n1, n2, tries = 0;
  do {
    w2 = rand(wMin, wMax); w1 = rand(w2 + 1, w2 + 4);
    n2 = rand(1, d - 2); n1 = rand(n2 + 1, d - 1);
    tries++;
  } while ((n1 <= n2 || w1 <= w2) && tries < 50);
  return htmlProblem('frac-row', `${mixedD(w1, n1, d)} ${OP_MINUS} ${mixedD(w2, n2, d)} ${EQ} ${formulaResultHtml((w1 - w2) * d + (n1 - n2), d)}`, FRAC_ADDSUB_ROW);
}

/* ── 9차시 (자연수) - (대분수) (단계 풀이) ── */
export function genG42U1IntMinusMixed(ctx = {}) {
  const d = pickD(ctx, 3);
  const n = rand(1, d - 1);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  const wm = rand(wMin, wMax);
  const w = rand(wm + 1, wm + 4);
  return { w, wm, n, d };
}

/* ── 10차시 분모 같은 (대분수)-(대분수), 받아내림 있음 (단계 풀이) ── */
export function genG42U1MixedSubBorrow(ctx = {}) {
  const d = pickD(ctx, 3);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let w1, w2, n1, n2, tries = 0;
  do {
    w2 = rand(wMin, wMax); w1 = rand(w2 + 2, w2 + 5);
    n1 = rand(1, d - 2); n2 = rand(n1 + 1, d - 1);
    tries++;
  } while (n1 >= n2 && tries < 50);
  return { w1, n1, w2, n2, d };
}
