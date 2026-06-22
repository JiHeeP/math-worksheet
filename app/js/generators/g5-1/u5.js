'use strict';

import { rand, lcm, simplify, mixedWholeForStage, relatedDenominatorPair } from '../../utils.js';
import { fracD, mixedD, numBlank, fracBlank, mixedBlank, formulaResultHtml } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

function calcStageLimits(ctx) {
  const stage = ctx.fractionStage || 2;
  const { wMax } = mixedWholeForStage(stage);
  const { dMin, dMax } = denominatorRangeForStage(ctx);

  return {
    dMin,
    dMax,
    commonMax: dMax,
    convertedMax: (wMax + 1) * dMax,
  };
}

function denominatorRangeForStage(ctx, dMinFloor = 2) {
  const stage = ctx.fractionStage || 2;
  if (stage === 1) return { dMin: Math.max(dMinFloor, 2), dMax: 6 };
  if (stage === 3) return { dMin: Math.max(dMinFloor, 10), dMax: 20 };
  return { dMin: Math.max(dMinFloor, 5), dMax: 12 };
}

function pickDenominator(ctx, dMinFloor = 2) {
  const { dMin, dMax } = denominatorRangeForStage(ctx, dMinFloor);
  return rand(dMin, dMax);
}

function resultDenominatorOk(num, den, ctx) {
  const simplifiedDen = simplify(num, den)[1];
  if (simplifiedDen === 1) return true;
  const { dMin, dMax } = denominatorRangeForStage(ctx);
  return simplifiedDen >= dMin && simplifiedDen <= dMax;
}

function pickCalcDenominators(ctx) {
  const { dMin, dMax, commonMax } = calcStageLimits(ctx);
  let d1, d2, common;
  for (let tries = 0; tries < 200; tries++) {
    ({ d1, d2 } = relatedDenominatorPair(dMin, dMax));
    common = lcm(d1, d2);
    if (common <= commonMax) return { d1, d2, common };
  }
  for (let a = dMin; a <= dMax; a++) {
    for (let b = dMin; b <= dMax; b++) {
      const c = lcm(a, b);
      if (a !== b && c < a * b && c <= commonMax) return { d1: a, d2: b, common: c };
    }
  }
  ({ d1, d2 } = relatedDenominatorPair(dMin, dMax));
  return { d1, d2, common: lcm(d1, d2) };
}

/* ── 선수학습: 분모 같은 분수 (직접 렌더링) ── */

export function genU5PreAdd(ctx = {}) {
  let d, a, b;
  do {
    d = pickDenominator(ctx, 3);
    a = rand(1, Math.floor(d / 2));
    b = rand(1, d - a - 1);
  } while (!resultDenominatorOk(a + b, d, ctx));
  return htmlProblem('frac-row', `${fracD(a, d)} <span class="op-txt">+</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(a + b, d)}`);
}

export function genU5PreAddGe1(ctx = {}) {
  let d, a, b;
  do {
    d = pickDenominator(ctx, 2);
    a = rand(1, d - 1);
    b = rand(1, d - 1);
  } while (a + b < d || !resultDenominatorOk(a + b, d, ctx));
  return htmlProblem('frac-row', `${fracD(a, d)} <span class="op-txt">+</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(a + b, d)}`);
}

export function genU5PreSub(ctx = {}) {
  let d, a, b;
  do {
    d = pickDenominator(ctx, 3);
    b = rand(1, d - 2);
    a = rand(b + 1, d - 1);
  } while (!resultDenominatorOk(a - b, d, ctx));
  return htmlProblem('frac-row', `${fracD(a, d)} <span class="op-txt">\u2212</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(a - b, d)}`);
}

export function genU5PreMixedSub(ctx = {}) {
  const d = pickDenominator(ctx, 2), w = rand(1, 3), wn = rand(0, d - 1), b = rand(1, d - 1);
  const totalNum = w * d + wn;
  if (totalNum <= b || !resultDenominatorOk(totalNum - b, d, ctx)) return genU5PreMixedSub(ctx);
  return htmlProblem('frac-row', `${wn === 0 ? w : mixedD(w, wn, d)} <span class="op-txt">\u2212</span> ${fracD(b, d)} <span class="eq-txt">=</span> ${formulaResultHtml(totalNum - b, d)}`);
}

export function genU5PreMixedToImproperProcess(ctx = {}) {
  const d = pickDenominator(ctx, 2), w = rand(1, 4), n = rand(1, d - 1), imp = w * d + n;
  return htmlProblem('concept-layout', `<div class="concept-card"><div class="concept-answer">${mixedD(w, n, d)} <span class="eq-txt">=</span> ${fracD(`${numBlank(w)} \u00d7 ${numBlank(d)} + ${numBlank(n)}`, d)} <span class="eq-txt">=</span> ${fracBlank(imp, d)}</div></div>`);
}

export function genU5PreMixedToImproper(ctx = {}) {
  const d = pickDenominator(ctx, 2), w = rand(1, 4), n = rand(1, d - 1), imp = w * d + n;
  return htmlProblem('frac-row', `${mixedD(w, n, d)} <span class="eq-txt">=</span> ${fracBlank(imp, d)}`);
}

/* ── 본단원: 템플릿용 순수 데이터 제너레이터 ── */

export function genFracAddLt1(ctx = {}) {
  let d1, d2, n1, n2, total, common, tries = 0;
  do {
    ({ d1, d2, common } = pickCalcDenominators(ctx));
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    total = (n1 * (common / d1)) + (n2 * (common / d2));
    tries++;
  } while ((total >= common || !resultDenominatorOk(total, common, ctx)) && tries < 200);
  return { n1, d1, n2, d2, op: '+' };
}

export function genFracAddGe1(ctx = {}) {
  let d1, d2, n1, n2, total, common, tries = 0;
  do {
    ({ d1, d2, common } = pickCalcDenominators(ctx));
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    total = (n1 * (common / d1)) + (n2 * (common / d2));
    tries++;
  } while ((total < common || !resultDenominatorOk(total, common, ctx)) && tries < 200);
  return { n1, d1, n2, d2, op: '+', showImproperResultStep: true };
}

export function genFracSub(ctx = {}) {
  let d1, d2, n1, n2, diff, common, tries = 0;
  do {
    ({ d1, d2, common } = pickCalcDenominators(ctx));
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    diff = (n1 * (common / d1)) - (n2 * (common / d2));
    tries++;
  } while ((diff <= 0 || !resultDenominatorOk(diff, common, ctx)) && tries < 200);
  return { n1, d1, n2, d2, op: '-' };
}

export function genMixedAddNoCarry(ctx = {}) {
  const { convertedMax } = calcStageLimits(ctx);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let d1, d2, n1, n2, common, tries = 0;
  do {
    ({ d1, d2, common } = pickCalcDenominators(ctx));
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    tries++;
  } while (
    (
      n1 * (common / d1) + n2 * (common / d2) >= common ||
      !resultDenominatorOk(n1 * (common / d1) + n2 * (common / d2), common, ctx)
    ) && tries < 200
  );
  const w1 = rand(wMin, wMax), w2 = rand(wMin, wMax);
  if ((w1 * d1 + n1) * (common / d1) > convertedMax || (w2 * d2 + n2) * (common / d2) > convertedMax) {
    return genMixedAddNoCarry(ctx);
  }
  return { w1, n1, d1, w2, n2, d2, op: '+', showImproperResultStep: true };
}

export function genMixedAddCarry(ctx = {}) {
  const { convertedMax } = calcStageLimits(ctx);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let d1, d2, n1, n2, common, tries = 0;
  do {
    ({ d1, d2, common } = pickCalcDenominators(ctx));
    n1 = rand(1, d1 - 1); n2 = rand(1, d2 - 1);
    tries++;
  } while (
    (
      n1 * (common / d1) + n2 * (common / d2) < common ||
      !resultDenominatorOk(n1 * (common / d1) + n2 * (common / d2), common, ctx)
    ) && tries < 200
  );
  const w1 = rand(wMin, wMax), w2 = rand(wMin, wMax);
  if ((w1 * d1 + n1) * (common / d1) > convertedMax || (w2 * d2 + n2) * (common / d2) > convertedMax) {
    return genMixedAddCarry(ctx);
  }
  return { w1, n1, d1, w2, n2, d2, op: '+', showImproperResultStep: true };
}

export function genMixedSubNoBorrow(ctx = {}) {
  const { convertedMax } = calcStageLimits(ctx);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let d1, d2, n1, n2, common, tries = 0;
  while (tries < 200) {
    tries++;
    ({ d1, d2, common } = pickCalcDenominators(ctx));
    n2 = rand(1, d2 - 1);
    const n2c = n2 * (common / d2);
    if (n2c >= common - 1) continue;
    const n1c = rand(n2c, common - 1);
    if (n1c % (common / d1) !== 0) continue;
    n1 = n1c / (common / d1);
    if (n1 < 1 || n1 >= d1) continue;
    break;
  }
  const w2 = rand(wMin, wMax), w1 = w2 + rand(1, 3);
  if (!resultDenominatorOk((w1 - w2) * common + (n1 * (common / d1) - n2 * (common / d2)), common, ctx)) {
    return genMixedSubNoBorrow(ctx);
  }
  if ((w1 * d1 + n1) * (common / d1) > convertedMax || (w2 * d2 + n2) * (common / d2) > convertedMax) {
    return genMixedSubNoBorrow(ctx);
  }
  return { w1, n1, d1, w2, n2, d2, op: '-', showImproperResultStep: true };
}

export function genMixedSubBorrow(ctx = {}) {
  const { convertedMax } = calcStageLimits(ctx);
  const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
  let d1, d2, n1, n2, common, tries = 0;
  while (tries < 200) {
    tries++;
    ({ d1, d2, common } = pickCalcDenominators(ctx));
    n2 = rand(1, d2 - 1);
    const n2c = n2 * (common / d2);
    if (n2c <= 1) continue;
    const n1c = rand(1, n2c - 1);
    if (n1c % (common / d1) !== 0) continue;
    n1 = n1c / (common / d1);
    if (n1 < 1 || n1 >= d1) continue;
    break;
  }
  const w2 = rand(wMin, wMax), w1 = w2 + rand(1, 3);
  if (!resultDenominatorOk((w1 - w2) * common + (n1 * (common / d1) - n2 * (common / d2)), common, ctx)) {
    return genMixedSubBorrow(ctx);
  }
  if ((w1 * d1 + n1) * (common / d1) > convertedMax || (w2 * d2 + n2) * (common / d2) > convertedMax) {
    return genMixedSubBorrow(ctx);
  }
  return { w1, n1, d1, w2, n2, d2, op: '-' };
}
