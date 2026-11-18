'use strict';

/**
 * 3학년 2학기 2단원(이 repo 의 u3) — 나눗셈: 내림·나머지 단계별, 검산
 * 성취기준 [4수01-06] 나누는 수가 한 자리 수인 나눗셈, 몫과 나머지 (2022 개정)
 *
 * '내림' = 십의 자리를 나누고 남은 수를 일의 자리로 내려 계산하는 것.
 *   내림 없음: 십의 자리 숫자가 나누는 수로 나누어떨어짐 (예: 84 ÷ 4, 69 ÷ 3)
 *   내림 있음: 십의 자리 숫자가 나누어떨어지지 않음   (예: 72 ÷ 3, 50 ÷ 2)
 * 모든 문항: 몫은 두 자리(10 이상), 나머지는 0 이상 나누는 수 미만.
 * 세로셈 격자(renderers.js renderPdfDiv) 데이터 { dvsr, dvnd, quot, rem, showRem } 만 반환.
 */

import { rand, pickBalanced } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

function div(dvsr, dvnd, showRem = false) {
  return {
    dvsr, dvnd, quot: Math.floor(dvnd / dvsr), rem: dvnd % dvsr, showRem,
    uniqueKeys: [`${dvnd}/${dvsr}`],
  };
}

/** (몇십) ÷ (몇) — 내림 없음(60 ÷ 3)·내림 있음(50 ÷ 2) 번갈아, 나머지 없음 */
export function genG32U3DivTens(_ctx, problemIndex) {
  const bring = pickBalanced('g32DivTens', [false, true], problemIndex);
  while (true) {
    const d = rand(2, 9);
    const t = rand(2, 9);
    if (t < d) continue;
    const n = t * 10;
    if (n % d !== 0) continue;
    if ((t % d !== 0) === bring) return div(d, n);
  }
}

/**
 * (몇십몇) ÷ (몇)
 *   bring : 내림 있음 여부
 *   withRem: 나머지 있음 여부
 */
function genDiv2d1d(bring, withRem) {
  while (true) {
    const d = rand(2, 9);
    const n = rand(11, 99);
    if (n % 10 === 0) continue;
    const t = Math.floor(n / 10);
    if (t < d) continue; // 몫이 두 자리
    if ((t % d !== 0) !== bring) continue;
    if ((n % d !== 0) !== withRem) continue;
    return div(d, n, true);
  }
}

export function genG32U3Div2d1dNoBringNoRem() { return genDiv2d1d(false, false); }
export function genG32U3Div2d1dBringNoRem() { return genDiv2d1d(true, false); }
export function genG32U3Div2d1dNoBringRem() { return genDiv2d1d(false, true); }
export function genG32U3Div2d1dBringRem() { return genDiv2d1d(true, true); }

/** 나머지가 있는 나눗셈의 계산 결과가 맞는지 확인하기 (나누는 수 × 몫 + 나머지 = 나누어지는 수) */
export function genG32U3DivCheck() {
  while (true) {
    const d = rand(2, 9);
    const n = rand(11, 99);
    const q = Math.floor(n / d), r = n % d;
    if (r === 0 || q < 2) continue;
    const p = htmlProblem('stack-box',
      `<div class="stack-main">${n} ÷ ${d} = ${numBlank(q)} … ${numBlank(r)}</div>`
      + `<div class="stack-sub">확인: ${d} × ${numBlank(q)} + ${numBlank(r)} = ${n}</div>`);
    p.uniqueKeys = [`${n}/${d}`];
    return p;
  }
}

export const PDF_GENERATORS_G32_U3 = {
  div_tens_1d: (i) => genG32U3DivTens({}, i),
  div_2d1d_nb: () => genG32U3Div2d1dNoBringNoRem(),
  div_2d1d_b: () => genG32U3Div2d1dBringNoRem(),
  div_2d1d_nb_rem: () => genG32U3Div2d1dNoBringRem(),
  div_2d1d_b_rem: () => genG32U3Div2d1dBringRem(),
};
