'use strict';

/**
 * 2학년 2학기 2단원 — 곱셈구구
 *
 * 선택한 단 목록 안에서 곱셈구구 문제를 무작위로 만든다.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem, htmlProblem } from '../../templates.js';

function resolveGugudanDan(context = {}) {
  const dans = Array.isArray(context.gugudanDans)
    ? context.gugudanDans.filter((value) => Number.isInteger(value) && value >= 2 && value <= 9)
    : [];
  if (dans.length) return dans[rand(0, dans.length - 1)];

  const dan = Number(context.gugudanDan);
  return dan >= 2 && dan <= 9 ? dan : rand(2, 9);
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
