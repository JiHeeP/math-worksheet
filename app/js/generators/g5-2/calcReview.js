'use strict';

/**
 * 5학년 2학기 — 곱셈과 나눗셈 총연습 (세로셈 격자)
 *
 *   (두 자리 수) × (두 자리 수)
 *   (세 자리 수) ÷ (한 자리 수)  — 나머지 있음·없음 반반
 *   (세 자리 수) ÷ (두 자리 수)  — 나머지 있음·없음 반반
 *
 * 세로셈 격자(renderers.js 의 renderPdfMulLong / renderPdfDiv)가 그리는 순수 데이터만 반환.
 * 나머지 반반은 pickBalanced 로 문항 번호 기준 정확히 맞춘다.
 * showRem: 정답 보기에서 나눗셈 맨 아랫줄에 나머지(없으면 0)를 표시.
 */

import { rand, pickBalanced } from '../../utils.js';

/* ── (두 자리 수) × (두 자리 수) ──
   곱하는 수의 일의 자리가 0이면 첫 부분곱이 0 한 줄이 되어 빼고 출제. */
export function genG52CalcMul2d2d() {
  const a = rand(12, 99);
  let b;
  do { b = rand(12, 99); } while (b % 10 === 0);
  return { num1: a, num2: b, op: '×', ans: a * b };
}

/* ── 나눗셈 공통: 세 자리 피제수(100~999), 나머지 있음/없음 ── */
function makeDivision(dvsr, withRem) {
  const qMin = Math.max(2, Math.ceil(100 / dvsr));
  if (!withRem) {
    const quot = rand(qMin, Math.floor(999 / dvsr));
    return { dvsr, dvnd: dvsr * quot, quot, rem: 0, showRem: true };
  }
  const rem = rand(1, dvsr - 1);
  const quot = rand(qMin, Math.floor((999 - rem) / dvsr));
  return { dvsr, dvnd: dvsr * quot + rem, quot, rem, showRem: true };
}

/* ── (세 자리 수) ÷ (한 자리 수), 나머지 있음·없음 반반 ── */
export function genG52CalcDiv3d1d(_ctx, problemIndex) {
  const withRem = pickBalanced('calcDiv3d1d', [false, true], problemIndex);
  return makeDivision(rand(2, 9), withRem);
}

/* ── (세 자리 수) ÷ (두 자리 수), 나머지 있음·없음 반반 ──
   나누는 수 11~49: 몫이 한 자리(예: 156÷24)·두 자리(예: 572÷13) 모두 나오게. */
export function genG52CalcDiv3d2d(_ctx, problemIndex) {
  const withRem = pickBalanced('calcDiv3d2d', [false, true], problemIndex);
  let dvsr;
  do { dvsr = rand(11, 49); } while (dvsr % 10 === 0);
  return makeDivision(dvsr, withRem);
}

/* 세로셈 격자 렌더러용 (opType → generator). renderers.js 가 (문항 번호) 를 넘긴다. */
export const PDF_GENERATORS_CALC_REVIEW = {
  mul_2d2d_full: () => genG52CalcMul2d2d(),
  div_3d1d_mixrem: (problemIndex) => genG52CalcDiv3d1d({}, problemIndex),
  div_3d2d_mixrem: (problemIndex) => genG52CalcDiv3d2d({}, problemIndex),
};
