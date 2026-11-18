'use strict';

/**
 * 5학년 2학기 1단원 — 수의 범위와 어림하기
 * 이상/이하/초과/미만, 올림/버림/반올림.
 */

import { rand, randChoice, josa } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { conceptProblem, htmlProblem } from '../../templates.js';

const PLACE_NAMES = { 10: '십', 100: '백', 1000: '천', 10000: '만' };

/**
 * 어림 문항 — 교과서 표현 '올림하여 백의 자리까지 나타내면' 을 따른다.
 * (정답은 place 단위로 올림·버림·반올림한 값이므로 '~의 자리까지' 가 맞다.
 *  '~의 자리에서' 라고 쓰면 한 자리 위까지 어림한 값이 정답이 되어 서로 어긋남.)
 */
function roundProblem(n, place, opName, rounded) {
  return htmlProblem(
    'horiz-box',
    `${n}${josa.eulReul(n)} ${opName}하여 ${PLACE_NAMES[place]}의 자리까지 나타내면 ${numBlank(rounded)}`,
  );
}

/* ── 본단원 ── */

/**
 * 보기 수 만들기 — 서로 다른 수 count 개, 경계가 되는 수(mustInclude)를 반드시 넣고 순서를 섞는다.
 * 정답이 '없음'이거나 보기가 모두 정답이 되는 경우는 isMatch 로 걸러 다시 뽑는다.
 * (경계값이 있어야 '이상'과 '초과', '이하'와 '미만'의 차이를 연습할 수 있음)
 */
function pickCandidates(lo, hi, count, mustInclude, isMatch) {
  while (true) {
    const set = new Set(mustInclude);
    while (set.size < count) set.add(rand(lo, hi));
    const list = [...set];
    for (let i = list.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [list[i], list[j]] = [list[j], list[i]];
    }
    const matches = list.filter(isMatch);
    if (matches.length > 0 && matches.length < list.length) {
      return { list, answer: matches.sort((a, b) => a - b).join(', ') };
    }
  }
}

function ineqProblem(threshold, word, lo, hi, isMatch) {
  const { list, answer } = pickCandidates(lo, hi, 5, [threshold], isMatch);
  return conceptProblem(
    `다음 수 중에서 <b>${threshold} ${word}</b>인 수를 모두 쓰시오.<br>${list.join(', ')}`,
    numBlank(answer),
  );
}

// 1·2차시 — 이상·이하 분류
export function genG52U1IneqGE() {
  const t = rand(20, 90);
  return ineqProblem(t, '이상', t - 10, t + 15, (n) => n >= t);
}

export function genG52U1IneqLE() {
  const t = rand(20, 90);
  return ineqProblem(t, '이하', t - 15, t + 10, (n) => n <= t);
}

// 3차시 — 초과·미만 분류
export function genG52U1IneqGT() {
  const t = rand(20, 90);
  return ineqProblem(t, '초과', t - 10, t + 15, (n) => n > t);
}

export function genG52U1IneqLT() {
  const t = rand(20, 90);
  return ineqProblem(t, '미만', t - 15, t + 10, (n) => n < t);
}

// 4차시 — 수의 범위 (이상과 이하의 결합)
export function genG52U1RangeGELE() {
  const lo = rand(20, 60);
  const hi = lo + rand(8, 25);
  // 양 끝 경계 중 하나 이상을 보기에 넣는다
  const edges = randChoice([[lo], [hi], [lo, hi]]);
  const { list, answer } = pickCandidates(lo - 5, hi + 5, 6, edges, (n) => n >= lo && n <= hi);
  return conceptProblem(
    `<b>${lo} 이상 ${hi} 이하</b>인 수를 다음에서 모두 쓰시오.<br>${list.join(', ')}`,
    numBlank(answer),
  );
}

// 5차시 — 올림
export function genG52U1RoundUp() {
  const place = randChoice([10, 100, 1000]);
  const n = rand(place * 5, place * 999);
  const rounded = Math.ceil(n / place) * place;
  return roundProblem(n, place, '올림', rounded);
}

// 6차시 — 버림
export function genG52U1RoundDown() {
  const place = randChoice([10, 100, 1000]);
  const n = rand(place * 5, place * 999);
  const rounded = Math.floor(n / place) * place;
  return roundProblem(n, place, '버림', rounded);
}

// 7차시 — 반올림
export function genG52U1RoundHalf() {
  const place = randChoice([10, 100, 1000]);
  const n = rand(place * 5, place * 999);
  const rounded = Math.round(n / place) * place;
  return roundProblem(n, place, '반올림', rounded);
}

// 어림 혼합
export function genG52U1RoundMix() {
  const ops = [
    { fn: (n, p) => Math.ceil(n / p) * p, name: '올림' },
    { fn: (n, p) => Math.floor(n / p) * p, name: '버림' },
    { fn: (n, p) => Math.round(n / p) * p, name: '반올림' },
  ];
  const op = randChoice(ops);
  const place = randChoice([10, 100, 1000]);
  const n = rand(place * 5, place * 999);
  const rounded = op.fn(n, place);
  return roundProblem(n, place, op.name, rounded);
}
