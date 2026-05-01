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
