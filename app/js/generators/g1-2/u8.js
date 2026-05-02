'use strict';

/**
 * 1학년 2학기 8단원 — □가 사용된 식
 * 한 자리·두 자리 사칙에서 미지수 위치를 무작위로 변형.
 * 결과 범위는 1·2학기 학습 범위(약 0~18) 안.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

// □ 가 들어간 덧셈: a + b = result, 한 자리 합·받아올림 포함 가능
export function genG12U8BoxAdd() {
  const result = rand(5, 18);
  const a = rand(1, result - 1);
  const b = result - a;
  const blankIdx = rand(0, 2);
  let html;
  if (blankIdx === 0) html = `${numBlank(a)} + ${b} = ${result}`;
  else if (blankIdx === 1) html = `${a} + ${numBlank(b)} = ${result}`;
  else html = `${a} + ${b} = ${numBlank(result)}`;
  return htmlProblem('horiz-box', html);
}

// □ 가 들어간 뺄셈: a − b = result
export function genG12U8BoxSub() {
  const a = rand(5, 18);
  const b = rand(1, a - 1);
  const result = a - b;
  const blankIdx = rand(0, 2);
  let html;
  if (blankIdx === 0) html = `${numBlank(a)} − ${b} = ${result}`;
  else if (blankIdx === 1) html = `${a} − ${numBlank(b)} = ${result}`;
  else html = `${a} − ${b} = ${numBlank(result)}`;
  return htmlProblem('horiz-box', html);
}
