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

export function relatedDenominatorPair(dMin, dMax) {
  for (let tries = 0; tries < 200; tries++) {
    const d1 = rand(dMin, dMax);
    const d2 = rand(dMin, dMax);
    if (d1 !== d2 && gcd(d1, d2) > 1) return { d1, d2 };
  }

  for (let d1 = dMin; d1 <= dMax; d1++) {
    for (let d2 = dMin; d2 <= dMax; d2++) {
      if (d1 !== d2 && gcd(d1, d2) > 1) return { d1, d2 };
    }
  }

  return { d1: dMin, d2: dMin + 1 };
}

// 대분수 자연수부 단계
export function mixedWholeForStage(stage) {
  if (stage === 1) return { wMin: 1, wMax: 3 };
  if (stage === 3) return { wMin: 3, wMax: 6 };
  return { wMin: 2, wMax: 5 };
}

/* -- 유형 섞기: 문항 번호(problemIndex) 기준으로 유형을 고르게 배분 --
   options 개수(k)만큼 문항을 한 묶음으로 보고, 묶음마다 유형 순서를 섞는다.
   → 묶음 안에서는 각 유형이 정확히 1번씩 (반반·4등분 보장), 순서는 매번 무작위.
   problemIndex 가 없으면(회귀 테스트 등) 무작위로 하나 고른다. */

const balancedBlocks = new Map();

export function pickBalanced(key, options, problemIndex) {
  const idx = Number(problemIndex);
  if (!Number.isInteger(idx) || idx < 1) return randChoice(options);
  const k = options.length;
  const block = Math.floor((idx - 1) / k);
  const pos = (idx - 1) % k;
  let cached = balancedBlocks.get(key);
  // 묶음의 첫 문항이면 새로 섞는다 (새 학습지 = 1번 문항부터 다시 시작)
  if (pos === 0 || !cached || cached.block !== block) {
    const order = options.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [order[i], order[j]] = [order[j], order[i]];
    }
    cached = { block, order };
    balancedBlocks.set(key, cached);
  }
  return cached.order[pos];
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
  // 템플릿이 중복 판단 기준을 직접 준 경우 (예: 곱셈 원리 학습지는 '25×35' 같은 식 자체로 판단.
  // 모든 문항에 공통으로 들어가는 10, 0 같은 수 때문에 중복 검사가 매번 실패하지 않도록)
  if (Array.isArray(problem.uniqueKeys)) return problem.uniqueKeys;
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
