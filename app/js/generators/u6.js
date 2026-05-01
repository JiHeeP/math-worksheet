'use strict';

import { rand, randChoice } from '../utils.js';
import { numBlank, perimeterTriangleSvg, rectangleSvg, triangleSvg, parallelogramSvg, trapezoidSvg, rhombusSvg, unitGridSvg } from '../helpers.js';
import { horizProblem, shapeProblem } from '../templates.js';

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

export function genU6MainPerimeter() {
  if (rand(1, 2) === 1) {
    const a = rand(4, 9), b = rand(4, 9), c = rand(4, 9);
    return shapeProblem(perimeterTriangleSvg(a, b, c), '삼각형의 둘레를 구해 보세요.', numBlank(a + b + c, 'cm'));
  }
  const w = rand(4, 12), h = rand(3, 9);
  return shapeProblem(rectangleSvg(w, h), '직사각형의 둘레를 구해 보세요.', numBlank((w * 2) + (h * 2), 'cm'));
}

export function genU6MainUnitSquare() {
  const cols = rand(2, 5), rows = rand(2, 4);
  return shapeProblem(unitGridSvg(cols, rows), '그림의 넓이는 몇 ㎠인가요?', numBlank(cols * rows, '㎠'));
}

export function genU6MainRect() {
  const w = rand(3, 15), h = rand(3, 12);
  return shapeProblem(rectangleSvg(w, h), '직사각형의 넓이를 구해 보세요.', numBlank(w * h, 'cm\u00b2'), '넓이 = 가로 \u00d7 세로');
}

export function genU6MainAreaUnit() {
  if (rand(1, 2) === 1) { const sqm = rand(1, 4); return horizProblem(`${sqm} m\u00b2`, numBlank(sqm * 10000, 'cm\u00b2')); }
  const sqcm = rand(1, 4) * 10000; return horizProblem(`${sqcm} cm\u00b2`, numBlank(sqcm / 10000, 'm\u00b2'));
}

export function genU6MainPara() {
  const base = rand(4, 14), height = rand(3, 10);
  return shapeProblem(parallelogramSvg(base, height), '평행사변형의 넓이를 구해 보세요.', numBlank(base * height, 'cm\u00b2'));
}

export function genU6MainTri() {
  const base = rand(2, 12) * 2, height = rand(2, 10);
  return shapeProblem(triangleSvg(base, height), '삼각형의 넓이를 구해 보세요.', numBlank((base * height) / 2, 'cm\u00b2'));
}

export function genU6MainTrap() {
  const top = rand(3, 8), bottom = rand(top + 1, top + 8), height = rand(2, 7) * 2;
  return shapeProblem(trapezoidSvg(top, bottom, height), '사다리꼴의 넓이를 구해 보세요.', numBlank(((top + bottom) * height) / 2, 'cm\u00b2'));
}

export function genU6MainRhombus() {
  const d1 = rand(3, 8) * 2, d2 = rand(3, 8);
  return shapeProblem(rhombusSvg(d1, d2), '마름모의 넓이를 구해 보세요.', numBlank((d1 * d2) / 2, 'cm\u00b2'));
}

export function genU6MainMix() {
  return randChoice([genU6MainRect, genU6MainPara, genU6MainTri, genU6MainTrap, genU6MainRhombus])();
}
