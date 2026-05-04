'use strict';

/**
 * 1학년 1학기 카탈로그
 *
 * 현재 구현 단원:
 *   1단원 9까지의 수
 *   3단원 덧셈과 뺄셈
 *   5단원 50까지의 수
 *
 * 미구현: 2단원 여러가지모양, 4단원 비교하기
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genG11U1CountTo9, genG11U1NumberOrder, genG11U1CompareTo9,
} from '../generators/g1-1/u1.js';

import {
  genG11U3Add9, genG11U3Sub9,
} from '../generators/g1-1/u3.js';

import {
  genG11U5CountTo50, genG11U5TensOnes, genG11U5CompareTo50,
} from '../generators/g1-1/u5.js';

const GRADE_ID = 'g1-1';

const u1 = defineUnit(GRADE_ID, 'u1', '9까지의 수', [
  차시('1차시 수 세기', { grid: 'concept', count: 8 }, [
    학습지('9까지의 수 세기', genG11U1CountTo9, { id: 'u1_main_count_to_9' }),
  ]),
  차시('2차시 수의 순서와 크기', { grid: 'standard', count: 20 }, [
    학습지('9까지의 수 순서', genG11U1NumberOrder, { id: 'u1_main_order_to_9' }),
    학습지('9까지의 수 크기 비교', genG11U1CompareTo9, { id: 'u1_main_compare_to_9' }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '덧셈과 뺄셈', [
  차시('1차시 9 이하 한 자리 덧셈', { grid: 'standard', count: 20 }, [
    학습지('9 이하 한 자리 덧셈', genG11U3Add9, { id: 'u3_main_add9' }),
  ]),
  차시('2차시 9 이하 한 자리 뺄셈', { grid: 'standard', count: 20 }, [
    학습지('9 이하 한 자리 뺄셈', genG11U3Sub9, { id: 'u3_main_sub9' }),
  ]),
]);

const u5 = defineUnit(GRADE_ID, 'u5', '50까지의 수', [
  차시('1차시 50까지의 수 세기', { grid: 'concept', count: 8 }, [
    학습지('50까지의 수 세기', genG11U5CountTo50, { id: 'u5_main_count_to_50' }),
    학습지('십과 낱개로 나타내기', genG11U5TensOnes, { id: 'u5_main_tens_ones' }),
  ]),
  차시('2차시 50까지의 수 크기 비교', { grid: 'standard', count: 20 }, [
    학습지('50까지의 수 크기 비교', genG11U5CompareTo50, { id: 'u5_main_compare_to_50' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '1-1',
  name: '1학년 1학기',
  units: {
    u1: { short: '1단원', name: '9까지의 수' },
    u3: { short: '3단원', name: '덧셈과 뺄셈' },
    u5: { short: '5단원', name: '50까지의 수' },
  },
};

export const entries = [...u1, ...u3, ...u5];

export const pdfMap = {};
export const pdfGenerators = {};
