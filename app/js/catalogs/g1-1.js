'use strict';

/**
 * 1학년 1학기 카탈로그
 *
 * 현재 구현 단원:
 *   3단원 덧셈과 뺄셈(1)
 *
 * 미구현: 1단원 9까지의 수, 2단원 여러 가지 모양, 4단원 비교하기, 5단원 50까지의 수
 *   (수 세기·도형·비교 단원은 별도 디자인 필요 — Phase 5)
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

import {
  genG11U3Add9, genG11U3Sub9,
} from '../generators/g1-1/u3.js';

const GRADE_ID = 'g1-1';

const u3 = defineUnit(GRADE_ID, 'u3', '덧셈과 뺄셈(1)', [
  차시('1차시 9 이하 한 자리 덧셈', { grid: 'standard', count: 20 }, [
    학습지('9 이하 한 자리 덧셈', genG11U3Add9, { id: 'u3_main_add9' }),
  ]),
  차시('2차시 9 이하 한 자리 뺄셈', { grid: 'standard', count: 20 }, [
    학습지('9 이하 한 자리 뺄셈', genG11U3Sub9, { id: 'u3_main_sub9' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '1-1',
  name: '1학년 1학기',
  units: {
    u3: { short: '3단원', name: '덧셈과 뺄셈(1)' },
  },
};

export const entries = [...u3];

export const pdfMap = {};
export const pdfGenerators = {};
