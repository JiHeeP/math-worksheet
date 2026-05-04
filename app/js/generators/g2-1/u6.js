'use strict';

/**
 * 2학년 1학기 6단원 — 곱셈
 */

import { rand } from '../../utils.js';
import { escapeAttr } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem, htmlProblem } from '../../templates.js';

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
  const groupCols = Math.ceil(Math.sqrt(group));
  const dots = Array.from({ length: group }, () => '<span class="group-mul-dot" aria-hidden="true"></span>').join('');
  const groups = Array.from({ length: count }, (_, index) => (
    `<span class="group-mul-set" style="--group-cols:${groupCols}" aria-label="묶음 ${index + 1}">${dots}</span>`
  )).join('');
  const answer = `${group} × ${count} = ${group * count}`;

  return htmlProblem('concept-layout', `
    <div class="group-mul-card">
      <div class="group-mul-picture" aria-label="${group}개씩 ${count}묶음">${groups}</div>
      <div class="group-mul-answer-line" data-ans="${escapeAttr(answer)}">${answer}</div>
    </div>
  `);
}

export function genG21U6MulBasic() {
  const a = rand(2, 9);
  const b = rand(2, 5);
  return horizProblem(`${a} ${OP_TIMES} ${b}`, numBlank(a * b));
}
