'use strict';

/**
 * 2학년 2학기 카탈로그
 *
 * 현재 구현 단원:
 *   1단원 네 자리수
 *   2단원 곱셈구구 — 단별 학습지 분리 방식 (Phase 4 결정)
 *
 * 미구현: 3단원 길이 재기, 4단원 시각과 시간, 5단원 표와 그래프, 6단원 규칙 찾기
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genG22U1ModelToNumber, genG22U1PlaceValue, genG22U1Expanded, genG22U1Compare4d,
} from '../generators/g2-2/u1.js';

import {
  makeGugudanGen, genG22U2GugudanMix, genG22U2GugudanBlank,
} from '../generators/g2-2/u2.js';

const GRADE_ID = 'g2-2';

/* ── 1단원 네 자리수 ── */

const u1 = defineUnit(GRADE_ID, 'u1', '네 자리수', [
  차시('1차시 네 자리 수의 자릿값', { grid: 'concept', count: 8 }, [
    학습지('모형 보고 네 자리 수 쓰기', genG22U1ModelToNumber, { id: 'u1_main_model_to_number', grid: 'wide', count: 6 }),
    학습지('천·백·십·일의 자리', genG22U1PlaceValue, { id: 'u1_main_place_value' }),
    학습지('네 자리 수 만들기', genG22U1Expanded, { id: 'u1_main_expanded' }),
  ]),
  차시('2차시 네 자리 수의 크기', { grid: 'standard', count: 20 }, [
    학습지('네 자리 수 크기 비교', genG22U1Compare4d, { id: 'u1_main_compare' }),
  ]),
]);

/* ── 2단원 곱셈구구 — 단별 학습지 ── */

const u2 = defineUnit(GRADE_ID, 'u2', '곱셈구구', [
  차시('1차시 2단', { grid: 'dense', count: 36 }, [
    학습지('2단', makeGugudanGen(2), { id: 'u2_main_gugudan_2' }),
  ]),
  차시('2차시 3단', { grid: 'dense', count: 36 }, [
    학습지('3단', makeGugudanGen(3), { id: 'u2_main_gugudan_3' }),
  ]),
  차시('3차시 4단', { grid: 'dense', count: 36 }, [
    학습지('4단', makeGugudanGen(4), { id: 'u2_main_gugudan_4' }),
  ]),
  차시('4차시 5단', { grid: 'dense', count: 36 }, [
    학습지('5단', makeGugudanGen(5), { id: 'u2_main_gugudan_5' }),
  ]),
  차시('5차시 6단', { grid: 'dense', count: 36 }, [
    학습지('6단', makeGugudanGen(6), { id: 'u2_main_gugudan_6' }),
  ]),
  차시('6차시 7단', { grid: 'dense', count: 36 }, [
    학습지('7단', makeGugudanGen(7), { id: 'u2_main_gugudan_7' }),
  ]),
  차시('7차시 8단', { grid: 'dense', count: 36 }, [
    학습지('8단', makeGugudanGen(8), { id: 'u2_main_gugudan_8' }),
  ]),
  차시('8차시 9단', { grid: 'dense', count: 36 }, [
    학습지('9단', makeGugudanGen(9), { id: 'u2_main_gugudan_9' }),
  ]),
  차시('1~8차시 곱셈구구 혼합', { grid: 'dense', count: 36 }, [
    학습지('곱셈구구 (기본)', genG22U2GugudanMix, { id: 'u2_main_gugudan_basic' }),
    학습지('곱셈구구 (2~9단 혼합)', genG22U2GugudanMix, { id: 'u2_main_gugudan_mix' }),
  ]),
  차시('9차시 곱셈구구 빈칸형', { grid: 'standard', count: 20 }, [
    학습지('곱셈구구 (빈칸)', genG22U2GugudanBlank, { id: 'u2_main_gugudan_blank_original' }),
    학습지('곱셈구구 (빈칸형)', genG22U2GugudanBlank, { id: 'u2_main_gugudan_blank' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '2-2',
  name: '2학년 2학기',
  units: {
    u1: { short: '1단원', name: '네 자리수' },
    u2: { short: '2단원', name: '곱셈구구' },
  },
};

export const entries = [...u1, ...u2];

export const pdfMap = {};
export const pdfGenerators = {};
