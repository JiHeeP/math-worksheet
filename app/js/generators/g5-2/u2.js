'use strict';

/**
 * 5학년 2학기 2단원 — 분수의 곱셈
 *
 * (분수)×(자연수), (자연수)×(분수), (분수)×(분수), (대분수)×(대분수).
 * 결과는 formulaResultHtml 이 약분/대분수 변환을 자동 처리.
 */

import { rand, properFracLimitsForStage, mixedWholeForStage } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_TIMES = '<span class="op-txt">×</span>';
const EQ = '<span class="eq-txt">=</span>';

/* ── 본단원 ── */

function fracDenRange(ctx, dMinFloor = 3) {
  const { dMin, dMax } = properFracLimitsForStage(ctx.fractionStage || 2);
  return [Math.max(dMinFloor, dMin), dMax];
}

function whole(ctx) {
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  return rand(wMin, wMax);
}

// (진분수) × (자연수): a/b × c
export function genG52U2FracTimesInt(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const b = rand(dLo, dHi);
  const a = rand(1, b - 1);
  const c = rand(2, 6);
  return htmlProblem('frac-row', `${fracD(a, b)} ${OP_TIMES} ${c} ${EQ} ${formulaResultHtml(a * c, b)}`, 'frac-mul-row');
}

// (대분수) × (자연수): (w·a/b) × c
export function genG52U2MixedTimesInt(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const b = rand(dLo, dHi);
  const w = whole(ctx);
  const a = rand(1, b - 1);
  const c = rand(2, 5);
  const num = (w * b + a) * c;
  return htmlProblem('frac-row', `${mixedD(w, a, b)} ${OP_TIMES} ${c} ${EQ} ${formulaResultHtml(num, b)}`, 'frac-mul-row');
}

// (자연수) × (진분수): c × a/b
export function genG52U2IntTimesFrac(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const b = rand(dLo, dHi);
  const a = rand(1, b - 1);
  const c = rand(2, 6);
  return htmlProblem('frac-row', `${c} ${OP_TIMES} ${fracD(a, b)} ${EQ} ${formulaResultHtml(a * c, b)}`, 'frac-mul-row');
}

// (자연수) × (대분수): c × (w·a/b)
export function genG52U2IntTimesMixed(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const b = rand(dLo, dHi);
  const w = whole(ctx);
  const a = rand(1, b - 1);
  const c = rand(2, 5);
  const num = (w * b + a) * c;
  return htmlProblem('frac-row', `${c} ${OP_TIMES} ${mixedD(w, a, b)} ${EQ} ${formulaResultHtml(num, b)}`, 'frac-mul-row');
}

// (단위분수) × (단위분수): 1/a × 1/b = 1/(a*b)
export function genG52U2UnitFracTimesUnitFrac(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 2);
  let a, b, tries = 0;
  do { a = rand(dLo, dHi); b = rand(dLo, dHi); tries++; } while (a === b && tries < 50);
  if (a === b) b = a + 1;
  return htmlProblem('frac-row', `${fracD(1, a)} ${OP_TIMES} ${fracD(1, b)} ${EQ} ${formulaResultHtml(1, a * b)}`, 'frac-mul-row');
}

// (진분수) × (진분수): a/b × c/d
export function genG52U2FracTimesFrac(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 2);
  const b1 = rand(dLo, dHi);
  const a1 = rand(1, b1 - 1);
  const b2 = rand(dLo, dHi);
  const a2 = rand(1, b2 - 1);
  return htmlProblem('frac-row', `${fracD(a1, b1)} ${OP_TIMES} ${fracD(a2, b2)} ${EQ} ${formulaResultHtml(a1 * a2, b1 * b2)}`, 'frac-mul-row');
}

// (대분수) × (대분수)
export function genG52U2MixedTimesMixed(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 2);
  const b1 = rand(dLo, Math.min(dHi, 7));
  const w1 = whole(ctx);
  const a1 = rand(1, b1 - 1);
  const b2 = rand(dLo, Math.min(dHi, 7));
  const w2 = whole(ctx);
  const a2 = rand(1, b2 - 1);
  const num = (w1 * b1 + a1) * (w2 * b2 + a2);
  const den = b1 * b2;
  return htmlProblem('frac-row', `${mixedD(w1, a1, b1)} ${OP_TIMES} ${mixedD(w2, a2, b2)} ${EQ} ${formulaResultHtml(num, den)}`, 'frac-mul-row');
}

/* ── 본단원: 템플릿용 순수 데이터 제너레이터 ── */

function properFracTerm(ctx, dMinFloor = 3) {
  const [dLo, dHi] = fracDenRange(ctx, dMinFloor);
  const d = rand(dLo, dHi);
  return { kind: 'frac', n: rand(1, d - 1), d };
}

function mixedTerm(ctx, dMinFloor = 3) {
  const [dLo, dHi] = fracDenRange(ctx, dMinFloor);
  const d = rand(dLo, dHi);
  return { kind: 'mixed', w: whole(ctx), n: rand(1, d - 1), d };
}

function intTerm() {
  return { kind: 'int', value: rand(2, 6) };
}

export function genG52U2FracTimesIntStep(ctx = {}) {
  return { left: properFracTerm(ctx), right: intTerm() };
}

export function genG52U2MixedTimesIntStep(ctx = {}) {
  return { left: mixedTerm(ctx), right: intTerm() };
}

export function genG52U2IntTimesFracStep(ctx = {}) {
  return { left: intTerm(), right: properFracTerm(ctx) };
}

export function genG52U2IntTimesMixedStep(ctx = {}) {
  return { left: intTerm(), right: mixedTerm(ctx) };
}

export function genG52U2UnitFracTimesUnitFracStep(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 2);
  let d1, d2, tries = 0;
  do { d1 = rand(dLo, dHi); d2 = rand(dLo, dHi); tries++; } while (d1 === d2 && tries < 50);
  if (d1 === d2) d2 = d1 + 1;
  return {
    left: { kind: 'frac', n: 1, d: d1 },
    right: { kind: 'frac', n: 1, d: d2 },
  };
}

export function genG52U2FracTimesFracStep(ctx = {}) {
  return { left: properFracTerm(ctx, 2), right: properFracTerm(ctx, 2) };
}

export function genG52U2MixedTimesMixedStep(ctx = {}) {
  return { left: mixedTerm(ctx, 2), right: mixedTerm(ctx, 2) };
}
