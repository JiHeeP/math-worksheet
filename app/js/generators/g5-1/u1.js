'use strict';

import { rand } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { horizProblem } from '../../templates.js';

/* ── 선수학습 ── */

export function genU1PreAdd2d() {
  const a1 = rand(1, 9), b1 = rand(10 - a1, 9);
  const a10 = rand(1, 8), b10 = rand(1, 9 - a10);
  const a = a10 * 10 + a1, b = b10 * 10 + b1;
  return { kind: 'vertical', num1: a, num2: b, op: '+', ans: a + b };
}

export function genU1PreSub2d() {
  const a1 = rand(0, 7), b1 = rand(a1 + 1, 9);
  const b10 = rand(1, 7), a10 = rand(b10 + 1, 9);
  const a = a10 * 10 + a1, b = b10 * 10 + b1;
  return { kind: 'vertical', num1: a, num2: b, op: '\u2212', ans: a - b };
}

export function genU1PreMul2d1d() {
  const a = rand(12, 99), b = rand(2, 9);
  return { kind: 'vertical', num1: a, num2: b, op: '\u00d7', ans: a * b };
}

export function genU1PreDiv2d1d() {
  const b = rand(2, 9), q = rand(3, Math.floor(99 / b)), a = b * q;
  return horizProblem(`${a} \u00f7 ${b}`, numBlank(q));
}

export function genU1PreDiv2d1dNoRem() {
  const b = rand(2, 9), q = rand(3, Math.floor(99 / b)), a = b * q;
  return { kind: 'vertical', dvsr: b, dvnd: a, quot: q, rem: 0 };
}

export function genU1PreDiv2d1dRem() {
  const b = rand(2, 9), q = rand(3, Math.floor((99 - b + 1) / b));
  const r = rand(1, b - 1), a = b * q + r;
  if (a > 99) return genU1PreDiv2d1dRem();
  return { kind: 'vertical', dvsr: b, dvnd: a, quot: q, rem: r };
}

export function genU1PreAdd() {
  const a = rand(100, 499), b = rand(100, 400);
  return { kind: 'vertical', num1: a, num2: b, op: '+', ans: a + b };
}

export function genU1PreSub() {
  const b = rand(100, 399), a = b + rand(10, 300);
  return { kind: 'vertical', num1: a, num2: b, op: '\u2212', ans: a - b };
}

export function genU1PreMul() {
  const a = rand(12, 45), b = rand(11, 25);
  return { kind: 'vertical', num1: a, num2: b, op: '\u00d7', ans: a * b };
}

export function genU1PreMul3x2() {
  const a = rand(100, 399), b = rand(11, 25);
  return { kind: 'vertical', num1: a, num2: b, op: '\u00d7', ans: a * b };
}

export function genU1PreDiv() {
  const b = rand(11, 25), q = rand(10, 30);
  return horizProblem(`${b * q} \u00f7 ${b}`, numBlank(q));
}

export function genDiv3d2() {
  const dvsr = rand(11, 30), dvnd = rand(100, 900);
  const quot = Math.floor(dvnd / dvsr);
  if (quot < 10) return genDiv3d2();
  return { kind: 'longdiv', dvsr, dvnd, quot, rem: dvnd % dvsr };
}

export function genDiv3d1() {
  const dvsr = rand(2, 9), dvnd = rand(100, 999);
  return { kind: 'longdiv', dvsr, dvnd, quot: Math.floor(dvnd / dvsr), rem: dvnd % dvsr };
}

/* ── 본단원 ── */

export function genU1MainAddSubOrder() {
  const type = rand(1, 4);
  if (type === 1) { const a = rand(20, 80), b = rand(20, 80), c = rand(10, Math.min(a + b - 1, 99)); return horizProblem(`${a} + ${b} \u2212 ${c}`, numBlank(a + b - c)); }
  if (type === 2) { const a = rand(30, 90), b = rand(10, a - 1), c = rand(10, 80); return horizProblem(`${a} \u2212 ${b} + ${c}`, numBlank(a - b + c)); }
  if (type === 3) { const a = rand(20, 60), b = rand(10, 40), c = rand(10, 40), d = rand(10, Math.min(a + b + c - 1, 50)); return horizProblem(`${a} + ${b} + ${c} \u2212 ${d}`, numBlank(a + b + c - d)); }
  // a \u2212 b \u2212 c: a > b + c \ubcf4\uc7a5 (\uacb0\uacfc \u2265 1)
  const b = rand(10, 30), c = rand(10, 30), a = rand(b + c + 1, 99);
  return horizProblem(`${a} \u2212 ${b} \u2212 ${c}`, numBlank(a - b - c));
}

export function genU1MainAddSubParen() {
  const type = rand(1, 3);
  if (type === 1) {
    // a \u2212 (b + c): a > b + c \ubcf4\uc7a5 (\uacb0\uacfc \u2265 1)
    const b = rand(10, 40), c = rand(10, 40), a = rand(b + c + 1, 99);
    return horizProblem(`${a} \u2212 (${b} + ${c})`, numBlank(a - (b + c)));
  }
  if (type === 2) { const a = rand(20, 60), c = rand(10, 40), b = rand(c + 1, c + 40); return horizProblem(`${a} + (${b} \u2212 ${c})`, numBlank(a + (b - c))); }
  // a \u2212 (b \u2212 c): a > b \u2212 c \ubcf4\uc7a5 (\uacb0\uacfc \u2265 1)
  const b = rand(20, 60), c = rand(10, b - 1), innerDiff = b - c;
  const a = rand(innerDiff + 1, innerDiff + 50);
  return horizProblem(`${a} \u2212 (${b} \u2212 ${c})`, numBlank(a - innerDiff));
}

export function genU1MainAddSubParenOrder() { return rand(1, 2) === 1 ? genU1MainAddSubOrder() : genU1MainAddSubParen(); }

export function genU1MainMulDivOrder() {
  const type = rand(1, 3);
  if (type === 1) { const a = rand(2, 9), c = rand(2, 8), k = rand(2, 6), b = c * k; return horizProblem(`${a} \u00d7 ${b} \u00f7 ${c}`, numBlank(a * k)); }
  if (type === 2) { const d = rand(2, 9), q = rand(2, 9), c = rand(2, 9); return horizProblem(`${q * d} \u00f7 ${d} \u00d7 ${c}`, numBlank(q * c)); }
  const a = rand(2, 6), b = rand(2, 6), c = rand(2, 8), k = rand(2, 5), d = c * k; return horizProblem(`${a} \u00d7 ${b} \u00d7 ${d} \u00f7 ${c}`, numBlank(a * b * k));
}

export function genU1MainMulDivParen() {
  const type = rand(1, 3);
  if (type === 1) { const a = rand(2, 6), b = rand(2, 6), c = rand(2, 8), k = rand(2, 5); return horizProblem(`${a} \u00d7 (${b} \u00d7 ${k * c}) \u00f7 ${c}`, numBlank(a * b * k)); }
  if (type === 2) { const a = rand(10, 50), b = rand(2, 9), c = rand(2, 9); return horizProblem(`(${a * b} \u00f7 ${b}) \u00d7 ${c}`, numBlank(a * c)); }
  const d = rand(2, 8), q1 = rand(2, 6), q2 = rand(2, 6); return horizProblem(`${q1 * d} \u00f7 (${d} \u00d7 ${q2}) \u00d7 ${q2}`, numBlank(q1));
}

export function genU1MainMulDivMix() { return rand(1, 2) === 1 ? genU1MainMulDivOrder() : genU1MainMulDivParen(); }

export function genU1MainAddSubMulOrder() {
  const type = rand(1, 4);
  if (type === 1) { const a = rand(10, 60), b = rand(2, 9), c = rand(2, 9); return horizProblem(`${a} + ${b} \u00d7 ${c}`, numBlank(a + (b * c))); }
  if (type === 2) { const a = rand(3, 9), b = rand(4, 9), c = rand(5, (a * b) - 1); return horizProblem(`${a} \u00d7 ${b} \u2212 ${c}`, numBlank((a * b) - c)); }
  if (type === 3) { const a = rand(2, 9), b = rand(2, 9), c = rand(10, 50); return horizProblem(`${a} \u00d7 ${b} + ${c}`, numBlank(a * b + c)); }
  const a = rand(30, 80), b = rand(2, 9), c = rand(2, 9), result = a - b * c;
  if (result <= 0) return genU1MainAddSubMulOrder();
  return horizProblem(`${a} \u2212 ${b} \u00d7 ${c}`, numBlank(result));
}

export function genU1MainAddSubMulParen() {
  const type = rand(1, 3);
  if (type === 1) { const a = rand(10, 40), b = rand(10, 40), c = rand(2, 6); return horizProblem(`(${a} + ${b}) \u00d7 ${c}`, numBlank((a + b) * c)); }
  if (type === 2) { const a = rand(20, 60), b = rand(10, a - 1), c = rand(2, 6); return horizProblem(`(${a} \u2212 ${b}) \u00d7 ${c}`, numBlank((a - b) * c)); }
  const a = rand(2, 9), b = rand(10, 40), c = rand(10, 40); return horizProblem(`${a} \u00d7 (${b} + ${c})`, numBlank(a * (b + c)));
}

export function genU1MainAddSubMul() { return rand(1, 2) === 1 ? genU1MainAddSubMulOrder() : genU1MainAddSubMulParen(); }

export function genU1MainAddSubDivOrder() {
  const type = rand(1, 4);
  if (type === 1) { const a = rand(30, 90), b = rand(10, 40), d = rand(2, 9), q = rand(2, 9); return horizProblem(`${a} + ${b} \u2212 ${q * d} \u00f7 ${d}`, numBlank(a + b - q)); }
  if (type === 2) { const a = rand(50, 90), b = rand(10, 30), d = rand(2, 9), q = rand(2, 8); return horizProblem(`${a} \u2212 ${b} + ${q * d} \u00f7 ${d}`, numBlank(a - b + q)); }
  if (type === 3) { const a = rand(20, 60), d = rand(2, 9), q = rand(2, 9); return horizProblem(`${a} + ${q * d} \u00f7 ${d}`, numBlank(a + q)); }
  const a = rand(50, 99), d = rand(2, 9), q = rand(2, 9); return horizProblem(`${a} \u2212 ${q * d} \u00f7 ${d}`, numBlank(a - q));
}

export function genU1MainAddSubDivParen() {
  const type = rand(1, 3);
  if (type === 1) { const d = rand(2, 9), q = rand(3, 12), s1 = rand(1, q * d - 1), s2 = q * d - s1; return horizProblem(`(${s1} + ${s2}) \u00f7 ${d}`, numBlank(q)); }
  if (type === 2) { const d = rand(2, 9), q = rand(2, 10), b = rand(1, 30), a = q * d + b; return horizProblem(`(${a} \u2212 ${b}) \u00f7 ${d}`, numBlank(q)); }
  const d = rand(2, 8), q1 = rand(2, 9), q2 = rand(2, 9); return horizProblem(`${q1 * d} \u00f7 ${d} + ${q2 * d} \u00f7 ${d}`, numBlank(q1 + q2));
}

export function genU1MainAddSubDiv() { return rand(1, 2) === 1 ? genU1MainAddSubDivOrder() : genU1MainAddSubDivParen(); }

export function genU1MainMixOrder() {
  const type = rand(1, 3);
  if (type === 1) { const a = rand(20, 60), b = rand(2, 9), c = rand(2, 6), d = rand(2, 8), q = rand(2, 8); return horizProblem(`${a} + ${b} \u00d7 ${c} \u2212 ${q * d} \u00f7 ${d}`, numBlank(a + (b * c) - q)); }
  if (type === 2) { const b = rand(2, 5), c = rand(2, 5), d = rand(2, 8), q = rand(2, 6), a = rand(b * c + 1, b * c + 30); return horizProblem(`${a} \u2212 ${b} \u00d7 ${c} + ${q * d} \u00f7 ${d}`, numBlank(a - (b * c) + q)); }
  const a = rand(2, 9), b = rand(2, 9), c = rand(2, 8), k = rand(2, 5), d = rand(1, Math.max(1, a * b + k - 1));
  return horizProblem(`${a} \u00d7 ${b} + ${k * c} \u00f7 ${c} \u2212 ${d}`, numBlank(a * b + k - d));
}

export function genU1MainMixParen() {
  const type = rand(1, 3);
  if (type === 1) { const a = rand(6, 20), b = rand(5, 18), c = rand(2, 5), d = rand(2, 7), q = rand(2, 6); return horizProblem(`(${a} + ${b}) \u00d7 ${c} \u2212 ${q * d} \u00f7 ${d}`, numBlank((a + b) * c - q)); }
  if (type === 2) {
    // a \u00d7 b \u2212 (c \u2212 q*d \u00f7 d): \uc548\ucabd c \u2212 q \u2265 1, \ubc14\uae65 a*b \u2212 (c \u2212 q) \u2265 1 \ubcf4\uc7a5
    const a = rand(2, 6), b = rand(2, 6), ab = a * b;
    const d = rand(2, 8), q = rand(2, 6);
    const c = rand(q + 1, q + ab - 1); // c \u2212 q \u2208 [1, ab \u2212 1]
    return horizProblem(`${a} \u00d7 ${b} \u2212 (${c} \u2212 ${q * d} \u00f7 ${d})`, numBlank(ab - (c - q)));
  }
  const a = rand(10, 30), b = rand(10, 20), c = rand(2, 5), d = rand(2, 7), q = rand(2, 6);
  return horizProblem(`(${a} + ${b}) \u00d7 ${c} + ${q * d} \u00f7 ${d}`, numBlank((a + b) * c + q));
}

export function genU1MainMix() { return rand(1, 2) === 1 ? genU1MainMixOrder() : genU1MainMixParen(); }

/* ── PDF 제너레이터 ── */

export const PDF_GENERATORS_U1 = {
  add_2d() { const a = rand(11, 89), b = rand(11, 99 - a); return { num1: a, num2: b, op: '+', ans: a + b }; },
  add_3d() { const a = rand(100, 499), b = rand(100, 400); return { num1: a, num2: b, op: '+', ans: a + b }; },
  sub_2d() { const b = rand(11, 49), a = b + rand(10, 50); return { num1: a, num2: b, op: '\u2212', ans: a - b }; },
  sub_3d() { const b = rand(100, 399), a = b + rand(10, 300); return { num1: a, num2: b, op: '\u2212', ans: a - b }; },
  mul_2d1d() { const a = rand(12, 99), b = rand(2, 9); return { num1: a, num2: b, op: '\u00d7', ans: a * b }; },
  mul_2d2d() { const a = rand(12, 45), b = rand(11, 25); return { num1: a, num2: b, op: '\u00d7', ans: a * b }; },
  mul_3d2d() { const a = rand(100, 399), b = rand(11, 25); return { num1: a, num2: b, op: '\u00d7', ans: a * b }; },
  div_2d1d() { const dvsr = rand(2, 9), dvnd = rand(10, 99); return { dvsr, dvnd, quot: Math.floor(dvnd / dvsr), rem: dvnd % dvsr }; },
  div_2d1d_norem() { const dvsr = rand(2, 9), q = rand(3, Math.floor(99 / dvsr)), dvnd = dvsr * q; return { dvsr, dvnd, quot: q, rem: 0 }; },
  div_2d1d_rem() { const dvsr = rand(2, 9), q = rand(3, Math.floor((99 - dvsr + 1) / dvsr)), r = rand(1, dvsr - 1), dvnd = dvsr * q + r; if (dvnd > 99) return PDF_GENERATORS_U1.div_2d1d_rem(); return { dvsr, dvnd, quot: q, rem: r }; },
  div_3d1d() { const dvsr = rand(2, 9), dvnd = rand(100, 999); return { dvsr, dvnd, quot: Math.floor(dvnd / dvsr), rem: dvnd % dvsr }; },
  div_3d2d() { const dvsr = rand(11, 30), dvnd = rand(100, 999), quot = Math.floor(dvnd / dvsr); if (quot < 10) return PDF_GENERATORS_U1.div_3d2d(); return { dvsr, dvnd, quot, rem: dvnd % dvsr }; },
};
