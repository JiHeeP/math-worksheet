'use strict';

/**
 * 4학년 1학기 3단원 — 곱셈과 나눗셈 (단계별 추가분)
 * 성취기준 [4수01-04] 곱하는 수가 두 자리 수인 곱셈, [4수01-07] 나누는 수가 두 자리 수인 나눗셈,
 *          [4수01-08] 어림셈 (2022 개정)
 * 차시 순서 참고: 비상교육 비바샘 4-1 3단원 목록 (세 자리 수에 몇십 곱하기 → … → 몇십으로 나누기 → 몇십몇으로 나누기)
 *
 * 무결성: 몫은 1 이상의 자연수, 나머지는 0 이상 나누는 수 미만. 어림셈 답은 나누어떨어지게 만든다.
 */

import { rand, pickBalanced } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';
import { roundToUnit } from '../calc-steps.js';

/** (세 자리 수) × (몇십) (예: 314 × 20) */
export function genG41U3Mul3dTens() {
  let a;
  do { a = rand(101, 999); } while (a % 10 === 0);
  const b = rand(2, 9) * 10;
  return { num1: a, num2: b, op: '×', ans: a * b, uniqueKeys: [`${a}x${b}`] };
}

function div(dvsr, dvnd) {
  return {
    dvsr, dvnd, quot: Math.floor(dvnd / dvsr), rem: dvnd % dvsr, showRem: true,
    uniqueKeys: [`${dvnd}/${dvsr}`],
  };
}

/** 몇십으로 나누기 — 몫 한 자리, 나머지 있음·없음 번갈아 (예: 150 ÷ 30, 278 ÷ 40) */
export function genG41U3DivByTens(_ctx, problemIndex) {
  const withRem = pickBalanced('g41DivByTens', [false, true], problemIndex);
  const d = rand(2, 9) * 10;
  const q = rand(2, 9);
  const r = withRem ? rand(1, d - 1) : 0;
  return div(d, d * q + r);
}

/** 몇십몇으로 나누기 — 몫 한 자리, 나머지 있음·없음 번갈아 (예: 84 ÷ 21, 236 ÷ 47) */
export function genG41U3DivBy2dQuot1(_ctx, problemIndex) {
  const withRem = pickBalanced('g41DivBy2dQ1', [false, true], problemIndex);
  let d;
  do { d = rand(12, 98); } while (d % 10 === 0);
  const q = rand(2, 9);
  const r = withRem ? rand(1, d - 1) : 0;
  return div(d, d * q + r);
}

function stack(main, sub, keys) {
  const p = htmlProblem('stack-box',
    `<div class="stack-main">${main}</div><div class="stack-sub">${sub}</div>`);
  p.uniqueKeys = keys;
  return p;
}

/** 곱셈 어림셈: (세 자리 수) × (두 자리 수) 를 몇백 × 몇십으로 (예: 312 × 19 → 약 300 × 20 = 6000) */
export function genG41U3MulEstimate() {
  while (true) {
    const a = rand(110, 890), b = rand(11, 89);
    const ra = roundToUnit(a, 100), rb = roundToUnit(b, 10);
    if (ra === null || rb === null) continue;
    return stack(`${a} × ${b}`,
      `약 ${numBlank(ra)} × ${numBlank(rb)} = ${numBlank(ra * rb)}`, [`${a}x${b}`]);
  }
}

/**
 * 나눗셈 어림셈: (세 자리 수) ÷ (두 자리 수) 를 몇백 ÷ 몇십으로 (예: 612 ÷ 19 → 약 600 ÷ 20 = 30)
 * 어림한 식이 나누어떨어지는 경우만 출제.
 */
export function genG41U3DivEstimate() {
  while (true) {
    const rd = rand(2, 9) * 10;
    const rn = rand(2, 9) * 100;
    if (rn % rd !== 0) continue;
    const n = rn + rand(-40, 40);
    const d = rd + rand(-4, 4);
    if (roundToUnit(n, 100) !== rn || roundToUnit(d, 10) !== rd) continue;
    return stack(`${n} ÷ ${d}`,
      `약 ${numBlank(rn)} ÷ ${numBlank(rd)} = ${numBlank(rn / rd)}`, [`${n}/${d}`]);
  }
}

export const PDF_GENERATORS_G41_U3 = {
  mul_3d_tens: () => genG41U3Mul3dTens(),
  div_by_tens: (i) => genG41U3DivByTens({}, i),
  div_by_2d_q1: (i) => genG41U3DivBy2dQuot1({}, i),
};
