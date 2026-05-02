'use strict';

/**
 * 2학년 1학기 카탈로그
 *
 * 3단원 덧셈과 뺄셈(5):
 *  - 가로셈 (받아올림/내림 단계별 학습) — 자체 generator
 *  - 세로셈 (혼합) — 5-1 선수학습용 PDF generator (add_2d, sub_2d) 재사용
 *    교과서가 2-1에서 두 자리 덧·뺄셈을 세로셈 표준으로 가르침.
 *
 * 미구현 단원: 1단원 세 자리 수, 2단원 여러 가지 도형, 4단원 길이재기,
 *              5단원 분류하기, 6단원 곱셈(1)
 */

import { defineUnit, 차시, 학습지, unitRef } from '../catalog.js';

import {
  genG21U3Add2d2dNoCarry, genG21U3Add2d2dSingle, genG21U3Add2d2dDouble, genG21U3Add2d2dMix,
  genG21U3Sub2d2dNoBorrow, genG21U3Sub2d2dBorrow, genG21U3Sub2d2dMix,
  genG21U3Sub2d1dBorrow,
} from '../generators/g2-1/u3.js';

// 5-1 선수학습으로 쓰던 두 자리 덧/뺄셈 generator 를 본단원에서도 재사용
import { genU1PreAdd2d, genU1PreSub2d, PDF_GENERATORS_U1 } from '../generators/g5-1/u1.js';

const GRADE_ID = 'g2-1';

const u3 = defineUnit(GRADE_ID, 'u3', '덧셈과 뺄셈(5)', [
  차시('1차시 (두 자리) + (두 자리), 받아올림 없음', { grid: 'standard', count: 20 }, [
    학습지('두 자리 + 두 자리 (받아올림 없음)', genG21U3Add2d2dNoCarry, {
      id: 'u3_main_add_no_carry',
      prereqs: [unitRef('g1-2', 'u4')],
    }),
  ]),
  차시('2차시 (두 자리) + (두 자리), 받아올림 1회', { grid: 'standard', count: 20 }, [
    학습지('두 자리 + 두 자리 (받아올림 1회)', genG21U3Add2d2dSingle, {
      id: 'u3_main_add_single',
      prereqs: [unitRef('g1-2', 'u7')],
    }),
  ]),
  차시('3차시 (두 자리) + (두 자리), 받아올림 2회', { grid: 'standard', count: 20 }, [
    학습지('두 자리 + 두 자리 (받아올림 2회)', genG21U3Add2d2dDouble, {
      id: 'u3_main_add_double',
    }),
  ]),
  차시('4차시 (두 자리) + (두 자리) 혼합', { grid: 'standard', count: 20 }, [
    학습지('두 자리 + 두 자리 (혼합)', genG21U3Add2d2dMix, {
      id: 'u3_main_add_mix',
    }),
  ]),
  차시('4차시 (두 자리) + (두 자리) 세로셈', { kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 + 두 자리 (세로셈)', genU1PreAdd2d, { id: 'u3_main_add_2d_vertical' }),
  ]),
  차시('5차시 (두 자리) − (한 자리), 받아내림', { grid: 'standard', count: 20 }, [
    학습지('두 자리 − 한 자리 (받아내림)', genG21U3Sub2d1dBorrow, {
      id: 'u3_main_sub_2d1d_borrow',
      prereqs: [unitRef('g1-2', 'u7')],
    }),
  ]),
  차시('6차시 (두 자리) − (두 자리), 받아내림 없음', { grid: 'standard', count: 20 }, [
    학습지('두 자리 − 두 자리 (받아내림 없음)', genG21U3Sub2d2dNoBorrow, {
      id: 'u3_main_sub_no_borrow',
      prereqs: [unitRef('g1-2', 'u4')],
    }),
  ]),
  차시('7차시 (두 자리) − (두 자리), 받아내림 있음', { grid: 'standard', count: 20 }, [
    학습지('두 자리 − 두 자리 (받아내림 있음)', genG21U3Sub2d2dBorrow, {
      id: 'u3_main_sub_borrow',
    }),
  ]),
  차시('8차시 (두 자리) − (두 자리) 혼합', { grid: 'standard', count: 20 }, [
    학습지('두 자리 − 두 자리 (혼합)', genG21U3Sub2d2dMix, {
      id: 'u3_main_sub_mix',
    }),
  ]),
  차시('8차시 (두 자리) − (두 자리) 세로셈', { kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 − 두 자리 (세로셈)', genU1PreSub2d, { id: 'u3_main_sub_2d_vertical' }),
  ]),
]);

export const meta = {
  id: GRADE_ID,
  short: '2-1',
  name: '2학년 1학기',
  units: {
    u3: { short: '3단원', name: '덧셈과 뺄셈(5)' },
  },
};

export const entries = [...u3];

export const pdfMap = {
  'g2-1_u3_main_add_2d_vertical': 'add_2d',
  'g2-1_u3_main_sub_2d_vertical': 'sub_2d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
