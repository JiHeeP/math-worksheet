'use strict';

/**
 * 6학년 2학기 카탈로그
 *
 * 현재 구현 단원:
 *   1단원 분수의 나눗셈
 *   3단원 소수의 나눗셈
 *
 * 미구현: 2단원 공간과 입체, 4단원 비례식과 비례배분,
 *         5단원 원의 넓이, 6단원 원기둥,원뿔,구
 */

import { defineUnit, 차시, 학습지, unitRef } from '../catalog.js';

import {
  genG62U1FracDivFrac, genG62U1IntDivFrac, genG62U1MixedDivFrac,
} from '../generators/g6-2/u1.js';

import {
  genG62U3DecimalDivDecimalTenths,
  genG62U3DecimalDivDecimalHundredths,
  genG62U3DecimalDivMix,
} from '../generators/g6-2/u3.js';

const GRADE_ID = 'g6-2';

const u1 = defineUnit(GRADE_ID, 'u1', '분수의 나눗셈', [
  차시('1차시 (분수) ÷ (분수)', { grid: 'practice', count: 15 }, [
    학습지('(진분수) ÷ (진분수)', genG62U1FracDivFrac, {
      id: 'u1_main_frac_div_frac',
      prereqs: [unitRef('g6-1', 'u1')],
    }),
  ]),
  차시('2차시 (자연수) ÷ (분수)', { grid: 'practice', count: 15 }, [
    학습지('(자연수) ÷ (진분수)', genG62U1IntDivFrac, {
      id: 'u1_main_int_div_frac',
      prereqs: [unitRef('g6-1', 'u1')],
    }),
  ]),
  차시('3차시 (대분수) ÷ (분수)', { grid: 'practice', count: 15 }, [
    학습지('(대분수) ÷ (진분수)', genG62U1MixedDivFrac, {
      id: 'u1_main_mixed_div_frac',
      prereqs: [unitRef('g6-1', 'u1')],
    }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '소수의 나눗셈', [
  차시('1차시 (소수) ÷ (소수)', { grid: 'practice', count: 15 }, [
    학습지('소수 한 자리 수로 나누기', genG62U3DecimalDivDecimalTenths, {
      id: 'u3_main_decimal_div_decimal_tenths',
      prereqs: [unitRef('g6-1', 'u3')],
    }),
    학습지('소수 두 자리 수로 나누기', genG62U3DecimalDivDecimalHundredths, {
      id: 'u3_main_decimal_div_decimal_hundredths',
      prereqs: [unitRef('g6-1', 'u3')],
    }),
  ]),
  차시('2차시 소수의 나눗셈 혼합', { grid: 'practice', count: 15 }, [
    학습지('소수의 나눗셈 혼합', genG62U3DecimalDivMix, {
      id: 'u3_main_decimal_div_mix',
      prereqs: [unitRef('g6-1', 'u3')],
    }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '6-2',
  name: '6학년 2학기',
  units: {
    u1: { short: '1단원', name: '분수의 나눗셈' },
    u3: { short: '3단원', name: '소수의 나눗셈' },
  },
};

export const entries = [...u1, ...u3];

export const pdfMap = {};
export const pdfGenerators = {};
