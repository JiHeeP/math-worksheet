'use strict';

/**
 * 1학년 2학기 7단원 — 덧셈과 뺄셈(4)
 * 받아올림이 있는 (한 자리)+(한 자리),
 * 받아내림이 있는 (십몇)−(몇),
 * 받아올림이 있는 (두 자리)+(한 자리).
 *
 * 시각 풀이(가르기/체리) 는 Phase 3 에서 단계 풀이 템플릿으로 추가 예정.
 * 현재는 한 줄 풀이.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

// (한 자리) + (한 자리), 받아올림 있음 (a+b ≥ 10)
export function genG12U71d1dCarry() {
  let a, b;
  do { a = rand(2, 9); b = rand(2, 9); } while (a + b < 10);
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}

// (십몇) − (몇), 받아내림 있음 (일의 자리 < b)
export function genG12U7TeenBorrow() {
  let a, b;
  do { a = rand(11, 18); b = rand(2, 9); } while (a % 10 >= b);
  return horizProblem(`${a} − ${b}`, numBlank(a - b));
}

// (두 자리) + (한 자리), 받아올림 있음 (일의 자리 합 ≥ 10)
export function genG12U72d1dCarry() {
  let a, b;
  do { a = rand(10, 89); b = rand(2, 9); } while ((a % 10) + b < 10);
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}
