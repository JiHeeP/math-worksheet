'use strict';

import { rand, randChoice } from '../../utils.js';
import {
  numBlank, rectangleSvg, triangleSvg, parallelogramSvg,
  trapezoidSvg, rhombusSvg, unitGridSvg, perimeterParallelogramSvg, perimeterRhombusSvg,
} from '../../helpers.js';
import { horizProblem, shapeProblem } from '../../templates.js';

export function genU6PreUnit() {
  const type = rand(1, 4);
  if (type === 1) { const m = rand(1, 9); return horizProblem(`${m} m`, numBlank(m * 100, 'cm')); }
  if (type === 2) { const c = rand(1, 9) * 100; return horizProblem(`${c} cm`, numBlank(c / 100, 'm')); }
  if (type === 3) { const km = rand(1, 5); return horizProblem(`${km} km`, numBlank(km * 1000, 'm')); }
  const m = rand(1, 5) * 1000; return horizProblem(`${m} m`, numBlank(m / 1000, 'km'));
}

export function genU6PreLen() {
  const a = rand(10, 90), b = rand(10, 90);
  if (rand(1, 2) === 1) return horizProblem(`${a} cm + ${b} cm`, numBlank(a + b, 'cm'));
  const big = Math.max(a, b), small = Math.min(a, b);
  return horizProblem(`${big} cm \u2212 ${small} cm`, numBlank(big - small, 'cm'));
}

export function genU6MainPerimeter(_context = {}, problemIndex = 1) {
  const shapeIndex = (Math.max(1, Number(problemIndex) || 1) - 1) % 3;
  if (shapeIndex === 0) {
    const base = rand(5, 12), side = rand(3, 9);
    return shapeProblem(perimeterParallelogramSvg(base, side), '', numBlank((base + side) * 2, 'cm'));
  }
  if (shapeIndex === 1) {
    const w = rand(4, 12), h = rand(3, 9);
    return shapeProblem(rectangleSvg(w, h), '', numBlank((w + h) * 2, 'cm'));
  }
  const side = rand(4, 10);
  return shapeProblem(perimeterRhombusSvg(side), '', numBlank(side * 4, 'cm'));
}

export function genU6MainUnitSquare() {
  const cols = rand(2, 5), rows = rand(2, 4);
  return shapeProblem(unitGridSvg(cols, rows), '', numBlank(cols * rows, '㎠'));
}

export function genU6MainRect() {
  const w = rand(3, 15), h = rand(3, 12);
  return shapeProblem(rectangleSvg(w, h), '', numBlank(w * h, 'cm\u00b2'));
}

export function genU6MainAreaUnit() {
  if (rand(1, 2) === 1) { const sqm = rand(1, 4); return horizProblem(`${sqm} m\u00b2`, numBlank(sqm * 10000, 'cm\u00b2')); }
  const sqcm = rand(1, 4) * 10000; return horizProblem(`${sqcm} cm\u00b2`, numBlank(sqcm / 10000, 'm\u00b2'));
}

export function genU6MainPara(_context = {}, problemIndex = 1) {
  const base = rand(4, 14), height = rand(3, 10);
  return shapeProblem(parallelogramSvg(base, height, problemIndex - 1), '', numBlank(base * height, 'cm\u00b2'));
}

export function genU6MainTri(_context = {}, problemIndex = 1) {
  const base = rand(3, 9) * 2, height = rand(3, 12);
  return shapeProblem(triangleSvg(base, height, problemIndex - 1), '', numBlank((base * height) / 2, 'cm\u00b2'));
}

export function genU6MainTrap(_context = {}, problemIndex = 1) {
  const top = rand(3, 8), bottom = rand(top + 1, top + 8), height = rand(2, 7) * 2;
  return shapeProblem(trapezoidSvg(top, bottom, height, problemIndex - 1), '', numBlank(((top + bottom) * height) / 2, 'cm\u00b2'));
}

export function genU6MainRhombus() {
  const d1 = rand(3, 8) * 2, d2 = rand(3, 8);
  return shapeProblem(rhombusSvg(d1, d2), '', numBlank((d1 * d2) / 2, 'cm\u00b2'));
}

export function genU6MainMix(context = {}, problemIndex = 1) {
  return randChoice([genU6MainRect, genU6MainPara, genU6MainTri, genU6MainTrap, genU6MainRhombus])(context, problemIndex);
}
