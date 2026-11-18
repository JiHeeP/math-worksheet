'use strict';

/**
 * 자연수 계산 단계 판별·어림 공통 함수 (2026-11-18 추가)
 *
 * 받아올림·받아내림·곱셈 올림 횟수를 세어, 학습지가 "단계별"로 문항을 고를 수 있게 한다.
 * 어림(몇백·몇십으로 어림하기)도 여기서 계산한다. HTML 은 만들지 않는다.
 */

/** 덧셈 a + b 의 받아올림 횟수 (일·십·백의 자리 …) */
export function addCarryCount(a, b) {
  let carry = 0, count = 0;
  while (a > 0 || b > 0) {
    const s = (a % 10) + (b % 10) + carry;
    carry = s >= 10 ? 1 : 0;
    count += carry;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return count;
}

/** 뺄셈 a − b (a > b) 의 받아내림 횟수 */
export function subBorrowCount(a, b) {
  let borrow = 0, count = 0;
  while (a > 0 || b > 0) {
    const d = (a % 10) - (b % 10) - borrow;
    borrow = d < 0 ? 1 : 0;
    count += borrow;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return count;
}

/** 곱셈 a × b (b 는 한 자리) 에서 올림이 생기는 자리 수 */
export function mulCarryCount(a, b) {
  let carry = 0, count = 0;
  while (a > 0) {
    const p = (a % 10) * b + carry;
    carry = Math.floor(p / 10);
    if (carry > 0) count++;
    a = Math.floor(a / 10);
  }
  return count;
}

/**
 * 가장 가까운 몇백·몇십으로 어림한 값.
 * 정확히 가운데(예: 250, 45)는 어느 쪽인지 헷갈리므로 null (출제 제외).
 * 이미 몇백·몇십인 수도 어림할 필요가 없으므로 null.
 */
export function roundToUnit(n, unit) {
  const r = n % unit;
  if (r === 0 || r * 2 === unit) return null;
  return Math.round(n / unit) * unit;
}
