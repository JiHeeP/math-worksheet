'use strict';

/**
 * 2학년 2학기 2단원 — 곱셈구구
 *
 * 단별 학습지 분리 방식 (모달 X). 2~9단 8개 + 혼합 + 빈칸형 = 10개 학습지.
 * 카탈로그에서 makeGugudanGen(dan) 팩토리로 단별 generator 생성.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem, htmlProblem } from '../../templates.js';

function resolveGugudanDan(context = {}) {
  const dan = Number(context.gugudanDan);
  return dan >= 2 && dan <= 9 ? dan : rand(2, 9);
}

/**
 * 단을 매개변수로 받는 곱셈구구 generator 팩토리.
 * 카탈로그에서: 학습지('2단', makeGugudanGen(2), { id: '...' })
 */
export function makeGugudanGen(dan) {
  return function genGugudanFixed() {
    const m = rand(1, 9);
    return horizProblem(`${dan} × ${m}`, numBlank(dan * m));
  };
}

// 2~9단 무작위 혼합. 컨트롤이 연결된 학습지는 선택 단으로 고정된다.
export function genG22U2GugudanMix(context = {}) {
  const dan = resolveGugudanDan(context);
  const m = rand(1, 9);
  return horizProblem(`${dan} × ${m}`, numBlank(dan * m));
}

// 빈칸형: 피승수 또는 곱하는 수가 □
export function genG22U2GugudanBlank(context = {}) {
  const dan = resolveGugudanDan(context);
  const m = rand(1, 9);
  const result = dan * m;
  const blankIdx = rand(0, 1);
  let html;
  if (blankIdx === 0) {
    html = `${numBlank(dan)} × ${m} = ${result}`;
  } else {
    html = `${dan} × ${numBlank(m)} = ${result}`;
  }
  return htmlProblem('horiz-box', html);
}
