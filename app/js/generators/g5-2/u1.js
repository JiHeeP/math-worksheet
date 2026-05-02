'use strict';

/**
 * 5학년 2학기 1단원 — 수의 범위와 어림하기
 * 이상/이하/초과/미만, 올림/버림/반올림.
 */

import { rand, randChoice } from '../../utils.js';
import { numBlank } from '../../helpers.js';
import { conceptProblem, horizProblem } from '../../templates.js';

const PLACE_NAMES = { 10: '십', 100: '백', 1000: '천', 10000: '만' };

/* ── 본단원 ── */

// 1·2차시 — 이상·이하 분류
export function genG52U1IneqGE() {
  const threshold = rand(20, 90);
  const candidates = Array.from({ length: 5 }, () => rand(threshold - 10, threshold + 15));
  const matches = candidates.filter((n) => n >= threshold);
  const answer = matches.length === 0
    ? '없음'
    : matches.sort((a, b) => a - b).join(', ');
  return conceptProblem(
    `다음 수 중에서 <b>${threshold} 이상</b>인 수를 모두 쓰시오.<br>${candidates.join(', ')}`,
    numBlank(answer),
  );
}

export function genG52U1IneqLE() {
  const threshold = rand(20, 90);
  const candidates = Array.from({ length: 5 }, () => rand(threshold - 15, threshold + 10));
  const matches = candidates.filter((n) => n <= threshold);
  const answer = matches.length === 0
    ? '없음'
    : matches.sort((a, b) => a - b).join(', ');
  return conceptProblem(
    `다음 수 중에서 <b>${threshold} 이하</b>인 수를 모두 쓰시오.<br>${candidates.join(', ')}`,
    numBlank(answer),
  );
}

// 3차시 — 초과·미만 분류
export function genG52U1IneqGT() {
  const threshold = rand(20, 90);
  const candidates = Array.from({ length: 5 }, () => rand(threshold - 10, threshold + 15));
  const matches = candidates.filter((n) => n > threshold);
  const answer = matches.length === 0
    ? '없음'
    : matches.sort((a, b) => a - b).join(', ');
  return conceptProblem(
    `다음 수 중에서 <b>${threshold} 초과</b>인 수를 모두 쓰시오.<br>${candidates.join(', ')}`,
    numBlank(answer),
  );
}

export function genG52U1IneqLT() {
  const threshold = rand(20, 90);
  const candidates = Array.from({ length: 5 }, () => rand(threshold - 15, threshold + 10));
  const matches = candidates.filter((n) => n < threshold);
  const answer = matches.length === 0
    ? '없음'
    : matches.sort((a, b) => a - b).join(', ');
  return conceptProblem(
    `다음 수 중에서 <b>${threshold} 미만</b>인 수를 모두 쓰시오.<br>${candidates.join(', ')}`,
    numBlank(answer),
  );
}

// 4차시 — 수의 범위 (이상과 이하의 결합)
export function genG52U1RangeGELE() {
  const lo = rand(20, 60);
  const hi = lo + rand(8, 25);
  const candidates = Array.from({ length: 6 }, () => rand(lo - 5, hi + 5));
  const matches = candidates.filter((n) => n >= lo && n <= hi);
  const answer = matches.length === 0
    ? '없음'
    : matches.sort((a, b) => a - b).join(', ');
  return conceptProblem(
    `<b>${lo} 이상 ${hi} 이하</b>인 수를 다음에서 모두 쓰시오.<br>${candidates.join(', ')}`,
    numBlank(answer),
  );
}

// 5차시 — 올림
export function genG52U1RoundUp() {
  const place = randChoice([10, 100, 1000]);
  const n = rand(place * 5, place * 999);
  const rounded = Math.ceil(n / place) * place;
  return horizProblem(`${n}을 ${PLACE_NAMES[place]}의 자리에서 올림`, numBlank(rounded));
}

// 6차시 — 버림
export function genG52U1RoundDown() {
  const place = randChoice([10, 100, 1000]);
  const n = rand(place * 5, place * 999);
  const rounded = Math.floor(n / place) * place;
  return horizProblem(`${n}을 ${PLACE_NAMES[place]}의 자리에서 버림`, numBlank(rounded));
}

// 7차시 — 반올림
export function genG52U1RoundHalf() {
  const place = randChoice([10, 100, 1000]);
  const n = rand(place * 5, place * 999);
  const rounded = Math.round(n / place) * place;
  return horizProblem(`${n}을 ${PLACE_NAMES[place]}의 자리에서 반올림`, numBlank(rounded));
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
  return horizProblem(`${n}을 ${PLACE_NAMES[place]}의 자리에서 ${op.name}`, numBlank(rounded));
}
