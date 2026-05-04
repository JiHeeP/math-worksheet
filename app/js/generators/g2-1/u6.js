'use strict';

/**
 * 2학년 1학기 6단원 — 곱셈(1)
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { conceptProblem, horizProblem } from '../../templates.js';

const OP_TIMES = '<span class="op-txt">×</span>';

export function genG21U6RepeatedAdd() {
  const group = rand(2, 9);
  const count = rand(2, 5);
  const expr = Array.from({ length: count }, () => group).join(' + ');
  return horizProblem(expr, numBlank(group * count));
}

export function genG21U6GroupsToMul() {
  const group = rand(2, 9);
  const count = rand(2, 5);
  return conceptProblem(`${group}개씩 ${count}묶음`, `${group} ${OP_TIMES} ${count} = ${numBlank(group * count)}`);
}

export function genG21U6MulBasic() {
  const a = rand(2, 9);
  const b = rand(2, 5);
  return horizProblem(`${a} ${OP_TIMES} ${b}`, numBlank(a * b));
}
