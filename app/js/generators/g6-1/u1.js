'use strict';

/**
 * 6학년 1학기 1단원 — 분수의 나눗셈
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

export function genG61U1FracDivInt(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const d = rand(dLo, dHi);
  const divisor = rand(2, 5);
  const n = rand(1, d - 1);
  return htmlProblem('frac-row', `${fracD(n, d)} ${OP_DIV} ${divisor} ${EQ} ${formulaResultHtml(n, d * divisor)}`);
}

export function genG61U1MixedDivInt(ctx = {}) {
  const [dLo, dHi] = fracDenRange(ctx, 3);
  const d = rand(dLo, dHi);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  const w = rand(wMin, wMax);
  const n = rand(1, d - 1);
  const divisor = rand(2, 5);
  const imp = w * d + n;
  return htmlProblem('frac-row', `${mixedD(w, n, d)} ${OP_DIV} ${divisor} ${EQ} ${formulaResultHtml(imp, d * divisor)}`);
}

export function genG61U1IntDivIntAsFrac(ctx = {}) {
  const [, dHi] = fracDenRange(ctx, 3);
  const a = rand(2, Math.min(9, Math.max(3, dHi - 1)));
  const b = rand(a + 1, Math.max(a + 1, dHi));
  return htmlProblem('frac-row', `${a} ${OP_DIV} ${b} ${EQ} ${formulaResultHtml(a, b)}`);
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

function intTerm(min = 2, max = 9) {
  return { kind: 'int', value: rand(min, max) };
}

export function genG61U1IntDivIntAsFracStep(ctx = {}) {
  const [, dHi] = fracDenRange(ctx, 3);
  const left = intTerm(2, Math.min(9, Math.max(3, dHi - 1)));
  const right = intTerm(left.value + 1, Math.max(left.value + 1, dHi));
  return { left, right };
}

export function genG61U1FracDivIntStep(ctx = {}) {
  return { left: properFracTerm(ctx), right: intTerm(2, 5) };
}

export function genG61U1MixedDivIntStep(ctx = {}) {
  return { left: mixedTerm(ctx), right: intTerm(2, 5) };
}
