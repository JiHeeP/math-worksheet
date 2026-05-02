'use strict';

/**
 * 1학년 2학기 7단원 — 덧셈과 뺄셈(4)
 * 받아올림이 있는 (한 자리)+(한 자리),
 * 받아내림이 있는 (십몇)−(몇),
 * 받아올림이 있는 (두 자리)+(한 자리).
 *
 * 모두 가르기 단계 풀이 템플릿(T.makeTenAddStep / T.teenBorrowStep /
 * T.twoDigitOneDigitCarryStep) 에 바인딩되어 3줄 풀이로 노출.
 */

import { rand } from '../../utils.js';

/**
 * (한 자리) + (한 자리), 받아올림 — 가르기 가능한 케이스만.
 * 조건: a + b ≥ 11 (= 10 인 경우는 1-2 u6 "10이 되는 더하기" 영역)
 */
export function genG12U71d1dCarry() {
  let a, b;
  do { a = rand(2, 9); b = rand(2, 9); } while (a + b <= 10);
  return { a, b };
}

/**
 * (십몇) − (몇), 받아내림.
 * 조건: a 는 11~18, 일의 자리 < b
 */
export function genG12U7TeenBorrow() {
  let a, b;
  do { a = rand(11, 18); b = rand(2, 9); } while (a % 10 >= b);
  return { a, b };
}

/**
 * (두 자리) + (한 자리), 받아올림 — 일의 자리 합이 11 이상이어야 가르기 두 부분 모두 ≥ 1.
 */
export function genG12U72d1dCarry() {
  let a, b;
  do { a = rand(10, 89); b = rand(2, 9); } while ((a % 10) + b <= 10);
  return { a, b };
}
