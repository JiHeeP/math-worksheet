'use strict';

/**
 * 3학년 1학기 3단원 — 나눗셈 (곱셈과 나눗셈의 관계)
 * 성취기준 [4수01-05] 나눗셈의 의미를 알고, 곱셈과 나눗셈의 관계를 이해한다. (2022 개정)
 *
 * 곱셈구구 범위(2~9단, 2~9를 곱함)만 사용 → 몫은 항상 2~9 의 자연수.
 */

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

function stack(main, sub, keys) {
  const p = htmlProblem('stack-box',
    `<div class="stack-main">${main}</div><div class="stack-sub">${sub}</div>`);
  p.uniqueKeys = keys;
  return p;
}

/** 곱셈식 하나 → 나눗셈식 두 개 (예: 4 × 7 = 28 → 28 ÷ 4 = 7, 28 ÷ 7 = 4) */
export function genG31U3MulToDiv() {
  let a, b;
  do { a = rand(2, 9); b = rand(2, 9); } while (a === b);
  const p = a * b;
  return stack(
    `${a} × ${b} = ${p}`,
    `${p} ÷ ${a} = ${numBlank(b)}&nbsp;&nbsp;&nbsp;${p} ÷ ${b} = ${numBlank(a)}`,
    [`${a}x${b}`, `${b}x${a}`],
  );
}

/** 곱셈구구로 몫 구하기 (예: 4 × □ = 28 → 28 ÷ 4 = □) */
export function genG31U3DivByTimesTable() {
  const d = rand(2, 9), q = rand(2, 9), n = d * q;
  return stack(
    `${d} × ${numBlank(q)} = ${n}`,
    `${n} ÷ ${d} = ${numBlank(q)}`,
    [`${n}/${d}`],
  );
}
