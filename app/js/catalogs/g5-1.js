'use strict';

/**
 * 5학년 1학기 카탈로그
 *
 * 새 학년/학기를 추가할 때는 `app/js/catalogs/g{학년}-{학기}.js` 형태로
 * 같은 모양의 파일을 만들어, generators/g{학년}-{학기}/uN.js 의 함수들을
 * 가져와 defineUnit 으로 묶어주면 됩니다.
 */

import { defineUnit, 선수학습, 차시, 학습지, ext, unitRef, sheetRef } from '../catalog.js';
import { T } from '../templates.js';

import {
  genU1PreAdd2d, genU1PreSub2d, genU1PreMul2d1d, genU1PreDiv2d1d,
  genU1PreDiv2d1dNoRem, genU1PreDiv2d1dRem,
  genU1PreAdd, genU1PreSub, genU1PreMul, genU1PreMul3x2, genU1PreDiv,
  genDiv3d2, genDiv3d1,
  genU1MainAddSubOrder, genU1MainAddSubParen, genU1MainAddSubParenOrder,
  genU1MainMulDivOrder, genU1MainMulDivParen, genU1MainMulDivMix,
  genU1MainAddSubMulOrder, genU1MainAddSubMulParen, genU1MainAddSubMul,
  genU1MainAddSubDivOrder, genU1MainAddSubDivParen, genU1MainAddSubDiv,
  genU1MainMixOrder, genU1MainMixParen, genU1MainMix,
  PDF_GENERATORS_U1,
} from '../generators/g5-1/u1.js';

import {
  genU2PreMul, genU2PreDiv,
  genU2MainFactorConcept, genU2MainMultipleConcept,
  genU2MainCommonFactorConcept, genU2MainGcdData, genU2MainLcmData,
  genU2MainCommonMultipleConcept,
} from '../generators/g5-1/u2.js';

import {
  genU3MainRelationFind1, genU3MainRelationFind2,
  genU3MainRelationTable, genU3MainRelationFormula, genU3MainRelationReal,
} from '../generators/g5-1/u3.js';

import {
  genU4PreCmp, genU4PreConv,
  genU4MainEquivFind, genU4MainEquivMake,
  genU4MainRedProcess, genU4MainRed,
  genU4MainLcdProcess, genU4MainLcd,
  genU4MainCmp, genU4MainDecCmp,
} from '../generators/g5-1/u4.js';

import {
  genU5PreAdd, genU5PreAddGe1, genU5PreSub, genU5PreMixedSub,
  genU5PreMixedToImproperProcess, genU5PreMixedToImproper,
  genFracAddLt1, genFracAddGe1, genFracSub,
  genMixedAddNoCarry, genMixedAddCarry,
  genMixedSubNoBorrow, genMixedSubBorrow,
} from '../generators/g5-1/u5.js';

import {
  genU6PreUnit, genU6PreLen,
  genU6MainPerimeter, genU6MainUnitSquare, genU6MainRect, genU6MainAreaUnit,
  genU6MainPara, genU6MainTri, genU6MainTrap, genU6MainRhombus, genU6MainMix,
} from '../generators/g5-1/u6.js';

const GRADE_ID = 'g5-1';

/* ── 단원 정의 ── */

const u1 = defineUnit(GRADE_ID, 'u1', '자연수의 혼합 계산', [
  선수학습({ kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 수 덧셈', genU1PreAdd2d, { id: 'u1_pre_add_2d' }),
    학습지('두 자리 수 뺄셈', genU1PreSub2d, { id: 'u1_pre_sub_2d' }),
    학습지('두 자리 수 × 한 자리 수 (세로셈)', genU1PreMul2d1d, { id: 'u1_pre_mul_2d1d', count: 15 }),
    학습지('두 자리 수 ÷ 한 자리 수 (세로셈)', genU1PreDiv2d1d, { id: 'u1_pre_div_2d1d', kind: 'html', count: 12 }),
    학습지('두 자리 수 ÷ 한 자리 수 (나머지 없음)', genU1PreDiv2d1dNoRem, { id: 'u1_pre_div_2d1d_norem', count: 12 }),
    학습지('두 자리 수 ÷ 한 자리 수 (나머지 있음)', genU1PreDiv2d1dRem, { id: 'u1_pre_div_2d1d_rem', count: 12 }),
    학습지('세 자리 수 덧셈', genU1PreAdd, { id: 'u1_pre_add', count: 15 }),
    학습지('세 자리 수 뺄셈', genU1PreSub, { id: 'u1_pre_sub', count: 15 }),
    학습지('두 자리 수 × 두 자리 수 (세로셈)', genU1PreMul, { id: 'u1_pre_mul', count: 12 }),
    학습지('세 자리 수 × 두 자리 수 (세로셈)', genU1PreMul3x2, { id: 'u1_pre_mul_3x2', count: 12 }),
    학습지('두 자리 수 나눗셈 (가로셈)', genU1PreDiv, { id: 'u1_pre_div', kind: 'html' }),
    학습지('세 자리 수 ÷ 두 자리 수 (세로셈)', genDiv3d2, { id: 'u1_pre_div_3d2', grid: 'divgrid', count: 9 }),
    학습지('세 자리 수 ÷ 한 자리 수 (세로셈)', genDiv3d1, { id: 'u1_pre_div_3d1', grid: 'divgrid', count: 9 }),
  ]),
  차시('1차시 덧셈과 뺄셈이 섞여 있는 식 계산하기', { grid: 'standard', count: 20 }, [
    학습지('덧셈·뺄셈 혼합(순서)', genU1MainAddSubOrder, {
      id: 'u1_main_addsub_order',
      prereqs: [ext('[3-1] 덧셈과 뺄셈(6)')],
    }),
    학습지('덧셈·뺄셈 혼합(괄호)', genU1MainAddSubParen, {
      id: 'u1_main_addsub_paren',
      prereqs: [sheetRef('u1_main_addsub_order')],
    }),
    학습지('덧셈·뺄셈 혼합(괄호, 순서)', genU1MainAddSubParenOrder, {
      id: 'u1_main_addsub_mix',
      prereqs: [sheetRef('u1_main_addsub_paren')],
    }),
  ]),
  차시('2차시 곱셈과 나눗셈이 섞여 있는 식 계산하기', { grid: 'standard', count: 20 }, [
    학습지('곱셈·나눗셈 혼합(순서)', genU1MainMulDivOrder, {
      id: 'u1_main_muldiv_order',
      prereqs: [ext('[3-2] 곱셈(5)'), ext('[3-2] 나눗셈(6)')],
    }),
    학습지('곱셈·나눗셈 혼합(괄호)', genU1MainMulDivParen, {
      id: 'u1_main_muldiv_paren',
      prereqs: [sheetRef('u1_main_muldiv_order')],
    }),
    학습지('곱셈·나눗셈 혼합(괄호, 순서)', genU1MainMulDivMix, {
      id: 'u1_main_muldiv',
      prereqs: [sheetRef('u1_main_muldiv_paren')],
    }),
  ]),
  차시('3차시 덧셈, 뺄셈, 곱셈이 섞여 있는 식 계산하기', { grid: 'standard', count: 20 }, [
    학습지('덧셈·뺄셈·곱셈 혼합(순서)', genU1MainAddSubMulOrder, {
      id: 'u1_main_addsubmul_order',
      prereqs: [sheetRef('u1_main_addsub_mix'), sheetRef('u1_main_muldiv')],
    }),
    학습지('덧셈·뺄셈·곱셈 혼합(괄호)', genU1MainAddSubMulParen, {
      id: 'u1_main_addsubmul_paren',
      prereqs: [sheetRef('u1_main_addsubmul_order')],
    }),
    학습지('덧셈·뺄셈·곱셈 혼합(괄호, 순서)', genU1MainAddSubMul, {
      id: 'u1_main_addsubmul',
      prereqs: [sheetRef('u1_main_addsubmul_paren')],
    }),
  ]),
  차시('4차시 덧셈, 뺄셈, 나눗셈이 섞여 있는 식 계산하기', { grid: 'standard', count: 20 }, [
    학습지('덧셈·뺄셈·나눗셈 혼합(순서)', genU1MainAddSubDivOrder, {
      id: 'u1_main_addsubdiv_order',
      prereqs: [sheetRef('u1_main_addsub_mix'), sheetRef('u1_main_muldiv')],
    }),
    학습지('덧셈·뺄셈·나눗셈 혼합(괄호)', genU1MainAddSubDivParen, {
      id: 'u1_main_addsubdiv_paren',
      prereqs: [sheetRef('u1_main_addsubdiv_order')],
    }),
    학습지('덧셈·뺄셈·나눗셈 혼합(괄호, 순서)', genU1MainAddSubDiv, {
      id: 'u1_main_addsubdiv',
      prereqs: [sheetRef('u1_main_addsubdiv_paren')],
    }),
  ]),
  차시('5차시 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식 계산하기', { grid: 'standard', count: 20 }, [
    학습지('사칙 혼합(순서)', genU1MainMixOrder, {
      id: 'u1_main_mix_order',
      prereqs: [sheetRef('u1_main_addsubmul'), sheetRef('u1_main_addsubdiv')],
    }),
    학습지('사칙 혼합(괄호)', genU1MainMixParen, {
      id: 'u1_main_mix_paren',
      prereqs: [sheetRef('u1_main_mix_order')],
    }),
    학습지('사칙 혼합(괄호, 순서)', genU1MainMix, {
      id: 'u1_main_mix',
      prereqs: [sheetRef('u1_main_mix_paren')],
    }),
  ]),
]);

const u2 = defineUnit(GRADE_ID, 'u2', '약수와 배수', [
  선수학습({ grid: 'dense', count: 36 }, [
    학습지('곱셈구구', genU2PreMul, { id: 'u2_pre_mul' }),
    학습지('나눗셈 (한 자리 나누기)', genU2PreDiv, { id: 'u2_pre_div' }),
  ]),
  차시('1차시 약수 이해하기', [
    학습지('약수 이해', genU2MainFactorConcept, {
      id: 'u2_main_factor', grid: 'concept', count: 10,
      prereqs: [ext('[2-2] 곱셈구구(2)'), ext('[3-2] 나눗셈(6)')],
    }),
  ]),
  차시('2차시 배수 이해하기', [
    학습지('배수 이해', genU2MainMultipleConcept, {
      id: 'u2_main_multiple', grid: 'concept', count: 10,
      prereqs: [ext('[2-2] 곱셈구구(2)')],
    }),
  ]),
  차시('3차시 공약수와 최대공약수 이해하기', [
    학습지('공약수 이해', genU2MainCommonFactorConcept, {
      id: 'u2_main_common_factor', grid: 'concept', count: 10,
      prereqs: [sheetRef('u2_main_factor')],
    }),
  ]),
  차시('4차시 두 수의 최대공약수 구하기', [
    학습지('최대공약수', T.divMethod, genU2MainGcdData, {
      id: 'u2_main_gcd', count: 6,
      prereqs: [sheetRef('u2_main_common_factor')],
    }),
  ]),
  차시('5차시 공배수와 최소공배수 이해하기', [
    학습지('공배수 이해', genU2MainCommonMultipleConcept, {
      id: 'u2_main_common_multiple', grid: 'concept', count: 10,
      prereqs: [sheetRef('u2_main_multiple')],
    }),
  ]),
  차시('6차시 두 수의 최소공배수 구하기', [
    학습지('최소공배수', T.divMethod, genU2MainLcmData, {
      id: 'u2_main_lcm', count: 6,
      prereqs: [sheetRef('u2_main_common_multiple')],
    }),
  ]),
]);

const u3 = defineUnit(GRADE_ID, 'u3', '대응 관계', [
  차시('1차시 두 양 사이의 관계 알아보기(1)', [
    학습지('두 양 사이의 관계 찾기 (1)', genU3MainRelationFind1, { id: 'u3_main_relation_find1', grid: 'concept', count: 10 }),
  ]),
  차시('2차시 두 양 사이의 관계 알아보기(2)', [
    학습지('두 양 사이의 관계 찾기 (2)', genU3MainRelationFind2, { id: 'u3_main_relation_find2', grid: 'concept', count: 10 }),
  ]),
  차시('3차시 대응 관계를 식으로 나타내기', [
    학습지('대응 관계 표 완성', genU3MainRelationTable, { id: 'u3_main_relation_table', grid: 'concept', count: 10 }),
  ]),
  차시('4차시 실생활에서 대응 관계를 찾아 식으로 나타내기', [
    학습지('대응 관계 식 쓰기', genU3MainRelationFormula, { id: 'u3_main_relation_formula', grid: 'concept', count: 10 }),
  ]),
  차시('1~4차시 대응 관계 복습', [
    학습지('실생활 대응 관계', genU3MainRelationReal, { id: 'u3_main_relation_real', grid: 'concept', count: 10 }),
  ]),
]);

const u4 = defineUnit(GRADE_ID, 'u4', '약분과 통분', [
  선수학습({ grid: 'practice', count: 15 }, [
    학습지('분모 같은 분수 크기 비교', genU4PreCmp, { id: 'u4_pre_cmp' }),
    학습지('가분수 → 대분수 변환', genU4PreConv, { id: 'u4_pre_conv' }),
  ]),
  차시('1차시 크기가 같은 분수 알아보기', { grid: 'practice', count: 15 }, [
    학습지('크기가 같은 분수 찾기', genU4MainEquivFind, {
      id: 'u4_main_equiv_find',
      prereqs: [ext('[3-2] 분수')],
    }),
  ]),
  차시('2차시 크기가 같은 분수를 만드는 방법 알아보기', { grid: 'practice', count: 15 }, [
    학습지('크기가 같은 분수 만들기', genU4MainEquivMake, {
      id: 'u4_main_equiv_make',
      prereqs: [sheetRef('u4_main_equiv_find')],
    }),
  ]),
  차시('3차시 약분 알아보기', [
    학습지('약분 (과정 연습)', genU4MainRedProcess, {
      id: 'u4_main_red_process', grid: 'concept', count: 8,
      prereqs: [sheetRef('u4_main_equiv_make'), unitRef('u2')],
    }),
    학습지('약분', genU4MainRed, {
      id: 'u4_main_red', grid: 'practice', count: 15,
      prereqs: [sheetRef('u4_main_red_process')],
    }),
  ]),
  차시('4차시 통분 알아보기', [
    학습지('통분 (과정 연습)', genU4MainLcdProcess, {
      id: 'u4_main_lcd_process', grid: 'concept', count: 8,
      prereqs: [sheetRef('u4_main_red'), unitRef('u2')],
    }),
    학습지('통분', genU4MainLcd, {
      id: 'u4_main_lcd', grid: 'practice', count: 15,
      prereqs: [sheetRef('u4_main_lcd_process')],
    }),
  ]),
  차시('5차시 분수의 크기 비교하기', [
    학습지('분수 크기 비교', genU4MainCmp, {
      id: 'u4_main_cmp', grid: 'concept', count: 8,
      prereqs: [sheetRef('u4_main_lcd')],
    }),
  ]),
  차시('6차시 분수와 소수의 크기 비교하기', [
    학습지('분수와 소수 크기 비교', genU4MainDecCmp, {
      id: 'u4_main_dec_cmp', grid: 'concept', count: 8,
      prereqs: [sheetRef('u4_main_cmp'), ext('[3-1] 분수와 소수')],
    }),
  ]),
]);

const u5 = defineUnit(GRADE_ID, 'u5', '분수의 덧셈과 뺄셈', [
  선수학습({ grid: 'practice', count: 15 }, [
    학습지('분모 같은 분수의 덧셈', genU5PreAdd, { id: 'u5_pre_add' }),
    학습지('분모 같은 분수의 덧셈 (합이 1 이상)', genU5PreAddGe1, { id: 'u5_pre_add_ge1' }),
    학습지('분모 같은 분수의 뺄셈', genU5PreSub, { id: 'u5_pre_sub' }),
    학습지('대분수 − 분수 (분모 같은)', genU5PreMixedSub, { id: 'u5_pre_mixed_sub' }),
    학습지('대분수 → 가분수 (과정 연습)', genU5PreMixedToImproperProcess, { id: 'u5_pre_mixed_to_improper_process', grid: 'concept', count: 8 }),
    학습지('대분수 → 가분수', genU5PreMixedToImproper, { id: 'u5_pre_mixed_to_improper' }),
  ]),
  차시('1~2차시 (진분수)+(진분수) 계산하기', [
    학습지('분모 다른 진분수의 덧셈 (합이 1 미만)', T.fracLcdStep, genFracAddLt1, {
      id: 'u5_main_add',
      prereqs: [unitRef('u4'), ext('[4-2] 분수의 덧셈과 뺄셈(1)')],
    }),
    학습지('분모 다른 진분수의 덧셈 (합이 1 이상)', T.fracLcdStep, genFracAddGe1, {
      id: 'u5_main_add_ge1',
      prereqs: [sheetRef('u5_main_add')],
    }),
  ]),
  차시('3차시 (대분수)+(대분수) 계산하기', [
    학습지('대분수 덧셈 (가분수 변환)', T.mixedImproperStep, genMixedAddNoCarry, {
      id: 'u5_main_mixed_add_improper',
      prereqs: [sheetRef('u5_main_add'), ext('[4-2] 분수의 덧셈과 뺄셈(1)')],
    }),
    학습지('대분수 덧셈 (자연수·분수 따로)', T.mixedSeparateStep, genMixedAddNoCarry, {
      id: 'u5_main_mixed_add_separate',
      prereqs: [sheetRef('u5_main_add'), ext('[4-2] 분수의 덧셈과 뺄셈(1)')],
    }),
    학습지('받아올림 대분수 덧셈 (가분수 변환)', T.mixedImproperStep, genMixedAddCarry, {
      id: 'u5_main_mixed_add_carry_improper',
      prereqs: [sheetRef('u5_main_mixed_add_improper')],
    }),
    학습지('받아올림 대분수 덧셈 (자연수·분수 따로)', T.mixedSeparateStep, genMixedAddCarry, {
      id: 'u5_main_mixed_add_carry_separate',
      prereqs: [sheetRef('u5_main_mixed_add_separate')],
    }),
  ]),
  차시('4차시 (진분수)-(진분수) 계산하기', [
    학습지('분모 다른 진분수의 뺄셈', T.fracLcdStep, genFracSub, {
      id: 'u5_main_sub',
      prereqs: [sheetRef('u5_main_add'), ext('[4-2] 분수의 덧셈과 뺄셈(1)')],
    }),
  ]),
  차시('5차시 (대분수)-(대분수) 계산하기(1)', [
    학습지('대분수 뺄셈 - 받아내림 없음 (가분수 변환)', T.mixedImproperStep, genMixedSubNoBorrow, {
      id: 'u5_main_mixed_sub_no_borrow_improper',
      prereqs: [sheetRef('u5_main_sub'), ext('[4-2] 분수의 덧셈과 뺄셈(1)')],
    }),
    학습지('대분수 뺄셈 - 받아내림 없음 (자연수·분수 따로)', T.mixedSeparateStep, genMixedSubNoBorrow, {
      id: 'u5_main_mixed_sub_no_borrow_separate',
      prereqs: [sheetRef('u5_main_sub'), ext('[4-2] 분수의 덧셈과 뺄셈(1)')],
    }),
  ]),
  차시('6차시 (대분수)-(대분수) 계산하기(2)', [
    학습지('대분수 뺄셈 - 받아내림 있음 (가분수 변환)', T.mixedImproperStep, genMixedSubBorrow, {
      id: 'u5_main_mixed_sub_borrow_improper',
      prereqs: [sheetRef('u5_main_mixed_sub_no_borrow_improper')],
    }),
    학습지('대분수 뺄셈 - 받아내림 있음 (자연수·분수 따로)', T.mixedSeparateStep, genMixedSubBorrow, {
      id: 'u5_main_mixed_sub_borrow_separate',
      prereqs: [sheetRef('u5_main_mixed_sub_no_borrow_separate')],
    }),
  ]),
]);

const u6 = defineUnit(GRADE_ID, 'u6', '다각형의 둘레와 넓이', [
  선수학습({ grid: 'standard', count: 20 }, [
    학습지('단위 변환 (cm, m, km)', genU6PreUnit, { id: 'u6_pre_unit' }),
    학습지('길이의 합과 차', genU6PreLen, { id: 'u6_pre_len' }),
  ]),
  차시('1차시 다각형의 둘레 구하기', [
    학습지('다각형의 둘레', genU6MainPerimeter, {
      id: 'u6_main_perimeter', grid: 'wide', count: 8,
      prereqs: [ext('[4-2] 다각형')],
    }),
  ]),
  차시('2차시 1㎠ 알아보기', [
    학습지('1㎠ 이해', genU6MainUnitSquare, {
      id: 'u6_main_unit_square', grid: 'wide', count: 8,
      prereqs: [ext('[3-1] 길이와 시간')],
    }),
  ]),
  차시('3차시 직사각형의 넓이 구하기', [
    학습지('직사각형 넓이', genU6MainRect, {
      id: 'u6_main_rect', grid: 'wide', count: 8,
      prereqs: [sheetRef('u6_main_unit_square')],
    }),
  ]),
  차시('4차시 1㎠보다 더 큰 넓이의 단위 알아보기', [
    학습지('넓이 단위 확장', genU6MainAreaUnit, {
      id: 'u6_main_area_unit', grid: 'standard', count: 20,
      prereqs: [sheetRef('u6_main_rect')],
    }),
  ]),
  차시('5차시 평행사변형의 넓이 구하기', [
    학습지('평행사변형 넓이', genU6MainPara, {
      id: 'u6_main_para', grid: 'wide', count: 8,
      prereqs: [sheetRef('u6_main_rect'), ext('[4-2] 사각형')],
    }),
  ]),
  차시('6~7차시 삼각형의 넓이 구하기', [
    학습지('삼각형 넓이', genU6MainTri, {
      id: 'u6_main_tri', grid: 'wide', count: 8,
      prereqs: [sheetRef('u6_main_para'), ext('[4-2] 삼각형')],
    }),
  ]),
  차시('8~9차시 사다리꼴의 넓이 구하기', [
    학습지('사다리꼴 넓이', genU6MainTrap, {
      id: 'u6_main_trap', grid: 'wide', count: 8,
      prereqs: [sheetRef('u6_main_para'), sheetRef('u6_main_tri')],
    }),
  ]),
  차시('10~11차시 마름모의 넓이 구하기', [
    학습지('마름모 넓이', genU6MainRhombus, {
      id: 'u6_main_rhombus', grid: 'wide', count: 8,
      prereqs: [sheetRef('u6_main_para')],
    }),
  ]),
  차시('3~11차시 도형 넓이 혼합', [
    학습지('도형 넓이 혼합', genU6MainMix, {
      id: 'u6_main_mix', grid: 'wide', count: 8,
      prereqs: [sheetRef('u6_main_rhombus')],
    }),
  ]),
]);

/* ── 학기 메타 ── */

export const meta = {
  id: GRADE_ID,
  short: '5-1',
  name: '5학년 1학기',
  units: {
    u1: { short: '1단원', name: '자연수의 혼합 계산' },
    u2: { short: '2단원', name: '약수와 배수' },
    u3: { short: '3단원', name: '대응 관계' },
    u4: { short: '4단원', name: '약분과 통분' },
    u5: { short: '5단원', name: '분수의 덧셈과 뺄셈' },
    u6: { short: '6단원', name: '다각형의 둘레와 넓이' },
  },
};

export const entries = [...u1, ...u2, ...u3, ...u4, ...u5, ...u6];

/* ── PDF 매핑 (5-1 전용) ── */

export const pdfMap = {
  'g5-1_u1_pre_add_2d': 'add_2d',
  'g5-1_u1_pre_add': 'add_3d',
  'g5-1_u1_pre_sub_2d': 'sub_2d',
  'g5-1_u1_pre_sub': 'sub_3d',
  'g5-1_u1_pre_mul_2d1d': 'mul_2d1d',
  'g5-1_u1_pre_mul': 'mul_2d2d',
  'g5-1_u1_pre_mul_3x2': 'mul_3d2d',
  'g5-1_u1_pre_div_2d1d': 'div_2d1d',
  'g5-1_u1_pre_div_2d1d_norem': 'div_2d1d_norem',
  'g5-1_u1_pre_div_2d1d_rem': 'div_2d1d_rem',
  'g5-1_u1_pre_div_3d1': 'div_3d1d',
  'g5-1_u1_pre_div_3d2': 'div_3d2d',
};

export const pdfGenerators = { ...PDF_GENERATORS_U1 };
