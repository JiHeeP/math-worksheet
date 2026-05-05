'use strict';

/**
 * 5학년 2학기 4단원 — 소수의 곱셈
 */

import { rand } from '../../utils.js';

function dec(value) {
  return Number(value.toFixed(3)).toString();
}

export function genG52U4DecimalTimesInt() {
  const a = rand(2, 99);
  const b = rand(2, 9);
  return { num1: dec(a / 10), num2: String(b), op: '×', ans: dec((a * b) / 10), workRows: 1 };
}

export function genG52U4IntTimesDecimal() {
  const a = rand(2, 9);
  const b = rand(2, 99);
  return { num1: String(a), num2: dec(b / 10), op: '×', ans: dec((a * b) / 10), workRows: 1 };
}

export function genG52U4DecimalTimesDecimalTenths() {
  const a = rand(2, 99);
  const b = rand(2, 99);
  return { num1: dec(a / 10), num2: dec(b / 10), op: '×', ans: dec((a * b) / 100), workRows: 2 };
}

export function genG52U4DecimalTimes10() {
  const a = rand(2, 999);
  const unit = [10, 100][rand(0, 1)];
  return { num1: dec(a / 10), num2: String(unit), op: '×', ans: dec((a / 10) * unit), workRows: 1 };
}
