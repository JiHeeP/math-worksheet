'use strict';

/**
 * 템플릿 시스템
 *
 * 템플릿 = "풀이 과정을 어떻게 보여줄지" 정의하는 재사용 가능한 객체
 *
 * 사용법:
 *   1) 템플릿 선택 (또는 직접 정의)
 *   2) 제너레이터는 순수 데이터만 반환
 *   3) 카탈로그에서 템플릿 + 제너레이터 연결
 *
 * 예시:
 *   학습지('진분수 덧셈', T.fracLcdStep, genFracAdd)
 *   → genFracAdd()가 {n1, d1, n2, d2, op:'+'} 반환
 *   → T.fracLcdStep.render(data)가 풀이 과정 HTML 생성
 */

import { gcd, lcm, simplify } from './utils.js';
import {
  fracD, mixedD, numBlank, textBlank, symBlank, multiBlank,
  fracBlank, mixedBlank, formulaResultHtml,
  relationTableHtml, perimeterTriangleSvg, rectangleSvg,
  triangleSvg, parallelogramSvg, trapezoidSvg, rhombusSvg,
  unitGridSvg, splitDiagramHtml,
} from './helpers.js';

/* ================================================================
   저수준: 문제 객체 생성 함수
   ================================================================ */

export function htmlProblem(layout, html, itemClass = '') {
  return { kind: 'html', layout, html, itemClass };
}

export function horizProblem(expression, answerHtml) {
  return htmlProblem('horiz-box', `${expression} = ${answerHtml}`);
}

export function conceptProblem(question, answerHtml, note = '') {
  return htmlProblem('concept-layout', `
    <div class="concept-card">
      <div class="concept-question">${question}</div>
      <div class="concept-answer">${answerHtml}</div>
      ${note ? `<div class="small-note">${note}</div>` : ''}
    </div>
  `);
}

export function modelCountProblem(modelHtml, answerHtml) {
  return htmlProblem('concept-layout', `
    <div class="concept-card model-count-card">
      <div class="concept-question">${modelHtml}</div>
      <div class="concept-answer">${answerHtml}</div>
    </div>
  `);
}

export function relationProblem(question, tableHtml, answerHtml = '', note = '') {
  return htmlProblem('relation-layout', `
    <div class="relation-card">
      <div class="relation-question">${question}</div>
      ${tableHtml}
      ${answerHtml ? `<div class="concept-answer">${answerHtml}</div>` : ''}
      ${note ? `<div class="small-note">${note}</div>` : ''}
    </div>
  `);
}

export function shapeProblem(svg, prompt, answerHtml, note = '') {
  return htmlProblem('shape-layout', `
    <div class="shape-card">
      ${svg}
      ${prompt ? `<div class="shape-question">${prompt}</div>` : ''}
      <div class="shape-answer">${answerHtml}</div>
      ${note ? `<div class="small-note">${note}</div>` : ''}
    </div>
  `);
}

function fracStepProblem(stepsHtml) {
  return htmlProblem('concept-layout', `
    <div class="concept-card">
      <div class="concept-answer frac-step-flow">${stepsHtml}</div>
    </div>
  `);
}

function fracStepProblemMultiLine({ line1, line2, line3 }) {
  return htmlProblem('concept-layout', `
    <div class="concept-card frac-multi-line">
      <div class="concept-answer frac-step-flow">${line1}</div>
      <div class="concept-answer frac-step-flow">${line2}</div>
      <div class="concept-answer frac-step-flow">${line3}</div>
    </div>
  `);
}

/* ================================================================
   중간 레벨: 풀이 과정 조립기 (step composers)
   ================================================================ */

function fracExpand(n, d, m) {
  return fracD(`${n} \u00d7 ${numBlank(m)}`, `${d} \u00d7 ${numBlank(m)}`);
}

/** 진분수 통분 덧셈 과정 (1줄) */
function inlineFracAdd(n1, d1, n2, d2) {
  const common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2;
  const cn1 = n1 * m1, cn2 = n2 * m2;
  const total = cn1 + cn2;
  let s = `${fracD(n1, d1)} <span class="op-txt">+</span> ${fracD(n2, d2)}`;
  if (m1 !== 1 || m2 !== 1) {
    s += ` <span class="eq-txt">=</span> ${fracExpand(n1, d1, m1)} <span class="op-txt">+</span> ${fracExpand(n2, d2, m2)}`;
    s += ` <span class="eq-txt">=</span> ${fracD(numBlank(cn1), common)} <span class="op-txt">+</span> ${fracD(numBlank(cn2), common)}`;
  }
  s += ` <span class="eq-txt">=</span> ${formulaResultHtml(total, common)}`;
  return s;
}

/** 진분수 통분 뺄셈 과정 (1줄) */
function inlineFracSub(n1, d1, n2, d2) {
  const common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2;
  const cn1 = n1 * m1, cn2 = n2 * m2;
  const diff = cn1 - cn2;
  let s = `${fracD(n1, d1)} <span class="op-txt">\u2212</span> ${fracD(n2, d2)}`;
  if (m1 !== 1 || m2 !== 1) {
    s += ` <span class="eq-txt">=</span> ${fracExpand(n1, d1, m1)} <span class="op-txt">\u2212</span> ${fracExpand(n2, d2, m2)}`;
    s += ` <span class="eq-txt">=</span> ${fracD(numBlank(cn1), common)} <span class="op-txt">\u2212</span> ${fracD(numBlank(cn2), common)}`;
  }
  s += ` <span class="eq-txt">=</span> ${formulaResultHtml(diff, common)}`;
  return s;
}

/** 대분수 덧셈 - 가분수 변환 방식 (1줄) */
function inlineMixedAddImproper(w1, n1, d1, w2, n2, d2) {
  const imp1 = w1 * d1 + n1, imp2 = w2 * d2 + n2;
  const common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2;
  const cn1 = imp1 * m1, cn2 = imp2 * m2;
  const total = cn1 + cn2;
  let s = `${mixedD(w1, n1, d1)} <span class="op-txt">+</span> ${mixedD(w2, n2, d2)}`;
  s += ` <span class="eq-txt">=</span> ${fracD(numBlank(imp1), d1)} <span class="op-txt">+</span> ${fracD(numBlank(imp2), d2)}`;
  if (m1 !== 1 || m2 !== 1) {
    s += ` <span class="eq-txt">=</span> ${fracD(numBlank(cn1), common)} <span class="op-txt">+</span> ${fracD(numBlank(cn2), common)}`;
  }
  s += ` <span class="eq-txt">=</span> ${formulaResultHtml(total, common)}`;
  return s;
}

/** 대분수 덧셈 - 자연수/분수 따로 (3줄) */
function inlineMixedAddSeparate(w1, n1, d1, w2, n2, d2) {
  const common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2;
  const cn1 = n1 * m1, cn2 = n2 * m2;
  const fracSum = cn1 + cn2;
  const wholeSum = w1 + w2;

  const line1 = `${mixedD(w1, n1, d1)} <span class="op-txt">+</span> ${mixedD(w2, n2, d2)}`;
  const line2 = `<span class="eq-txt">=</span> (${numBlank(w1)} + ${numBlank(w2)}) + (${fracExpand(n1, d1, m1)} <span class="op-txt">+</span> ${fracExpand(n2, d2, m2)})`;

  let line3 = `<span class="eq-txt">=</span> ${numBlank(wholeSum)} + ${fracD(numBlank(fracSum), common)}`;
  if (fracSum >= common) {
    const extraWhole = Math.floor(fracSum / common);
    const remain = fracSum % common;
    const finalWhole = wholeSum + extraWhole;
    if (remain === 0) {
      line3 += ` <span class="eq-txt">=</span> ${numBlank(finalWhole)}`;
    } else {
      const [sn, sd] = simplify(remain, common);
      line3 += ` <span class="eq-txt">=</span> ${mixedBlank(finalWhole, sn, sd)}`;
    }
  } else {
    const [sn, sd] = simplify(fracSum, common);
    line3 += ` <span class="eq-txt">=</span> ${mixedBlank(wholeSum, sn, sd)}`;
  }
  return { line1, line2, line3 };
}

/** 대분수 뺄셈 - 가분수 변환 방식 (1줄) */
function inlineMixedSubImproper(w1, n1, d1, w2, n2, d2) {
  const imp1 = w1 * d1 + n1, imp2 = w2 * d2 + n2;
  const common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2;
  const cn1 = imp1 * m1, cn2 = imp2 * m2;
  const diff = cn1 - cn2;
  let s = `${mixedD(w1, n1, d1)} <span class="op-txt">\u2212</span> ${mixedD(w2, n2, d2)}`;
  s += ` <span class="eq-txt">=</span> ${fracD(numBlank(imp1), d1)} <span class="op-txt">\u2212</span> ${fracD(numBlank(imp2), d2)}`;
  if (m1 !== 1 || m2 !== 1) {
    s += ` <span class="eq-txt">=</span> ${fracD(numBlank(cn1), common)} <span class="op-txt">\u2212</span> ${fracD(numBlank(cn2), common)}`;
  }
  s += ` <span class="eq-txt">=</span> ${formulaResultHtml(diff, common)}`;
  return s;
}

/** 대분수 뺄셈 - 자연수/분수 따로 (3줄) */
function inlineMixedSubSeparate(w1, n1, d1, w2, n2, d2) {
  const common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2;
  const cn1 = n1 * m1, cn2 = n2 * m2;

  const line1 = `${mixedD(w1, n1, d1)} <span class="op-txt">\u2212</span> ${mixedD(w2, n2, d2)}`;
  let line2, line3;

  if (cn1 >= cn2) {
    const fracDiff = cn1 - cn2;
    const wholeDiff = w1 - w2;
    line2 = `<span class="eq-txt">=</span> (${numBlank(w1)} \u2212 ${numBlank(w2)}) + (${fracExpand(n1, d1, m1)} <span class="op-txt">\u2212</span> ${fracExpand(n2, d2, m2)})`;
    line3 = `<span class="eq-txt">=</span> ${numBlank(wholeDiff)} + ${fracD(numBlank(fracDiff), common)}`;
    if (fracDiff === 0) {
      line3 += ` <span class="eq-txt">=</span> ${numBlank(wholeDiff)}`;
    } else {
      const [sn, sd] = simplify(fracDiff, common);
      if (wholeDiff === 0) {
        line3 += ` <span class="eq-txt">=</span> ${fracBlank(sn, sd)}`;
      } else {
        line3 += ` <span class="eq-txt">=</span> ${mixedBlank(wholeDiff, sn, sd)}`;
      }
    }
  } else {
    const borrowedN1 = cn1 + common;
    const fracDiff = borrowedN1 - cn2;
    const wholeDiff = w1 - w2 - 1;
    line2 = `<span class="eq-txt">=</span> (${numBlank(w1 - 1)} \u2212 ${numBlank(w2)}) + (${fracD(numBlank(borrowedN1), common)} <span class="op-txt">\u2212</span> ${fracD(numBlank(cn2), common)})`;
    line3 = `<span class="eq-txt">=</span> ${numBlank(wholeDiff)} + ${fracD(numBlank(fracDiff), common)}`;
    if (fracDiff === 0) {
      line3 += ` <span class="eq-txt">=</span> ${numBlank(wholeDiff)}`;
    } else {
      const [sn, sd] = simplify(fracDiff, common);
      if (wholeDiff === 0) {
        line3 += ` <span class="eq-txt">=</span> ${fracBlank(sn, sd)}`;
      } else {
        line3 += ` <span class="eq-txt">=</span> ${mixedBlank(wholeDiff, sn, sd)}`;
      }
    }
  }
  return { line1, line2, line3 };
}

/* ── 분모 같은 분수 받아올림/받아내림 단계 풀이 (4-2용) ── */

/** (진분수)+(진분수), 합이 1 이상 — 가분수 → 대분수 변환 단계 */
function inlineSameFracAddGe1(a, b, d) {
  const sum = a + b;
  const whole = Math.floor(sum / d);
  const remain = sum % d;
  let s = `${fracD(a, d)} <span class="op-txt">+</span> ${fracD(b, d)}`;
  s += ` <span class="eq-txt">=</span> ${fracD(numBlank(sum), d)}`;
  if (remain === 0) {
    s += ` <span class="eq-txt">=</span> ${numBlank(whole)}`;
  } else {
    s += ` <span class="eq-txt">=</span> ${mixedBlank(whole, remain, d)}`;
  }
  return s;
}

/** 1 − (진분수): 1 = d/d 변환 단계 */
function inline1MinusFrac(n, d) {
  let s = `1 <span class="op-txt">−</span> ${fracD(n, d)}`;
  s += ` <span class="eq-txt">=</span> ${fracBlank(d, d)} <span class="op-txt">−</span> ${fracD(n, d)}`;
  s += ` <span class="eq-txt">=</span> ${formulaResultHtml(d - n, d)}`;
  return s;
}

/** (자연수) − (진분수): 자연수에서 1 받아내림 */
function inlineIntMinusFrac(w, n, d) {
  let s = `${w} <span class="op-txt">−</span> ${fracD(n, d)}`;
  s += ` <span class="eq-txt">=</span> ${mixedBlank(w - 1, d, d)} <span class="op-txt">−</span> ${fracD(n, d)}`;
  s += ` <span class="eq-txt">=</span> ${mixedBlank(w - 1, d - n, d)}`;
  return s;
}

/** (자연수) − (대분수): 자연수에서 1 받아내림 */
function inlineIntMinusMixed(w, wm, n, d) {
  const wholeDiff = w - wm - 1;
  let s = `${w} <span class="op-txt">−</span> ${mixedD(wm, n, d)}`;
  s += ` <span class="eq-txt">=</span> ${mixedBlank(w - 1, d, d)} <span class="op-txt">−</span> ${mixedD(wm, n, d)}`;
  if (wholeDiff === 0) {
    s += ` <span class="eq-txt">=</span> ${fracBlank(d - n, d)}`;
  } else {
    s += ` <span class="eq-txt">=</span> ${mixedBlank(wholeDiff, d - n, d)}`;
  }
  return s;
}

/** 분모 같은 (대분수)+(대분수), 받아올림 있음 — 자연수·분수 따로 (3줄) */
function inlineSameMixedAddCarry(w1, n1, w2, n2, d) {
  const fracSum = n1 + n2;
  const wholeSum = w1 + w2;
  const extraWhole = Math.floor(fracSum / d);
  const remain = fracSum % d;
  const finalWhole = wholeSum + extraWhole;

  const line1 = `${mixedD(w1, n1, d)} <span class="op-txt">+</span> ${mixedD(w2, n2, d)}`;
  const line2 = `<span class="eq-txt">=</span> (${numBlank(w1)} + ${numBlank(w2)}) + (${fracD(n1, d)} <span class="op-txt">+</span> ${fracD(n2, d)})`;
  let line3 = `<span class="eq-txt">=</span> ${numBlank(wholeSum)} + ${fracD(numBlank(fracSum), d)}`;
  if (remain === 0) {
    line3 += ` <span class="eq-txt">=</span> ${numBlank(finalWhole)}`;
  } else {
    line3 += ` <span class="eq-txt">=</span> ${mixedBlank(finalWhole, remain, d)}`;
  }
  return { line1, line2, line3 };
}

/** 분모 같은 (대분수)−(대분수), 받아내림 있음 — 자연수·분수 따로 (3줄) */
function inlineSameMixedSubBorrow(w1, n1, w2, n2, d) {
  const borrowedN1 = n1 + d;
  const fracDiff = borrowedN1 - n2;
  const wholeDiff = w1 - w2 - 1;

  const line1 = `${mixedD(w1, n1, d)} <span class="op-txt">−</span> ${mixedD(w2, n2, d)}`;
  const line2 = `<span class="eq-txt">=</span> (${numBlank(w1 - 1)} − ${numBlank(w2)}) + (${fracD(numBlank(borrowedN1), d)} <span class="op-txt">−</span> ${fracD(n2, d)})`;
  let line3 = `<span class="eq-txt">=</span> ${numBlank(wholeDiff)} + ${fracD(numBlank(fracDiff), d)}`;
  if (fracDiff === 0) {
    line3 += ` <span class="eq-txt">=</span> ${numBlank(wholeDiff)}`;
  } else if (wholeDiff === 0) {
    line3 += ` <span class="eq-txt">=</span> ${fracBlank(fracDiff, d)}`;
  } else {
    line3 += ` <span class="eq-txt">=</span> ${mixedBlank(wholeDiff, fracDiff, d)}`;
  }
  return { line1, line2, line3 };
}

/* ── 1·2학년 받아올림/내림 가르기 풀이 (원본 PoC 단일 라인 형식) ── */

/** (한 자리)+(한 자리), 받아올림 — 두 번째 수 가르기, 한 줄. */
function inlineMakeTenAdd(a, b) {
  const need = 10 - a;
  const remain = b - need;
  return `${a} <span class="op-txt">+</span> ${splitDiagramHtml(b, need, remain)} <span class="eq-txt">=</span> ${numBlank(a + b)}`;
}

/** (십몇)−(몇), 받아내림 — 첫 번째 수를 10과 일의 자리로 가르기, 한 줄. */
function inlineTeenBorrow(a, b) {
  const ones = a % 10;
  return `${splitDiagramHtml(a, 10, ones)} <span class="op-txt">−</span> ${b} <span class="eq-txt">=</span> ${numBlank(a - b)}`;
}

/** (두 자리)+(한 자리), 받아올림 — 두 번째 수 가르기, 한 줄. */
function inline2d1dCarry(a, b) {
  const need = 10 - (a % 10);
  const remain = b - need;
  return `${a} <span class="op-txt">+</span> ${splitDiagramHtml(b, need, remain)} <span class="eq-txt">=</span> ${numBlank(a + b)}`;
}

/** 나눗셈법 (최대공약수/최소공배수) */
function buildDivMethodHtml(a, b, mode) {
  const steps = [];
  let x = a, y = b;
  for (let d = 2; d <= Math.min(x, y); ) {
    if (x % d === 0 && y % d === 0) {
      steps.push({ divisor: d, vals: [x, y] });
      x = x / d; y = y / d;
    } else { d++; }
  }
  steps.push({ divisor: null, vals: [x, y] });

  const divisors = steps.filter(s => s.divisor !== null).map(s => s.divisor);
  const lastVals = steps[steps.length - 1].vals;
  const gcdVal = divisors.reduce((acc, d) => acc * d, 1);
  const lcmVal = gcdVal * lastVals[0] * lastVals[1];

  const answerLabel = mode === 'gcd' ? '최대공약수' : '최소공배수';
  const answerVal = mode === 'gcd' ? gcdVal : lcmVal;

  // 시트 제목에 이미 "최대공약수" 또는 "최소공배수"가 있으므로
  // 개별 문제에는 두 수만 표시 (div-method-row 의 values 가 그 역할).
  return `<div class="div-method div-method-split">
    <div class="div-method-left">
      <div class="div-method-row">
        <span class="div-method-paren">)</span>
        <span class="div-method-values"><span>${a}</span><span>${b}</span></span>
      </div>
      <div class="div-method-workspace"></div>
    </div>
    <div class="div-method-right">
      <div class="div-method-answer-label">${answerLabel}</div>
      <div class="div-method-answer-box">${numBlank(answerVal)}</div>
    </div>
  </div>`;
}

/* ================================================================
   고수준: 템플릿 정의
   ================================================================

   각 템플릿은 { grid, count, render(data) } 형태.
   - grid: 기본 그리드 레이아웃 키
   - count: 한 장당 기본 문제 수
   - render(data): 제너레이터 데이터 → 문제 객체 변환
*/

export const T = {
  /** 가로셈: expression = □ */
  horizontal: {
    grid: 'standard', count: 20,
    render: ({ expr, ans, unit }) => horizProblem(expr, numBlank(ans, unit || '')),
  },

  /** 세로셈 (사칙연산) */
  vertical: {
    grid: 'standard', count: 20,
    render: (data) => ({ kind: 'vertical', num1: data.num1, num2: data.num2, op: data.op, ans: data.ans }),
  },

  /** 세로 나눗셈 */
  longDiv: {
    grid: 'divgrid', count: 9,
    render: (data) => ({ kind: 'longdiv', dvsr: data.dvsr, dvnd: data.dvnd, quot: data.quot, rem: data.rem }),
  },

  /** 개념 카드 (질문 + 답) */
  concept: {
    grid: 'concept', count: 10,
    render: ({ question, answer, note }) => conceptProblem(question, answer, note || ''),
  },

  /** 관계 테이블 */
  relation: {
    grid: 'concept', count: 10,
    render: ({ question, tableHtml, answer, note }) => relationProblem(question, tableHtml, answer || '', note || ''),
  },

  /** 도형 넓이/둘레 */
  shape: {
    grid: 'wide', count: 8,
    render: ({ svg, prompt, answer, note }) => shapeProblem(svg, prompt, answer, note || ''),
  },

  /** 분수 비교 (분모 같은) */
  fracCompare: {
    grid: 'practice', count: 15,
    render: ({ left, right, leftVal, rightVal }) =>
      htmlProblem('frac-row', `${left} ${symBlank(leftVal > rightVal ? '>' : '<')} ${right}`),
  },

  /** 분수 변환 (가분수 ↔ 대분수) */
  fracConvert: {
    grid: 'practice', count: 15,
    render: (data) => htmlProblem('frac-row', data.html),
  },

  /** 분수 통분 연산 - 진분수 (1줄 풀이) */
  fracLcdStep: {
    grid: 'wide', count: 8,
    render: ({ n1, d1, n2, d2, op }) => {
      const steps = op === '+' ? inlineFracAdd(n1, d1, n2, d2) : inlineFracSub(n1, d1, n2, d2);
      return fracStepProblem(steps);
    },
  },

  /** 대분수 연산 - 가분수 변환 방식 (1줄) */
  mixedImproperStep: {
    grid: 'wide', count: 8,
    render: ({ w1, n1, d1, w2, n2, d2, op }) => {
      const steps = op === '+'
        ? inlineMixedAddImproper(w1, n1, d1, w2, n2, d2)
        : inlineMixedSubImproper(w1, n1, d1, w2, n2, d2);
      return fracStepProblem(steps);
    },
  },

  /** 대분수 연산 - 자연수/분수 따로 (3줄) */
  mixedSeparateStep: {
    grid: 'wide', count: 8,
    render: ({ w1, n1, d1, w2, n2, d2, op }) => {
      const lines = op === '+'
        ? inlineMixedAddSeparate(w1, n1, d1, w2, n2, d2)
        : inlineMixedSubSeparate(w1, n1, d1, w2, n2, d2);
      return fracStepProblemMultiLine(lines);
    },
  },

  /** 분모 같은 (진분수)+(진분수), 합 ≥ 1 — 가분수→대분수 변환 단계 */
  sameFracAddGe1Step: {
    grid: 'wide', count: 8,
    render: ({ a, b, d }) => fracStepProblem(inlineSameFracAddGe1(a, b, d)),
  },

  /** 1 − (진분수) — 1 = d/d 변환 단계 */
  oneMinusFracStep: {
    grid: 'wide', count: 8,
    render: ({ n, d }) => fracStepProblem(inline1MinusFrac(n, d)),
  },

  /** (자연수) − (진분수) — 자연수 받아내림 단계 */
  intMinusFracStep: {
    grid: 'wide', count: 8,
    render: ({ w, n, d }) => fracStepProblem(inlineIntMinusFrac(w, n, d)),
  },

  /** (자연수) − (대분수) — 자연수 받아내림 단계 */
  intMinusMixedStep: {
    grid: 'wide', count: 8,
    render: ({ w, wm, n, d }) => fracStepProblem(inlineIntMinusMixed(w, wm, n, d)),
  },

  /** 분모 같은 (대분수)+(대분수), 받아올림 — 자연수·분수 따로 (3줄) */
  sameMixedAddCarryStep: {
    grid: 'wide', count: 8,
    render: ({ w1, n1, w2, n2, d }) => fracStepProblemMultiLine(inlineSameMixedAddCarry(w1, n1, w2, n2, d)),
  },

  /** 분모 같은 (대분수)−(대분수), 받아내임 — 자연수·분수 따로 (3줄) */
  sameMixedSubBorrowStep: {
    grid: 'wide', count: 8,
    render: ({ w1, n1, w2, n2, d }) => fracStepProblemMultiLine(inlineSameMixedSubBorrow(w1, n1, w2, n2, d)),
  },

  /** (한 자리)+(한 자리), 받아올림 — 가르기 풀이 (한 줄) */
  makeTenAddStep: {
    grid: 'practice', count: 15,
    render: ({ a, b }) => fracStepProblem(inlineMakeTenAdd(a, b)),
  },

  /** (십몇)−(몇), 받아내림 — 가르기 풀이 (한 줄) */
  teenBorrowStep: {
    grid: 'practice', count: 15,
    render: ({ a, b }) => fracStepProblem(inlineTeenBorrow(a, b)),
  },

  /** (두 자리)+(한 자리), 받아올림 — 가르기 풀이 (한 줄) */
  twoDigitOneDigitCarryStep: {
    grid: 'practice', count: 15,
    render: ({ a, b }) => fracStepProblem(inline2d1dCarry(a, b)),
  },

  /** 나눗셈법 (최대공약수/최소공배수 구하기) */
  divMethod: {
    grid: 'concept', count: 6,
    render: ({ a, b, mode }) => {
      const html = buildDivMethodHtml(a, b, mode);
      return htmlProblem('concept-layout', `<div class="concept-card">${html}</div>`);
    },
  },

  /** PDF 격자 세로셈 (자릿수 칸 형태) */
  pdfGrid: {
    grid: 'standard', count: 20,
    render: (data) => data, // PDF 렌더러가 직접 처리
  },

  /** 자유 HTML (기존 제너레이터 호환) */
  raw: {
    grid: 'standard', count: 20,
    render: (data) => data, // 제너레이터가 직접 문제 객체 반환
  },
};

/* ================================================================
   템플릿 + 제너레이터 조합 유틸
   ================================================================ */

/**
 * 템플릿과 제너레이터를 결합하여 최종 제너레이터 함수를 만든다.
 * 카탈로그 빌더에서 내부적으로 사용.
 */
export function bindTemplate(template, generator) {
  if (!template) return generator; // 템플릿 없으면 제너레이터 직접 사용
  const bound = () => template.render(generator());
  bound._template = template;
  bound._generator = generator;
  return bound;
}
