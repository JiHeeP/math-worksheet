'use strict';

/**
 * 6학년 1학기 카탈로그
 *
 * 현재 구현 단원:
 *   1단원 분수의 나눗셈
 *   3단원 소수의 나눗셈
 *
 * 미구현: 2단원 각기둥과 각뿔, 4단원 비와 비율, 5단원 여러가지 그래프,
 *         6단원 직육면체의 겉넓이와 부피
 */

import { defineUnit, 진단지, 선수학습, 선수복제, 차시, 학습지, unitRef } from '../catalog.js';
import { T } from '../templates.js';

import {
  genG61U1FracDivInt, genG61U1MixedDivInt, genG61U1IntDivIntAsFrac,
  genG61U1FracDivIntStep, genG61U1MixedDivIntStep, genG61U1IntDivIntAsFracStep,
} from '../generators/g6-1/u1.js';

import {
  genG61U3DecimalDivInt, genG61U3DecimalDivIntHundredths, genG61U3IntDivIntDecimal,
} from '../generators/g6-1/u3.js';

// [선수학습] 복제 원본이 있는 앞 학기 카탈로그
import * as g31 from './g3-1.js';
import * as g32 from './g3-2.js';
import * as g41 from './g4-1.js';
import * as g42 from './g4-2.js';
import * as g51 from './g5-1.js';
import * as g52 from './g5-2.js';

const GRADE_ID = 'g6-1';
const FRAC_DIV_STEP_LAYOUT = { grid: 'wide', count: 4 };
const DECIMAL_DIV_GRID_LAYOUT = { grid: 'wide', count: 6, defaultFontScale: 1.2 };

const u1 = defineUnit(GRADE_ID, 'u1', '분수의 나눗셈', [
  진단지({ id: 'u1_pre_diagnostic' }),
  선수학습({}, [
    선수복제(g31, 'u3_main_div_one_digit', 'u1_pre_div_one_digit'),
    선수복제(g51, 'u4_main_red', 'u1_pre_red'),
    선수복제(g32, 'u5_main_mixed_to_improper', 'u1_pre_mixed_to_improper'),
    선수복제(g52, 'u2_main_frac_times_frac', 'u1_pre_frac_times_frac'),
  ]),
  차시('1차시 자연수의 나눗셈을 분수로 나타내기', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(자연수) ÷ (자연수)를 분수로 나타내기', genG61U1IntDivIntAsFrac, {
      id: 'u1_main_int_div_int_frac',
      prereqs: [unitRef('g5-2', 'u2'), unitRef('g5-1', 'u4')],
    }),
    학습지('(자연수) ÷ (자연수) 계산 과정', T.fracDivStep, genG61U1IntDivIntAsFracStep, {
      id: 'u1_main_int_div_int_frac_step', layout: 'oneCol',
      prereqs: [unitRef('g5-2', 'u2'), unitRef('g5-1', 'u4')],
      ...FRAC_DIV_STEP_LAYOUT,
    }),
  ]),
  차시('2차시 (분수) ÷ (자연수)', { grid: 'practice', count: 15, controls: { fractionDifficulty: { stages: [1, 2, 3] } } }, [
    학습지('(진분수) ÷ (자연수)', genG61U1FracDivInt, {
      id: 'u1_main_frac_div_int',
      prereqs: [unitRef('g5-2', 'u2'), unitRef('g5-1', 'u4')],
    }),
    학습지('(진분수) ÷ (자연수) 계산 과정', T.fracDivStep, genG61U1FracDivIntStep, {
      id: 'u1_main_frac_div_int_step', layout: 'oneCol',
      prereqs: [unitRef('g5-2', 'u2'), unitRef('g5-1', 'u4')],
      ...FRAC_DIV_STEP_LAYOUT,
    }),
    학습지('(대분수) ÷ (자연수)', genG61U1MixedDivInt, {
      id: 'u1_main_mixed_div_int',
      prereqs: [unitRef('g5-2', 'u2'), unitRef('g5-1', 'u4')],
    }),
    학습지('(대분수) ÷ (자연수) 계산 과정', T.fracDivStep, genG61U1MixedDivIntStep, {
      id: 'u1_main_mixed_div_int_step', layout: 'oneCol',
      prereqs: [unitRef('g5-2', 'u2'), unitRef('g5-1', 'u4')],
      ...FRAC_DIV_STEP_LAYOUT,
    }),
  ]),
]);

const DECIMAL_DIV_PREREQS = [unitRef('g5-2', 'u4'), unitRef('g4-1', 'u3')];

const u3 = defineUnit(GRADE_ID, 'u3', '소수의 나눗셈', [
  진단지({ id: 'u3_pre_diagnostic' }),
  선수학습({}, [
    선수복제(g32, 'u3_main_div_2d1d', 'u3_pre_div_2d1d'),
    선수복제(g32, 'u3_main_div_3d1', 'u3_pre_div_3d1d'),
    선수복제(g41, 'u3_main_div_3d2d', 'u3_pre_div_3d2d'),
    선수복제(g42, 'u3_main_decimal_relation', 'u3_pre_decimal_relation'),
    선수복제(g52, 'u4_main_decimal_times_int', 'u3_pre_decimal_times_int'),
  ]),
  차시('1차시 (소수) ÷ (자연수)', { grid: 'practice', count: 15 }, [
    학습지('소수 한 자리 수 ÷ 자연수', T.decimalLongDiv, genG61U3DecimalDivInt, {
      id: 'u3_main_decimal_div_int_tenths',
      prereqs: DECIMAL_DIV_PREREQS,
      ...DECIMAL_DIV_GRID_LAYOUT,
    }),
    학습지('소수 두 자리 수 ÷ 자연수', T.decimalLongDiv, genG61U3DecimalDivIntHundredths, {
      id: 'u3_main_decimal_div_int_hundredths',
      prereqs: DECIMAL_DIV_PREREQS,
      ...DECIMAL_DIV_GRID_LAYOUT,
    }),
  ]),
  차시('2차시 자연수의 나눗셈과 소수 몫', { grid: 'standard', count: 20 }, [
    학습지('자연수 ÷ 자연수', T.decimalLongDiv, genG61U3IntDivIntDecimal, {
      id: 'u3_main_int_div_int',
      prereqs: DECIMAL_DIV_PREREQS,
      ...DECIMAL_DIV_GRID_LAYOUT,
    }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '6-1',
  name: '6학년 1학기',
  units: {
    u1: { short: '1단원', name: '분수의 나눗셈' },
    u3: { short: '3단원', name: '소수의 나눗셈' },
  },
};

export const entries = [...u1, ...u3];

export const pdfMap = {};
export const pdfGenerators = {};
