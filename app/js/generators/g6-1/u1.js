'use strict';

/**
 * 6학년 1학기 1단원 — 분수의 나눗셈
 */

import { rand } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_DIV = '<span class="op-txt">÷</span>';
const EQ = '<span class="eq-txt">=</span>';

export function genG61U1FracDivInt() {
  const d = rand(3, 12);
  const divisor = rand(2, 5);
  const n = rand(1, d - 1);
  return htmlProblem('frac-row', `${fracD(n, d)} ${OP_DIV} ${divisor} ${EQ} ${formulaResultHtml(n, d * divisor)}`);
}

export function genG61U1MixedDivInt() {
  const d = rand(3, 9);
  const w = rand(1, 3);
  const n = rand(1, d - 1);
  const divisor = rand(2, 5);
  const imp = w * d + n;
  return htmlProblem('frac-row', `${mixedD(w, n, d)} ${OP_DIV} ${divisor} ${EQ} ${formulaResultHtml(imp, d * divisor)}`);
}

export function genG61U1IntDivIntAsFrac() {
  const a = rand(2, 9);
  const b = rand(a + 1, 12);
  return htmlProblem('frac-row', `${a} ${OP_DIV} ${b} ${EQ} ${formulaResultHtml(a, b)}`);
}

/* ── 본단원: 템플릿용 순수 데이터 제너레이터 ── */

function properFracTerm(maxDen = 12) {
  const d = rand(3, maxDen);
  return { kind: 'frac', n: rand(1, d - 1), d };
}

function mixedTerm(maxDen = 9) {
  const d = rand(3, maxDen);
  return { kind: 'mixed', w: rand(1, 3), n: rand(1, d - 1), d };
}

function intTerm(min = 2, max = 9) {
  return { kind: 'int', value: rand(min, max) };
}

export function genG61U1IntDivIntAsFracStep() {
  const left = intTerm(2, 9);
  const right = intTerm(left.value + 1, 12);
  return { left, right };
}

export function genG61U1FracDivIntStep() {
  return { left: properFracTerm(), right: intTerm(2, 5) };
}

export function genG61U1MixedDivIntStep() {
  return { left: mixedTerm(), right: intTerm(2, 5) };
}
