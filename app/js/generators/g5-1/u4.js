'use strict';

import { rand, randChoice, gcd, lcm } from '../../utils.js';
import { fracD, mixedD, numBlank, symBlank, fracBlank, mixedBlank } from '../../helpers.js';
import { htmlProblem } from '../../templates.js';

export function genU4PreCmp() {
  const den = rand(5, 12);
  let a, b;
  do { a = rand(1, den - 1); b = rand(1, den - 1); } while (a === b);
  return htmlProblem('frac-row', `${fracD(a, den)} ${symBlank(a > b ? '>' : '<')} ${fracD(b, den)}`);
}

export function genU4PreConv() {
  const den = rand(2, 7), whole = rand(1, 3), rem = rand(1, den - 1);
  return htmlProblem('frac-row', `${fracD((whole * den) + rem, den)} <span class="eq-txt">=</span> ${mixedBlank(whole, rem, den)}`);
}

export function genU4MainEquivFind() {
  const den = rand(2, 8), num = rand(1, den - 1), multiplier = rand(2, 4);
  const g = gcd(Math.abs(num), Math.abs(den));
  const sn = num / g, sd = den / g;
  return htmlProblem('frac-row', `${fracD(sn, sd)} <span class="eq-txt">=</span> ${fracBlank(sn * multiplier, sd * multiplier)}`);
}

export function genU4MainEquivMake() {
  const den = rand(2, 7), num = rand(1, den - 1), m = rand(2, 5);
  if (rand(1, 2) === 1) {
    return htmlProblem('frac-row', `${fracD(num, den)} <span class="eq-txt">=</span> <span class="frac-blank"><span class="fb-top" data-ans="${num * m}">${num * m}</span><span class="fb-line"></span><span class="fb-bot">${den * m}</span></span>`);
  }
  return htmlProblem('frac-row', `${fracD(num, den)} <span class="eq-txt">=</span> <span class="frac-blank"><span class="fb-top">${num * m}</span><span class="fb-line"></span><span class="fb-bot" data-ans="${den * m}">${den * m}</span></span>`);
}

export function genU4MainRedProcess() {
  let n, d, g;
  do { g = rand(2, 6); n = rand(1, 7); d = rand(n + 1, 9); } while (gcd(n, d) > 1);
  const num = n * g, den = d * g;
  return htmlProblem('concept-layout', `<div class="concept-card"><div class="concept-answer">${fracD(num, den)} <span class="eq-txt">=</span> ${fracD(`${num} \u00f7 ${numBlank(g)}`, `${den} \u00f7 ${numBlank(g)}`)} <span class="eq-txt">=</span> ${fracBlank(n, d)}</div></div>`);
}

export function genU4MainRed() {
  let n, d, g;
  do { g = rand(2, 6); n = rand(1, 7); d = rand(n + 1, 9); } while (gcd(n, d) > 1);
  return htmlProblem('frac-row', `${fracD(n * g, d * g)} <span class="eq-txt">=</span> ${fracBlank(n, d)}`);
}

export function genU4MainLcdProcess() {
  let d1, d2;
  do { d1 = rand(2, 6); d2 = rand(2, 6); } while (d1 === d2);
  const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1), common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2;
  return htmlProblem('concept-layout', `<div class="concept-card"><div class="concept-answer">${fracD(n1, d1)} <span class="eq-txt">=</span> ${fracD(`${n1} \u00d7 ${numBlank(m1)}`, `${d1} \u00d7 ${numBlank(m1)}`)} <span class="eq-txt">=</span> ${fracBlank(n1 * m1, common)}</div><div class="concept-answer">${fracD(n2, d2)} <span class="eq-txt">=</span> ${fracD(`${n2} \u00d7 ${numBlank(m2)}`, `${d2} \u00d7 ${numBlank(m2)}`)} <span class="eq-txt">=</span> ${fracBlank(n2 * m2, common)}</div></div>`);
}

export function genU4MainLcd() {
  let d1, d2;
  do { d1 = rand(2, 6); d2 = rand(2, 6); } while (d1 === d2);
  const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1), common = lcm(d1, d2);
  return htmlProblem('frac-row', `${fracD(n1, d1)} <span class="eq-txt">=</span> ${fracBlank(n1 * (common / d1), common)} <span class="op-txt">,</span> ${fracD(n2, d2)} <span class="eq-txt">=</span> ${fracBlank(n2 * (common / d2), common)}`);
}

export function genU4MainCmp() {
  let d1, d2;
  do { d1 = rand(2, 8); d2 = rand(2, 8); } while (d1 === d2);
  const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1), common = lcm(d1, d2);
  const m1 = common / d1, m2 = common / d2, cn1 = n1 * m1, cn2 = n2 * m2;
  return htmlProblem('concept-layout', `<div class="concept-card"><div class="concept-answer">${fracD(n1, d1)} ${symBlank(n1 / d1 > n2 / d2 ? '>' : '<')} ${fracD(n2, d2)}</div><div class="lcd-process-row"><span class="lcd-label">통분</span>${fracD(n1, d1)} <span class="eq-txt">=</span> ${fracBlank(cn1, common)}<span class="op-txt">,</span>${fracD(n2, d2)} <span class="eq-txt">=</span> ${fracBlank(cn2, common)}</div></div>`);
}

function decToFrac(dec) {
  const str = String(dec), dotIdx = str.indexOf('.');
  if (dotIdx === -1) return { n: Number(dec), d: 1 };
  const decimals = str.length - dotIdx - 1, d = Math.pow(10, decimals);
  const n = Math.round(dec * d), g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export function genU4MainDecCmp() {
  const set = randChoice([
    { n: 1, d: 2, dec: '0.6' }, { n: 3, d: 4, dec: '0.7' }, { n: 2, d: 5, dec: '0.5' },
    { n: 7, d: 10, dec: '0.6' }, { n: 1, d: 4, dec: '0.3' }, { n: 3, d: 5, dec: '0.8' },
    { n: 1, d: 5, dec: '0.3' }, { n: 3, d: 10, dec: '0.4' }, { n: 4, d: 5, dec: '0.7' },
    { n: 9, d: 10, dec: '0.8' },
  ]);
  const answer = (set.n / set.d) > parseFloat(set.dec) ? '>' : '<';
  const decFrac = decToFrac(parseFloat(set.dec));
  const common = lcm(set.d, decFrac.d), m1 = common / set.d, m2 = common / decFrac.d;
  const cn1 = set.n * m1, cn2 = decFrac.n * m2;
  let processHtml = `<div class="lcd-process-row"><span class="lcd-label">소수\u2192분수</span> ${set.dec} <span class="eq-txt">=</span> ${fracBlank(decFrac.n, decFrac.d)}</div>`;
  if ((set.d !== common || decFrac.d !== common) && decFrac.d !== set.d) {
    processHtml += `<div class="lcd-process-row"><span class="lcd-label">통분</span> ${fracD(set.n, set.d)} <span class="eq-txt">=</span> ${fracBlank(cn1, common)} <span class="op-txt">,</span> ${fracD(decFrac.n, decFrac.d)} <span class="eq-txt">=</span> ${fracBlank(cn2, common)}</div>`;
  }
  return htmlProblem('concept-layout', `<div class="concept-card"><div class="concept-answer">${fracD(set.n, set.d)} ${symBlank(answer)} <span style="color:#2f3640;">${set.dec}</span></div>${processHtml}</div>`);
}
