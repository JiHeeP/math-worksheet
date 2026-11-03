'use strict';

/**
 * 5학년 2학기 4단원 — 소수의 곱셈
 *
 * 반환 데이터:
 *   num1, num2 : 문제에 쓰이는 두 수 (문자열)
 *   ans        : 정답 (끝자리 0을 지운 형태, 예: '1.8', '10')
 *   workAns    : 세로셈 격자용 정답 (자연수 곱에 소수점만 찍은 형태, 예: '1.80', '10.0')
 *               — 세로셈은 오른쪽 끝을 맞춰 계산하므로 끝자리 0까지 자리를 지켜야 함
 */

import { rand } from '../../utils.js';

function dec(value) {
  return Number(value.toFixed(3)).toString();
}

/** 자연수 곱 product 에 소수점 아래 places 자리를 찍은 문자열 (끝자리 0 유지) */
function placeDecimal(product, places) {
  if (places === 0) return String(product);
  return (product / (10 ** places)).toFixed(places);
}

/** 일의 자리 숫자가 0이 아닌 min~max 정수 — ÷10 했을 때 소수 첫째 자리가 0이 되지 않게 */
function randNonMultipleOf10(min, max) {
  let n;
  do {
    n = rand(min, max);
  } while (n % 10 === 0);
  return n;
}

function decimalProblem(int1, places1, int2, places2, workRows) {
  const places = places1 + places2;
  const product = int1 * int2;
  return {
    num1: placeDecimal(int1, places1),
    num2: placeDecimal(int2, places2),
    op: '×',
    ans: dec(product / (10 ** places)),
    workAns: placeDecimal(product, places),
    workRows,
  };
}

export function genG52U4DecimalTimesInt() {
  return decimalProblem(randNonMultipleOf10(2, 99), 1, rand(2, 9), 0, 1);
}

export function genG52U4IntTimesDecimal() {
  return decimalProblem(rand(2, 9), 0, randNonMultipleOf10(2, 99), 1, 1);
}

export function genG52U4DecimalTimesDecimalTenths() {
  return decimalProblem(randNonMultipleOf10(2, 99), 1, randNonMultipleOf10(2, 99), 1, 2);
}

export function genG52U4DecimalTimes10() {
  const a = rand(2, 999);
  const unit = [10, 100][rand(0, 1)];
  return { num1: dec(a / 10), num2: String(unit), op: '×', ans: dec((a / 10) * unit), workRows: 1 };
}
