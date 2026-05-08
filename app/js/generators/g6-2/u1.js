'use strict';

/**
 * 6학년 2학기 1단원 — 분수의 나눗셈
 */

import { rand, properFracLimitsForStage, mixedWholeForStage } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_DIV = '<span class="op-txt">÷</span>';
const EQ = '<span class="eq-txt">=</span>';

function fracDenRange(ctx, dMinFloor = 3) {
  const { dMin, dMax } = properFracLimitsForStage(ctx.fractionStage || 2);
  return [Math.max(dMinFloor, dMin), dMax];
}

export function genG62U1FracDivFrac(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const d1 = rand(dLo, dHi);
  const n1 = rand(1, d1 - 1);
  const d2 = rand(dLo, dHi);
  const n2 = rand(1, d2 - 1);
  return htmlProblem('frac-row', `${fracD(n1, d1)} ${OP_DIV} ${fracD(n2, d2)} ${EQ} ${formulaResultHtml(n1 * d2, d1 * n2)}`);
}

export function genG62U1IntDivFrac(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const w = rand(1, 9);
  const d = rand(dLo, dHi);
  const n = rand(1, d - 1);
  return htmlProblem('frac-row', `${w} ${OP_DIV} ${fracD(n, d)} ${EQ} ${formulaResultHtml(w * d, n)}`);
}

export function genG62U1MixedDivFrac(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const d1 = rand(dLo, dHi);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  const w1 = rand(wMin, wMax);
  const n1 = rand(1, d1 - 1);
  const d2 = rand(dLo, dHi);
  const n2 = rand(1, d2 - 1);
  const imp1 = w1 * d1 + n1;
  return htmlProblem('frac-row', `${mixedD(w1, n1, d1)} ${OP_DIV} ${fracD(n2, d2)} ${EQ} ${formulaResultHtml(imp1 * d2, d1 * n2)}`);
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
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  return { kind: 'mixed', w: rand(wMin, wMax), n: rand(1, d - 1), d };
}

function intTerm() {
  return { kind: 'int', value: rand(1, 9) };
}

export function genG62U1FracDivFracStep(ctx = {}) {
  return { left: properFracTerm(ctx), right: properFracTerm(ctx) };
}

export function genG62U1IntDivFracStep(ctx = {}) {
  return { left: intTerm(), right: properFracTerm(ctx) };
}

export function genG62U1MixedDivFracStep(ctx = {}) {
  return { left: mixedTerm(ctx), right: properFracTerm(ctx) };
}
