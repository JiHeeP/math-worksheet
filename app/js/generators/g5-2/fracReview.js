'use strict';

/**
 * 5학년 2학기 — 분수 총연습: 분모가 같은 분수의 덧셈·뺄셈 (유형 섞기)
 *
 * 덧셈
 *   유형 1: (진분수)+(진분수), 합이 1 이상          → 단계 풀이
 *   유형 2: (대분수)+(대분수), 분수끼리 합이 1 이상 → 단계 풀이 (받아올림)
 *   유형 3: (진분수)+(진분수), 합이 1 미만          → 한 줄
 *   유형 4: (대분수)+(대분수), 분수끼리 합이 1 미만 → 한 줄
 * 뺄셈
 *   유형 1: (자연수)−(진분수), 자연수에서 1 받아내림 → 단계 풀이 (1−진분수 포함)
 *   유형 2: (진분수)−(진분수)                        → 한 줄
 *   유형 3: (대분수)−(대분수), 분수끼리 뺄 수 없어 받아내림 → 단계 풀이
 *   유형 4: (대분수)−(대분수), 받아내림 없음         → 한 줄
 *
 * 제너레이터는 { type, ...data } 만 반환하고, 그리기는 T.sameFracMixed 가 맡는다.
 * 유형 배분은 pickBalanced 로 문항 번호 기준 반반(또는 4등분)을 보장한다.
 */

import { rand, properFracLimitsForStage, mixedWholeForStage, pickBalanced } from '../../utils.js';
import {
  genG42U1AddGe1, genG42U1MixedAddCarry,
  genG42U11MinusFrac, genG42U1IntMinusFrac, genG42U1MixedSubBorrow,
} from '../g4-2/u1.js';

function pickD(ctx, dMinFloor = 3) {
  const { dMin, dMax } = properFracLimitsForStage(ctx.fractionStage || 2);
  return rand(Math.max(dMinFloor, dMin), dMax);
}

/* ── 유형별 데이터 ── */

const TYPE_GENERATORS = {
  // 덧셈
  addGe1: (ctx) => genG42U1AddGe1(ctx),
  mixedAddCarry: (ctx) => genG42U1MixedAddCarry(ctx),
  addLt1: (ctx) => {
    const d = pickD(ctx, 3);
    const a = rand(1, Math.max(1, Math.floor(d / 2)));
    const b = rand(1, Math.max(1, d - a - 1));
    return { a, b, d };
  },
  mixedAddNoCarry: (ctx) => {
    const d = pickD(ctx, 4);
    const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
    const n1 = rand(1, d - 2);
    const n2 = rand(1, d - 1 - n1);
    return { w1: rand(wMin, wMax), n1, w2: rand(wMin, wMax), n2, d };
  },
  // 뺄셈
  intMinusFrac: (ctx) => (rand(1, 4) === 1
    ? { ...genG42U11MinusFrac(ctx), type: 'oneMinusFrac' }
    : genG42U1IntMinusFrac(ctx)),
  mixedSubBorrow: (ctx) => genG42U1MixedSubBorrow(ctx),
  subFrac: (ctx) => {
    const d = pickD(ctx, 3);
    const b = rand(1, d - 2);
    const a = rand(b + 1, d - 1);
    return { a, b, d };
  },
  mixedSubNoBorrow: (ctx) => {
    const d = pickD(ctx, 4);
    const { wMin, wMax } = mixedWholeForStage(ctx.fractionStage || 2);
    const w2 = rand(wMin, wMax);
    const n2 = rand(1, d - 2);
    return { w1: rand(w2 + 1, w2 + 4), n1: rand(n2 + 1, d - 1), w2, n2, d };
  },
};

function makeMixer(key, types) {
  return (ctx = {}, problemIndex) => {
    const type = pickBalanced(key, types, problemIndex);
    return { type, ...TYPE_GENERATORS[type](ctx) };
  };
}

/* ── 덧셈 ── */
// 유형 1·3: 진분수끼리 (합이 1 이상 / 미만 반반)
export const genG52ReviewSameAdd13 = makeMixer('sameAdd13', ['addGe1', 'addLt1']);
// 유형 2·4: 대분수끼리 (받아올림 있음 / 없음 반반)
export const genG52ReviewSameAdd24 = makeMixer('sameAdd24', ['mixedAddCarry', 'mixedAddNoCarry']);
// 유형 1~4 모두
export const genG52ReviewSameAddAll = makeMixer('sameAddAll', ['addGe1', 'mixedAddCarry', 'addLt1', 'mixedAddNoCarry']);

/* ── 뺄셈 ── */
// 유형 1·3: 받아내림 있음 ((자연수)−(진분수) / (대분수)−(대분수) 반반)
export const genG52ReviewSameSub13 = makeMixer('sameSub13', ['intMinusFrac', 'mixedSubBorrow']);
// 유형 2·4: 받아내림 없음 ((진분수)−(진분수) / (대분수)−(대분수) 반반)
export const genG52ReviewSameSub24 = makeMixer('sameSub24', ['subFrac', 'mixedSubNoBorrow']);
// 유형 1~4 모두
export const genG52ReviewSameSubAll = makeMixer('sameSubAll', ['intMinusFrac', 'subFrac', 'mixedSubBorrow', 'mixedSubNoBorrow']);
