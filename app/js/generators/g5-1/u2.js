'use strict';

import { rand, randChoice, gcd, lcm, factorsOf, multiplesOf } from '../../utils.js';
import { numBlank, multiBlank } from '../../helpers.js';
import { horizProblem, conceptProblem } from '../../templates.js';

export function genU2PreMul() {
  const a = rand(2, 9), b = rand(1, 9);
  return horizProblem(`${a} \u00d7 ${b}`, numBlank(a * b));
}

export function genU2PreDiv() {
  const b = rand(2, 9), q = rand(2, 9);
  return horizProblem(`${b * q} \u00f7 ${b}`, numBlank(q));
}

export function genU2MainFactorConcept() {
  const n = randChoice([12, 14, 15, 16, 18, 20, 24, 28, 30]);
  return conceptProblem(`${n}의 약수`, multiBlank(factorsOf(n)));
}

export function genU2MainMultipleConcept() {
  const n = rand(3, 9);
  return conceptProblem(`${n}의 배수 5개`, multiBlank(multiplesOf(n, 5)));
}

export function genU2MainCommonFactorConcept() {
  const g = rand(2, 6), p = rand(2, 5), q = rand(2, 5);
  const a = g * p, b = g * q;
  return conceptProblem(`${a}와 ${b}의 공약수`, multiBlank(factorsOf(gcd(a, b))));
}

function pickGcdLcmPair() {
  const g = randChoice([2, 3, 4, 6]);
  let p, q;
  do { p = rand(2, 7); q = rand(2, 7); } while (gcd(p, q) !== 1 || p === q);
  return [g * p, g * q];
}

export function genU2MainGcdData() {
  const [a, b] = pickGcdLcmPair();
  return { a, b, mode: 'gcd' };
}

export function genU2MainLcmData() {
  const [a, b] = pickGcdLcmPair();
  return { a, b, mode: 'lcm' };
}

export function genU2MainCommonMultipleConcept() {
  const a = rand(2, 7), b = rand(2, 7), base = lcm(a, b);
  return conceptProblem(`${a}와 ${b}의 공배수 5개`, multiBlank([base, base * 2, base * 3, base * 4, base * 5]));
}
