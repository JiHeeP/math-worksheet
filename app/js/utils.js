'use strict';

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randChoice(items) {
  return items[rand(0, items.length - 1)];
}

export function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplify(n, d) {
  const g = gcd(Math.abs(n), Math.abs(d));
  return [n / g, d / g];
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function factorsOf(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) result.push(i);
  }
  return result;
}

export function multiplesOf(n, count) {
  return Array.from({ length: count }, (_, idx) => n * (idx + 1));
}

/* ── 숫자 난이도 단계 ── */

// 자연수 단계: 피연산자 정수 범위 [lo, hi]
export function numberRangeForStage(stage) {
  if (stage === 1) return [1, 20];
  if (stage === 3) return [50, 99];
  return [20, 50];
}

// 진분수 / 분수 곱셈·나눗셈 / 단일 분수 단계: 분모 범위
export function properFracLimitsForStage(stage) {
  if (stage === 1) return { dMin: 2, dMax: 10 };
  if (stage === 3) return { dMin: 6, dMax: 14 };
  return { dMin: 4, dMax: 12 };
}

// 분모 다른 분수(통분), 약분 단계: 분모 범위
export function lcdFracLimitsForStage(stage) {
  if (stage === 1) return { dMin: 2, dMax: 8 };
  if (stage === 3) return { dMin: 10, dMax: 50 };
  return { dMin: 6, dMax: 20 };
}

// 대분수 자연수부 단계
export function mixedWholeForStage(stage) {
  if (stage === 1) return { wMin: 1, wMax: 3 };
  if (stage === 3) return { wMin: 3, wMax: 6 };
  return { wMin: 2, wMax: 5 };
}

/* -- sheet-scoped context: 한 장 안에서 중복 방지 -- */

const sheetContext = { usedNumbers: new Set() };

export function resetSheetContext() {
  sheetContext.usedNumbers.clear();
}

function sheetHasAny(nums) {
  for (const n of nums) {
    if (sheetContext.usedNumbers.has(n)) return true;
  }
  return false;
}

function markSheetNumbers(nums) {
  nums.forEach((n) => sheetContext.usedNumbers.add(n));
}

function extractProblemNumbers(problem) {
  if (!problem || typeof problem !== 'object') return [];
  if (problem.kind === 'vertical') {
    const out = [];
    if (Number.isFinite(problem.num1)) out.push(problem.num1);
    if (Number.isFinite(problem.num2)) out.push(problem.num2);
    return out;
  }
  if (problem.kind === 'longdiv') {
    const out = [];
    if (Number.isFinite(problem.dvsr)) out.push(problem.dvsr);
    if (Number.isFinite(problem.dvnd)) out.push(problem.dvnd);
    return out;
  }
  if (problem.kind === 'html' && typeof problem.html === 'string') {
    const tmp = document.createElement('div');
    tmp.innerHTML = problem.html;
    tmp.querySelectorAll('[data-ans]').forEach((el) => el.remove());
    const text = tmp.textContent || '';
    const matches = text.match(/\d+/g);
    if (!matches) return [];
    return matches.map(Number);
  }
  return [];
}

export function generateWithUnique(generatorFn, maxAttempts = 80) {
  for (let i = 0; i < maxAttempts; i++) {
    const problem = generatorFn();
    const nums = extractProblemNumbers(problem);
    if (nums.length === 0 || !sheetHasAny(nums)) {
      markSheetNumbers(nums);
      return problem;
    }
  }
  const problem = generatorFn();
  markSheetNumbers(extractProblemNumbers(problem));
  return problem;
}
