'use strict';

/**
 * 5학년 2학기 2단원 — 분수의 곱셈
 *
 * (분수)×(자연수), (자연수)×(분수), (분수)×(분수), (대분수)×(대분수).
 * 결과는 formulaResultHtml 이 약분/대분수 변환을 자동 처리.
 */

import { rand, randChoice } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_TIMES = '<span class="op-txt">×</span>';
const EQ = '<span class="eq-txt">=</span>';

/* ── 본단원 ── */

// (진분수) × (자연수): a/b × c
export function genG52U2FracTimesInt() {
  const b = rand(3, 9);
  const a = rand(1, b - 1);
  const c = rand(2, 6);
  return htmlProblem('frac-row', `${fracD(a, b)} ${OP_TIMES} ${c} ${EQ} ${formulaResultHtml(a * c, b)}`);
}

// (대분수) × (자연수): (w·a/b) × c
export function genG52U2MixedTimesInt() {
  const b = rand(3, 7);
  const w = rand(1, 3);
  const a = rand(1, b - 1);
  const c = rand(2, 5);
  // 가분수 변환 후 곱셈: ((w*b + a) / b) × c = ((w*b+a)*c) / b
  const num = (w * b + a) * c;
  return htmlProblem('frac-row', `${mixedD(w, a, b)} ${OP_TIMES} ${c} ${EQ} ${formulaResultHtml(num, b)}`);
}

// (자연수) × (진분수): c × a/b
export function genG52U2IntTimesFrac() {
  const b = rand(3, 9);
  const a = rand(1, b - 1);
  const c = rand(2, 6);
  return htmlProblem('frac-row', `${c} ${OP_TIMES} ${fracD(a, b)} ${EQ} ${formulaResultHtml(a * c, b)}`);
}

// (자연수) × (대분수): c × (w·a/b)
export function genG52U2IntTimesMixed() {
  const b = rand(3, 7);
  const w = rand(1, 3);
  const a = rand(1, b - 1);
  const c = rand(2, 5);
  const num = (w * b + a) * c;
  return htmlProblem('frac-row', `${c} ${OP_TIMES} ${mixedD(w, a, b)} ${EQ} ${formulaResultHtml(num, b)}`);
}

// (단위분수) × (단위분수): 1/a × 1/b = 1/(a*b)
export function genG52U2UnitFracTimesUnitFrac() {
  let a, b;
  do { a = rand(2, 9); b = rand(2, 9); } while (a === b);
  return htmlProblem('frac-row', `${fracD(1, a)} ${OP_TIMES} ${fracD(1, b)} ${EQ} ${formulaResultHtml(1, a * b)}`);
}

// (진분수) × (진분수): a/b × c/d
export function genG52U2FracTimesFrac() {
  const b1 = rand(2, 8);
  const a1 = rand(1, b1 - 1);
  const b2 = rand(2, 8);
  const a2 = rand(1, b2 - 1);
  return htmlProblem('frac-row', `${fracD(a1, b1)} ${OP_TIMES} ${fracD(a2, b2)} ${EQ} ${formulaResultHtml(a1 * a2, b1 * b2)}`);
}

// (대분수) × (대분수)
export function genG52U2MixedTimesMixed() {
  const b1 = rand(2, 5);
  const w1 = rand(1, 3);
  const a1 = rand(1, b1 - 1);
  const b2 = rand(2, 5);
  const w2 = rand(1, 3);
  const a2 = rand(1, b2 - 1);
  // 가분수 변환: ((w1*b1 + a1) / b1) × ((w2*b2 + a2) / b2)
  const num = (w1 * b1 + a1) * (w2 * b2 + a2);
  const den = b1 * b2;
  return htmlProblem('frac-row', `${mixedD(w1, a1, b1)} ${OP_TIMES} ${mixedD(w2, a2, b2)} ${EQ} ${formulaResultHtml(num, den)}`);
}

/* ── 본단원: 템플릿용 순수 데이터 제너레이터 ── */

function properFracTerm(maxDen = 9) {
  const d = rand(3, maxDen);
  return { kind: 'frac', n: rand(1, d - 1), d };
}

function mixedTerm(maxDen = 7) {
  const d = rand(3, maxDen);
  return { kind: 'mixed', w: rand(1, 3), n: rand(1, d - 1), d };
}

function intTerm() {
  return { kind: 'int', value: rand(2, 6) };
}

export function genG52U2FracMulStep() {
  const kind = randChoice(['frac_int', 'int_frac', 'frac_frac', 'mixed_int', 'int_mixed', 'mixed_mixed']);
  if (kind === 'frac_int') return { left: properFracTerm(), right: intTerm() };
  if (kind === 'int_frac') return { left: intTerm(), right: properFracTerm() };
  if (kind === 'frac_frac') return { left: properFracTerm(8), right: properFracTerm(8) };
  if (kind === 'mixed_int') return { left: mixedTerm(), right: intTerm() };
  if (kind === 'int_mixed') return { left: intTerm(), right: mixedTerm() };
  return { left: mixedTerm(5), right: mixedTerm(5) };
}
