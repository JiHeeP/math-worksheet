'use strict';

/**
 * 카탈로그 빌더 + 진입점
 *
 * 이 파일은 두 가지 역할을 합니다.
 *  1) 학기별 카탈로그가 사용할 빌더 함수 제공
 *     - defineUnit / 선수학습 / 차시 / 학습지
 *  2) 학기별 카탈로그(`./catalogs/g{학년}-{학기}.js`)들을 합쳐서
 *     앱 전체가 사용할 통합 카탈로그·메타·PDF 매핑을 export
 *
 * 새 학기 추가 절차:
 *   1. app/js/generators/g{학년}-{학기}/uN.js 작성
 *   2. app/js/catalogs/g{학년}-{학기}.js 작성 (g5-1.js 형식 참고)
 *   3. 이 파일 하단 GRADES 배열에 import + push
 */

import { bindTemplate } from './templates.js';

/* ── 빌더 함수 ── */

let _idCounter = 0;
function autoId(prefix, label) {
  _idCounter++;
  const slug = label.replace(/[^가-힣a-zA-Z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30);
  return `${prefix}_${_idCounter}_${slug}`;
}

/**
 * 선수학습 그룹
 */
export function 선수학습(defaults, items) {
  return { section: '선수학습', lessonRef: '선수학습', defaults, items };
}

/**
 * 차시(본단원) 그룹
 */
export function 차시(lessonRef, ...args) {
  const defaults = (typeof args[0] === 'object' && !Array.isArray(args[0])) ? args.shift() : {};
  return { section: '본단원', lessonRef, defaults, items: args[0] };
}

/* ── 선수학습 참조 헬퍼 ──
   function 선언을 사용해야 catalog ↔ catalogs/* 의 순환 import 에서 호이스팅됨.
   (const 화살표 함수로 두면 TDZ 에 걸려 g5-1.js 평가 시점에 접근 불가.) */

/**
 * 외부(다른 학기/단원) 학습지 — 클릭 동작 없이 라벨만 표시
 * 예: ext('[4-2] 분수의 덧셈과 뺄셈(1)')
 */
export function ext(label) { return { kind: 'ext', label }; }

/**
 * 같은 학기 안의 단원 — 클릭 시 해당 단원의 첫 학습지로 이동
 * 예: unitRef('u4')  →  [현재학기] 약분과 통분
 */
export function unitRef(id) { return { kind: 'unit', id }; }

/**
 * 같은 학기 안의 특정 학습지 — 클릭 시 그 학습지로 이동
 * 예: sheetRef('u5_main_add')
 */
export function sheetRef(id) { return { kind: 'sheet', id }; }

/**
 * 개별 학습지 정의
 */
export function 학습지(label, templateOrGen, genOrOverrides, overrides) {
  let template = null;
  let generator;
  let opts = {};

  if (typeof templateOrGen === 'function') {
    generator = templateOrGen;
    opts = genOrOverrides || {};
  } else if (templateOrGen && typeof templateOrGen === 'object' && templateOrGen.render) {
    template = templateOrGen;
    generator = genOrOverrides;
    opts = overrides || {};
  } else {
    generator = templateOrGen;
    opts = genOrOverrides || {};
  }

  return { label, template, generator, overrides: opts };
}

/**
 * 단원 정의 → 카탈로그 항목 배열로 변환
 *
 * @param {string} gradeId  - 'g5-1' 형식의 학기 식별자
 * @param {string} unitId   - 'u1' 형식의 단원 식별자 (학기 안에서만 유일)
 * @param {string} unitName - 단원 이름
 * @param {Array}  groups   - [선수학습(...), 차시(...), ...]
 */
export function defineUnit(gradeId, unitId, unitName, groups) {
  const idPrefix = `${gradeId}_`;
  const entries = [];

  for (const group of groups) {
    const { section, lessonRef, defaults = {}, items } = group;

    for (const item of items) {
      const { label, template, generator, overrides } = item;

      const templateDefaults = template ? { grid: template.grid, count: template.count } : {};

      const grid = overrides.grid || defaults.grid || templateDefaults.grid || 'standard';
      const count = overrides.count || defaults.count || templateDefaults.count || 20;
      const kind = overrides.kind || defaults.kind || 'html';

      const boundGenerator = bindTemplate(template, generator);

      const localId = overrides.id || autoId(unitId, label);
      const id = `${idPrefix}${localId}`;
      const prereqs = overrides.prereqs || null;

      entries.push({
        id,
        grade: gradeId,
        unit: unitId,
        section,
        label,
        lessonRef,
        kind,
        grid,
        count,
        generator: boundGenerator,
        prereqs,
      });
    }
  }

  return entries;
}

/* ── 학기 카탈로그 통합 ── */

import * as g5_1 from './catalogs/g5-1.js';

const GRADES = [g5_1];
// 새 학기 추가 시:
//   import * as g4_1 from './catalogs/g4-1.js';
//   const GRADES = [g4_1, g5_1, ...];

/**
 * 모든 학기의 학습지를 한 배열로 모음.
 */
export const WORKSHEET_CATALOG = GRADES.flatMap((g) => g.entries);

/**
 * id → 학습지 객체 (앱 전반에서 학습지 검색에 사용)
 */
export const catalogMap = Object.fromEntries(WORKSHEET_CATALOG.map((item) => [item.id, item]));

/**
 * 학기 메타 (gradeId → { name, units, ... })
 *
 * 예:
 *   GRADE_META['g5-1'].name           // '5학년 1학기'
 *   GRADE_META['g5-1'].units.u1.name  // '자연수의 혼합 계산'
 */
export const GRADE_META = Object.fromEntries(GRADES.map((g) => [g.meta.id, g.meta]));

/**
 * 모든 학기에서 첫 번째에 해당하는 학기 id (앱 초기 렌더용)
 */
export const DEFAULT_GRADE_ID = GRADES[0].meta.id;

/* ── PDF 매핑 ── */

export const PDF_WORKSHEET_MAP = Object.assign({}, ...GRADES.map((g) => g.pdfMap || {}));
export const PDF_GENERATORS = Object.assign({}, ...GRADES.map((g) => g.pdfGenerators || {}));

/* ── 헬퍼 함수 ── */

export function getGradeMeta(gradeId) {
  return GRADE_META[gradeId];
}

export function getUnitMeta(gradeId, unitId) {
  const grade = GRADE_META[gradeId];
  return grade ? grade.units[unitId] : undefined;
}

export function getUnitsOfGrade(gradeId) {
  const grade = GRADE_META[gradeId];
  return grade ? grade.units : {};
}

export function getWorksheetsByUnit(gradeId, unitId) {
  return WORKSHEET_CATALOG.filter((item) => item.grade === gradeId && item.unit === unitId);
}

export function buildSheetTitle(item) {
  const unitMeta = getUnitMeta(item.grade, item.unit);
  const gradeMeta = getGradeMeta(item.grade);
  const unitLabel = unitMeta ? unitMeta.short : item.unit;
  const gradeLabel = gradeMeta ? gradeMeta.short : item.grade;
  return {
    main: `[${gradeLabel}] ${unitLabel} [${item.section}] ${item.label}`,
    sub: item.lessonRef,
  };
}

export function isPdfWorksheet(item) {
  return Boolean(PDF_WORKSHEET_MAP[item.id]);
}

export function getPdfOpType(item) {
  return PDF_WORKSHEET_MAP[item.id];
}

/**
 * 선수학습 참조 → { label, action } 형태로 정규화
 *
 * action:
 *   null                    → 외부(다른 학기). 표시만, 클릭 불가
 *   { grade, unit }         → 같은 학기 단원으로 이동
 *   { grade, unit, sheet }  → 같은 학기 특정 학습지로 이동
 */
export function resolvePrereq(prereq, currentGradeId) {
  if (!prereq) return { label: '?', action: null };
  if (prereq.kind === 'ext') {
    return { label: prereq.label, action: null };
  }
  if (prereq.kind === 'unit') {
    const unitMeta = getUnitMeta(currentGradeId, prereq.id);
    const gradeMeta = getGradeMeta(currentGradeId);
    if (!unitMeta || !gradeMeta) return { label: `[?] ${prereq.id}`, action: null };
    return {
      label: `[${gradeMeta.short}] ${unitMeta.name}`,
      action: { grade: currentGradeId, unit: prereq.id },
    };
  }
  if (prereq.kind === 'sheet') {
    const fullId = `${currentGradeId}_${prereq.id}`;
    const item = catalogMap[fullId];
    const gradeMeta = getGradeMeta(currentGradeId);
    if (!item || !gradeMeta) return { label: `[?] ${prereq.id}`, action: null };
    return {
      label: `[${gradeMeta.short}] ${item.label}`,
      action: { grade: currentGradeId, unit: item.unit, sheet: fullId },
    };
  }
  return { label: '?', action: null };
}
