'use strict';

/**
 * 6학년 2학기 1단원 — 분수의 나눗셈(5)
 */

import { rand } from '../../utils.js';
import { fracD, mixedD, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

const OP_DIV = '<span class="op-txt">÷</span>';
const EQ = '<span class="eq-txt">=</span>';

export function genG62U1FracDivFrac() {
  const d1 = rand(3, 9);
  const n1 = rand(1, d1 - 1);
  const d2 = rand(3, 9);
  const n2 = rand(1, d2 - 1);
  return htmlProblem('frac-row', `${fracD(n1, d1)} ${OP_DIV} ${fracD(n2, d2)} ${EQ} ${formulaResultHtml(n1 * d2, d1 * n2)}`);
}

export function genG62U1IntDivFrac() {
  const w = rand(1, 9);
  const d = rand(3, 9);
  const n = rand(1, d - 1);
  return htmlProblem('frac-row', `${w} ${OP_DIV} ${fracD(n, d)} ${EQ} ${formulaResultHtml(w * d, n)}`);
}

export function genG62U1MixedDivFrac() {
  const d1 = rand(3, 7);
  const w1 = rand(1, 3);
  const n1 = rand(1, d1 - 1);
  const d2 = rand(3, 7);
  const n2 = rand(1, d2 - 1);
  const imp1 = w1 * d1 + n1;
  return htmlProblem('frac-row', `${mixedD(w1, n1, d1)} ${OP_DIV} ${fracD(n2, d2)} ${EQ} ${formulaResultHtml(imp1 * d2, d1 * n2)}`);
}
