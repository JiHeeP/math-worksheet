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
import { numBlank, splitDiagramHtml } from '../../helpers.js';
import { htmlProblem, horizProblem } from '../../templates.js';

function verticalProblem(num1, num2, op, ans) {
  return { kind: 'vertical', num1, num2, op, ans };
}

function splitPracticeProblem({ num1, num2, ans, op }) {
  let left = `${num1}`;
  let right = `${num2}`;

  if (op === '+') {
    const need = 10 - (num1 % 10);
    const remain = num2 - need;
    right = splitDiagramHtml(num2, need, remain);
  } else {
    left = splitDiagramHtml(num1, 10, num1 - 10);
  }

  return htmlProblem('origin-horiz-practice', `
    <div class="origin-equation-row">
      <span class="origin-text-part">${left}</span>
      <span class="origin-text-part">${op}</span>
      <span class="origin-text-part">${right}</span>
      <span class="origin-text-part">=</span>
      <span class="origin-answer-box" data-ans="${ans}">${ans}</span>
    </div>
  `);
}

function cherryPracticeProblem({ num1, num2, op, ans }) {
  return htmlProblem('origin-vertical-practice', `
    <div class="origin-calc-wrapper">
      <div class="origin-calc-box has-diagram">
        <div class="origin-row">${num1}</div>
        <div class="origin-operator-row"><span>${op}</span><span>${num2}</span></div>
        <div class="origin-answer-row" data-ans="${ans}">${ans}</div>
      </div>
      <div class="origin-diagram-box">
        <svg class="origin-branch-lines" viewBox="0 0 28 104" aria-hidden="true">
          <line x1="0" y1="52" x2="28" y2="24"></line>
          <line x1="0" y1="52" x2="28" y2="80"></line>
        </svg>
        <div class="origin-cherry-inputs">
          <div class="origin-input-circle"></div>
          <div class="origin-input-circle"></div>
        </div>
      </div>
    </div>
  `);
}

/**
 * (한 자리) + (한 자리), 받아올림 — 가르기 가능한 케이스만.
 * 조건: a + b ≥ 11 (= 10 인 경우는 1-2 u6 "10이 되는 더하기" 영역)
 */
export function genG12U71d1dCarry() {
  let a, b;
  do { a = rand(2, 9); b = rand(2, 9); } while (a + b <= 10);
  return { a, b };
}

export function genG12U71d1dCarryHoriz() {
  const { a, b } = genG12U71d1dCarry();
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}

export function genG12U71d1dCarryHorizPractice() {
  const { a, b } = genG12U71d1dCarry();
  return splitPracticeProblem({ num1: a, num2: b, op: '+', ans: a + b });
}

export function genG12U71d1dCarryVertical() {
  const { a, b } = genG12U71d1dCarry();
  return verticalProblem(a, b, '+', a + b);
}

export function genG12U71d1dCarryPractice() {
  const { a, b } = genG12U71d1dCarry();
  return cherryPracticeProblem({ num1: a, num2: b, op: '+', ans: a + b });
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

export function genG12U7TeenBorrowHoriz() {
  const { a, b } = genG12U7TeenBorrow();
  return horizProblem(`${a} − ${b}`, numBlank(a - b));
}

export function genG12U7TeenBorrowHorizPractice() {
  const { a, b } = genG12U7TeenBorrow();
  return splitPracticeProblem({ num1: a, num2: b, op: '−', ans: a - b });
}

export function genG12U7TeenBorrowVertical() {
  const { a, b } = genG12U7TeenBorrow();
  return verticalProblem(a, b, '−', a - b);
}

export function genG12U7TeenBorrowPractice() {
  const { a, b } = genG12U7TeenBorrow();
  return cherryPracticeProblem({ num1: a, num2: b, op: '−', ans: a - b });
}

/**
 * (두 자리) + (한 자리), 받아올림 — 일의 자리 합이 11 이상이어야 가르기 두 부분 모두 ≥ 1.
 */
export function genG12U72d1dCarry() {
  let a, b;
  do { a = rand(10, 89); b = rand(2, 9); } while ((a % 10) + b <= 10);
  return { a, b };
}

export function genG12U72d1dCarryHorizPractice() {
  const { a, b } = genG12U72d1dCarry();
  return splitPracticeProblem({ num1: a, num2: b, op: '+', ans: a + b });
}

export function genG12U72d1dCarryVertical() {
  const { a, b } = genG12U72d1dCarry();
  return verticalProblem(a, b, '+', a + b);
}

export function genG12U72d1dCarryPractice() {
  const { a, b } = genG12U72d1dCarry();
  return cherryPracticeProblem({ num1: a, num2: b, op: '+', ans: a + b });
}

export function genG12U7CarryBorrowMix() {
  if (rand(1, 2) === 1) return genG12U71d1dCarryVertical();
  return genG12U7TeenBorrowVertical();
}
