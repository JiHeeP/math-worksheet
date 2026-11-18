'use strict';

/**
 * 3학년 1학기 1단원 — 덧셈과 뺄셈 (세 자리 수)
 * 성취기준 [4수01-03] 세 자리 수의 덧셈과 뺄셈, [4수01-08] 어림셈 (2022 개정)
 *
 * 세로셈 격자(renderers.js renderPdfAddSub)가 그리는 데이터 { num1, num2, op, ans } 만 반환.
 * 단계: 받아올림 0·1·2·3번 / 받아내림 0·1·2번 / 0이 있는 수에서 받아내림.
 *
 * 수 범위·무결성
 *   두 수 모두 세 자리(100~999). 뺄셈은 a > b 라 답은 항상 1 이상.
 *   받아올림 0~2번은 합이 999 이하, 3번만 합이 네 자리(1000 이상).
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';
import { addCarryCount, subBorrowCount, roundToUnit } from '../calc-steps.js';

function addProblem(a, b) {
  return { num1: a, num2: b, op: '+', ans: a + b, uniqueKeys: [`${a}+${b}`] };
}

function subProblem(a, b) {
  return { num1: a, num2: b, op: '−', ans: a - b, uniqueKeys: [`${a}-${b}`] };
}

function genAddWithCarries(carries) {
  while (true) {
    const a = rand(100, 899);
    const b = rand(100, 899);
    const sum = a + b;
    if (carries < 3 && sum > 999) continue;
    if (carries === 3 && sum < 1000) continue;
    if (addCarryCount(a, b) === carries) return addProblem(a, b);
  }
}

export function genG31U1Add3dNoCarry() { return genAddWithCarries(0); }
export function genG31U1Add3dCarry1() { return genAddWithCarries(1); }
export function genG31U1Add3dCarry2() { return genAddWithCarries(2); }
export function genG31U1Add3dCarry3() { return genAddWithCarries(3); }

function genSubWithBorrows(borrows) {
  while (true) {
    const a = rand(200, 999);
    const b = rand(100, a - 1);
    if (subBorrowCount(a, b) === borrows) return subProblem(a, b);
  }
}

export function genG31U1Sub3dNoBorrow() { return genSubWithBorrows(0); }
export function genG31U1Sub3dBorrow1() { return genSubWithBorrows(1); }
export function genG31U1Sub3dBorrow2() { return genSubWithBorrows(2); }

/**
 * 0이 있는 수에서 받아내림 — 빼어지는 수의 십의 자리가 0 (예: 403 − 158, 500 − 267).
 * 일의 자리에서 받아내림이 필요해 백의 자리 → 십의 자리 → 일의 자리로 두 번 내려온다.
 */
export function genG31U1Sub3dZeroBorrow() {
  while (true) {
    const hundreds = rand(2, 9);
    const ones = rand(0, 8);
    const a = hundreds * 100 + ones;
    const bOnes = rand(ones + 1, 9);
    const b = rand(1, hundreds - 1) * 100 + rand(0, 9) * 10 + bOnes;
    if (b < 100 || b >= a) continue;
    return subProblem(a, b);
  }
}

/* ── 어림셈 [4수01-08]: 몇백으로 어림하여 계산하기 ── */

function estimateProblem(a, op, b, ra, rb, result) {
  const html = `<div class="stack-main">${a} ${op} ${b}</div>`
    + `<div class="stack-sub">약 ${numBlank(ra)} ${op} ${numBlank(rb)} = ${numBlank(result)}</div>`;
  const p = htmlProblem('stack-box', html);
  p.uniqueKeys = [`${a}${op}${b}`];
  return p;
}

/** 세 자리 수 덧셈·뺄셈을 가장 가까운 몇백으로 어림 (문항 번호 홀수 = 덧셈, 짝수 = 뺄셈) */
export function genG31U1Estimate3d(_ctx, problemIndex = rand(1, 2)) {
  const isAdd = problemIndex % 2 === 1;
  while (true) {
    const a = rand(110, 890);
    const b = rand(110, 890);
    const ra = roundToUnit(a, 100);
    const rb = roundToUnit(b, 100);
    if (ra === null || rb === null) continue;
    if (isAdd) return estimateProblem(a, '+', b, ra, rb, ra + rb);
    if (a > b && ra > rb) return estimateProblem(a, '−', b, ra, rb, ra - rb);
  }
}

/* 세로셈 격자 렌더러용 (opType → generator) */
export const PDF_GENERATORS_G31_U1 = {
  add_3d_c0: () => genG31U1Add3dNoCarry(),
  add_3d_c1: () => genG31U1Add3dCarry1(),
  add_3d_c2: () => genG31U1Add3dCarry2(),
  add_3d_c3: () => genG31U1Add3dCarry3(),
  sub_3d_b0: () => genG31U1Sub3dNoBorrow(),
  sub_3d_b1: () => genG31U1Sub3dBorrow1(),
  sub_3d_b2: () => genG31U1Sub3dBorrow2(),
  sub_3d_zero: () => genG31U1Sub3dZeroBorrow(),
};
