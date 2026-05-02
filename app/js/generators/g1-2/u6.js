'use strict';

/**
 * 1학년 2학기 6단원 — 덧셈과 뺄셈(3)
 * 10이 되는 더하기 / 10에서 빼기. 빈칸 위치 무작위.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

// 10이 되는 더하기: a + b = 10, 빈칸 위치 무작위
export function genG12U6MakeTenAdd() {
  const a = rand(1, 9);
  const b = 10 - a;
  const blankIdx = rand(0, 2);
  let html;
  if (blankIdx === 0) html = `${numBlank(a)} + ${b} = 10`;
  else if (blankIdx === 1) html = `${a} + ${numBlank(b)} = 10`;
  else html = `${a} + ${b} = ${numBlank(10)}`;
  return htmlProblem('horiz-box', html);
}

// 10에서 빼기: 10 - n = m, 빈칸 위치 무작위
export function genG12U6MakeTenSub() {
  const b = rand(1, 9);
  const result = 10 - b;
  const blankIdx = rand(0, 2);
  let html;
  if (blankIdx === 0) html = `${numBlank(10)} − ${b} = ${result}`;
  else if (blankIdx === 1) html = `10 − ${numBlank(b)} = ${result}`;
  else html = `10 − ${b} = ${numBlank(result)}`;
  return htmlProblem('horiz-box', html);
}
