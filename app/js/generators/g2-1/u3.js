'use strict';

/**
 * 2학년 1학기 3단원 — 덧셈과 뺄셈(5)
 * 두 자리 ± 두 자리 (받아올림 0/1/2회), 두 자리 − 한 자리 받아내림.
 *
 * 받아올림/내림 시각 풀이는 Phase 3 에서 단계 풀이 템플릿으로 추가 예정.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem, horizProblem } from '../../templates.js';

function verticalPracticeProblem({ num1, num2, op, ans }) {
  return htmlProblem('origin-vertical-practice', `
    <div class="origin-calc-wrapper">
      <div class="origin-calc-box has-diagram">
        <div class="origin-row">${num1}</div>
        <div class="origin-operator-row"><span>${op}</span><span>${num2}</span></div>
        <div class="origin-answer-row" data-ans="${ans}">${ans}</div>
      </div>
      <div class="origin-diagram-box">
        <svg class="origin-branch-lines" viewBox="0 0 20 40" aria-hidden="true">
          <line x1="0" y1="20" x2="20" y2="5"></line>
          <line x1="0" y1="20" x2="20" y2="35"></line>
        </svg>
        <div class="origin-cherry-inputs">
          <div class="origin-input-circle"></div>
          <div class="origin-input-circle"></div>
        </div>
      </div>
    </div>
  `);
}

function verticalProblem(num1, num2, op, ans) {
  return { kind: 'vertical', num1, num2, op, ans };
}

function borrowPractice2Problem({ num1, num2, ans }) {
  const n1Tens = Math.floor(num1 / 10);
  const n1Units = num1 % 10;
  const n2Tens = Math.floor(num2 / 10);
  const n2Units = num2 % 10;
  const ansTens = Math.floor(ans / 10);
  const ansUnits = ans % 10;
  return htmlProblem('origin-borrow-v2', `
    <div class="origin-calc-layout-v2">
      <div class="origin-cell-v2" style="grid-column:3/4;">
        <div class="origin-borrow-box-v2" data-ans="10">10</div>
      </div>
      <div class="origin-red-bracket-v2"></div>
      <div class="origin-cell-v2" style="grid-column:2/3;">${n1Tens || ''}</div>
      <div class="origin-cell-v2" style="grid-column:3/4;">${n1Units}</div>
      <div class="origin-operator-v2 origin-cell-v2">−</div>
      <div class="origin-cell-v2" style="grid-column:2/3;">${n2Tens || ''}</div>
      <div class="origin-cell-v2" style="grid-column:3/4;">${n2Units}</div>
      <div class="origin-calc-line-v2"></div>
      <div class="origin-cell-v2 origin-answer-row-v2" style="grid-column:2/3;" data-ans="${ansTens || ''}">${ansTens || ''}</div>
      <div class="origin-cell-v2 origin-answer-row-v2" style="grid-column:3/4;" data-ans="${ansUnits}">${ansUnits}</div>
    </div>
  `);
}

/* ── (두 자리) + (두 자리) ── */

// 받아올림 없음: 일의 자리 합 < 10 AND 합 < 100
export function genG21U3Add2d2dNoCarry() {
  while (true) {
    const a = rand(10, 89);
    const b = rand(10, 89);
    if ((a % 10) + (b % 10) < 10 && a + b < 100) {
      return horizProblem(`${a} + ${b}`, numBlank(a + b));
    }
  }
}

// 받아올림 1회 (일의 자리 → 십의 자리), 합 < 100
export function genG21U3Add2d2dSingle() {
  while (true) {
    const a = rand(10, 89);
    const b = rand(10, 89);
    const hasUnitCarry = (a % 10) + (b % 10) >= 10;
    if (hasUnitCarry && a + b < 100) {
      return horizProblem(`${a} + ${b}`, numBlank(a + b));
    }
  }
}

export function genG21U3Add2d2dSingleVertical() {
  while (true) {
    const a = rand(10, 89);
    const b = rand(10, 89);
    const hasUnitCarry = (a % 10) + (b % 10) >= 10;
    if (hasUnitCarry && a + b < 100) {
      return verticalProblem(a, b, '+', a + b);
    }
  }
}

export function genG21U3Add2d2dSinglePractice() {
  while (true) {
    const a = rand(10, 89);
    const b = rand(10, 89);
    const hasUnitCarry = (a % 10) + (b % 10) >= 10;
    if (hasUnitCarry && a + b < 100) {
      return verticalPracticeProblem({ num1: a, num2: b, op: '+', ans: a + b });
    }
  }
}

// 받아올림 2회 (일의 자리·십의 자리 모두), 합 ≥ 100
export function genG21U3Add2d2dDouble() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(20, 99);
    const hasUnitCarry = (a % 10) + (b % 10) >= 10;
    if (hasUnitCarry && a + b >= 100) {
      return horizProblem(`${a} + ${b}`, numBlank(a + b));
    }
  }
}

export function genG21U3Add2d2dDoubleVertical() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(20, 99);
    const hasUnitCarry = (a % 10) + (b % 10) >= 10;
    if (hasUnitCarry && a + b >= 100) {
      return verticalProblem(a, b, '+', a + b);
    }
  }
}

// 혼합 (받아올림 횟수 무작위)
export function genG21U3Add2d2dMix() {
  const r = rand(1, 3);
  if (r === 1) return genG21U3Add2d2dNoCarry();
  if (r === 2) return genG21U3Add2d2dSingle();
  return genG21U3Add2d2dDouble();
}

export function genG21U3Add2d2dMixVertical() {
  const r = rand(1, 3);
  if (r === 1) {
    const p = genG21U3Add2d2dNoCarry();
    const match = p.html.match(/(\d+) \+ (\d+)/);
    const a = Number(match[1]), b = Number(match[2]);
    return verticalProblem(a, b, '+', a + b);
  }
  if (r === 2) return genG21U3Add2d2dSingleVertical();
  return genG21U3Add2d2dDoubleVertical();
}

/* ── (두 자리) − (두 자리) ── */

// 받아내림 없음: a > b, 일의 자리 ≥ 일의 자리
export function genG21U3Sub2d2dNoBorrow() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if ((a % 10) >= (b % 10)) {
      return horizProblem(`${a} − ${b}`, numBlank(a - b));
    }
  }
}

// 받아내림 있음: a > b, 일의 자리 < 일의 자리
export function genG21U3Sub2d2dBorrow() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if ((a % 10) < (b % 10)) {
      return horizProblem(`${a} − ${b}`, numBlank(a - b));
    }
  }
}

export function genG21U3Sub2d2dBorrowVertical() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if ((a % 10) < (b % 10)) {
      return verticalProblem(a, b, '−', a - b);
    }
  }
}

export function genG21U3Sub2d2dBorrowPractice() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if ((a % 10) < (b % 10)) {
      return verticalPracticeProblem({ num1: a, num2: b, op: '−', ans: a - b });
    }
  }
}

export function genG21U3Sub2d2dBorrowPractice2() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if ((a % 10) < (b % 10)) {
      return borrowPractice2Problem({ num1: a, num2: b, ans: a - b });
    }
  }
}

// 혼합
export function genG21U3Sub2d2dMix() {
  return rand(1, 2) === 1 ? genG21U3Sub2d2dNoBorrow() : genG21U3Sub2d2dBorrow();
}

export function genG21U3Sub2d2dMixVertical() {
  while (true) {
    const a = rand(20, 99);
    const b = rand(10, a - 1);
    if (rand(1, 2) === 1 || (a % 10) < (b % 10)) {
      return verticalProblem(a, b, '−', a - b);
    }
  }
}

/* ── (두 자리) − (한 자리), 받아내림 있음 ── */

export function genG21U3Sub2d1dBorrow() {
  while (true) {
    const a = rand(20, 98);
    const b = rand(2, 9);
    if ((a % 10) < b) {
      return horizProblem(`${a} − ${b}`, numBlank(a - b));
    }
  }
}

export function genG21U3Sub2d1dBorrowVertical() {
  while (true) {
    const a = rand(20, 98);
    const b = rand(2, 9);
    if ((a % 10) < b) {
      return verticalProblem(a, b, '−', a - b);
    }
  }
}

export function genG21U3Sub2d1dBorrowPractice() {
  while (true) {
    const a = rand(20, 98);
    const b = rand(2, 9);
    if ((a % 10) < b) {
      return verticalPracticeProblem({ num1: a, num2: b, op: '−', ans: a - b });
    }
  }
}

export function genG21U3Sub2d1dBorrowPractice2() {
  while (true) {
    const a = rand(20, 98);
    const b = rand(2, 9);
    if ((a % 10) < b) {
      return borrowPractice2Problem({ num1: a, num2: b, ans: a - b });
    }
  }
}

export function genG21U3Mix2dAll() {
  if (rand(1, 2) === 1) {
    return rand(1, 2) === 1 ? genG21U3Add2d2dSingle() : genG21U3Add2d2dDouble();
  }
  return genG21U3Sub2d2dBorrow();
}
