'use strict';

import { clamp } from './utils.js';

export const SHEET_GRID_BOUNDS = { width: 172, height: 238 };

export const PDF_LAYOUTS = {
  add_2d:   { type: 'addsub', minCols: 2, maxCols: 4, maxRows: 5, targetCellAspect: 0.7, minCellWidth: 28, minCellHeight: 35, baseGap: [12, 8] },
  add_3d:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  sub_2d:   { type: 'addsub', minCols: 2, maxCols: 4, maxRows: 5, targetCellAspect: 0.7, minCellWidth: 28, minCellHeight: 35, baseGap: [12, 8] },
  sub_3d:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  mul_2d1d: { type: 'mul_s',  minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.68, minCellWidth: 32, minCellHeight: 36, baseGap: [12, 8] },
  mul_2d2d: { type: 'mul_l',  minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.62, minCellWidth: 34, minCellHeight: 48, baseGap: [10, 8] },
  mul_2d2d_hard: { type: 'mul_l', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.62, minCellWidth: 34, minCellHeight: 48, baseGap: [10, 8] },
  mul_3d2d: { type: 'mul_l',  minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.58, minCellWidth: 36, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d: { type: 'div',    minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_norem: { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_rem: { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_3d1d: { type: 'div',    minCols: 2, maxCols: 3, maxRows: 3, targetCellAspect: 0.78, minCellWidth: 40, minCellHeight: 58, baseGap: [10, 8] },
  div_3d2d: { type: 'div',    minCols: 2, maxCols: 3, maxRows: 3, targetCellAspect: 0.78, minCellWidth: 42, minCellHeight: 58, baseGap: [10, 8] },
  // 5-2 곱셈과 나눗셈 총연습
  mul_2d2d_full:   { type: 'mul_l', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.62, minCellWidth: 34, minCellHeight: 48, baseGap: [10, 8] },
  // 나머지 있음·없음 반반이 정확하도록 짝수: 세 자리÷한 자리 2열×3행(6), 세 자리÷두 자리 2열×4행(8)
  div_3d1d_mixrem: { type: 'div',   minCols: 2, maxCols: 2, maxRows: 3, targetCellAspect: 0.78, minCellWidth: 40, minCellHeight: 58, baseGap: [10, 8] },
  div_3d2d_mixrem: { type: 'div',   minCols: 2, maxCols: 2, maxRows: 4, targetCellAspect: 0.78, minCellWidth: 42, minCellHeight: 58, baseGap: [10, 8] },
  // 3-1 세 자리 수 덧셈·뺄셈 단계별 (받아올림·받아내림 횟수)
  add_3d_c0:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  add_3d_c1:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  add_3d_c2:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  add_3d_c3:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  sub_3d_b0:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  sub_3d_b1:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  sub_3d_b2:   { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  sub_3d_zero: { type: 'addsub', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 35, baseGap: [12, 8] },
  // 3-2 (세 자리 수) × (한 자리 수) 올림 단계별
  mul_3d1d_c0: { type: 'mul_s', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 36, baseGap: [12, 8] },
  mul_3d1d_c1: { type: 'mul_s', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 36, baseGap: [12, 8] },
  mul_3d1d_cn: { type: 'mul_s', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.66, minCellWidth: 32, minCellHeight: 36, baseGap: [12, 8] },
  // 3-2 (몇십)÷(몇), (몇십몇)÷(몇) 내림·나머지 단계별
  div_tens_1d:     { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_nb:     { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_b:      { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_nb_rem: { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_b_rem:  { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  // 4-1 (세 자리 수)×(몇십), 몇십·몇십몇으로 나누기 (몫 한 자리)
  mul_3d_tens:  { type: 'mul_s', minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 0.62, minCellWidth: 34, minCellHeight: 36, baseGap: [12, 8] },
  div_by_tens:  { type: 'div', minCols: 2, maxCols: 3, maxRows: 3, targetCellAspect: 0.78, minCellWidth: 42, minCellHeight: 58, baseGap: [10, 8] },
  div_by_2d_q1: { type: 'div', minCols: 2, maxCols: 3, maxRows: 3, targetCellAspect: 0.78, minCellWidth: 42, minCellHeight: 58, baseGap: [10, 8] },
};

export const GRID_LAYOUTS = {
  standard: { minCols: 2, maxCols: 4, maxRows: 5, targetCellAspect: 1.45, minCellWidth: 48, minCellHeight: 26, widthPriority: 1.2, baseGap: [12, 8] },
  practice: { minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 1.32, minCellWidth: 52, minCellHeight: 28, widthPriority: 1.25, baseGap: [12, 8] },
  dense:    { minCols: 2, maxCols: 4, maxRows: 9, targetCellAspect: 1.12, minCellWidth: 36, minCellHeight: 16, widthPriority: 0.8, baseGap: [6, 5] },
  divgrid:  { minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 1.0,  minCellWidth: 50, minCellHeight: 30, widthPriority: 1.0, baseGap: [12, 8] },
  concept:  { minCols: 1, maxCols: 2, maxRows: 5, targetCellAspect: 1.05, minCellWidth: 72, minCellHeight: 44, widthPriority: 0.9, baseGap: [14, 14] },
  wide:     { minCols: 1, maxCols: 2, maxRows: 4, targetCellAspect: 1.08, minCellWidth: 78, minCellHeight: 66, widthPriority: 0.8, baseGap: [16, 16] },
  // 한 줄에 한 문항 (긴 문장틀·풀이+고치기처럼 가로로 넓은 문항)
  single:   { minCols: 1, maxCols: 1, maxRows: 4, targetCellAspect: 2.6, minCellWidth: 120, minCellHeight: 48, widthPriority: 2, baseGap: [10, 12] },
};

/* ── 학습지별 배치 프리셋 ──
   카탈로그의 학습지 옵션 `layout` 으로 지정한다 (2026-11-19, 예전 ID 목록 11묶음을 대체).
     학습지('…', gen, { id: 'u5_main_add', layout: 'oneCol' })
     학습지('…', gen, { id: '…', layout: { preset: 'oneColRows', rows: 6 } })
   문항 수를 2·4의 배수로 맞춰야 하는 섞기 학습지는 { …, countMultiple: 2 } 를 함께 쓴다.

   twoColAtNormalFont : 글자 '보통' 이하 2열(풀이 줄 세로로 쌓기), '크게' 이상 1열 한 줄 풀이
   splitWriteBox      : 가로셈 + 가르기 쓰기 칸, 2열 8행
   twoCol             : 2열 고정 (긴 과정 연습)
   mixedSeparate      : 대분수 자연수·분수 따로 계산, 2열 3행
   oneCol             : 1열 6행 (단계 풀이 한 줄)
   oneColRows         : 1열, 행 수 지정 (rows)
   fracTwoCol         : 분수 2열 8행
   threePlusHoriz     : 세 수 이상 가로식, 2열 */

export const LAYOUT_PRESETS = [
  'twoColAtNormalFont', 'splitWriteBox', 'twoCol', 'mixedSeparate',
  'oneCol', 'oneColRows', 'fracTwoCol', 'threePlusHoriz',
];

export function getLayoutSpec(item) {
  const raw = item && item.layout;
  if (!raw) return null;
  return typeof raw === 'string' ? { preset: raw } : raw;
}

export function getHtmlLayoutConfig(item, fontScale = 1) {
  const base = GRID_LAYOUTS[item.grid];
  if (!base) return null;
  const spec = getLayoutSpec(item);
  if (!spec || !spec.preset) return base;

  switch (spec.preset) {
    case 'twoColAtNormalFont':
      if ((Number(fontScale) || 1) <= 1) {
        return {
          ...base,
          minCols: 2, maxCols: 2, maxRows: 6, widthPriority: 1,
          targetCellAspect: 1.9,
          minCellWidth: 76,
          minCellHeight: 34,
          baseGap: [8, 10],
        };
      }
      return {
        ...base,
        minCols: 1, maxCols: 1, maxRows: 6, widthPriority: 2,
        targetCellAspect: 4.8,
        minCellWidth: 120,
        minCellHeight: 34,
        baseGap: [6, 0],
      };

    case 'splitWriteBox':
      return {
        ...base,
        minCols: 2, maxCols: 2, maxRows: 8, widthPriority: 2,
        targetCellAspect: 1.55,
        minCellWidth: Math.max(base.minCellWidth || 0, 90),
        minCellHeight: Math.max(base.minCellHeight || 0, 28),
      };

    case 'twoCol':
      return {
        ...base,
        minCols: 2, maxCols: 2, widthPriority: 1.5,
        minCellWidth: Math.max(base.minCellWidth || 0, 76),
      };

    case 'mixedSeparate':
      return {
        ...base,
        minCols: 2, maxCols: 2, maxRows: 3, widthPriority: 1,
        targetCellAspect: 1.08,
        minCellWidth: 76,
        minCellHeight: 72,
        baseGap: [8, 8],
      };

    case 'oneCol':
      return {
        ...base,
        minCols: 1, maxCols: 1, maxRows: 6, widthPriority: 2,
        targetCellAspect: 4.8,
        minCellWidth: 120,
        minCellHeight: 34,
        baseGap: [6, 0],
      };

    case 'oneColRows':
      return {
        ...base,
        minCols: 1, maxCols: 1, maxRows: spec.rows || 6, widthPriority: 2,
        targetCellAspect: 4.8,
        minCellWidth: 120,
        minCellHeight: 28,
        baseGap: [6, 0],
      };

    case 'fracTwoCol':
      return {
        ...base,
        minCols: 2, maxCols: 2, maxRows: 8, widthPriority: 2,
        targetCellAspect: 1.85,
        minCellWidth: 76,
        minCellHeight: 24,
        baseGap: [8, 10],
      };

    case 'threePlusHoriz':
      return {
        ...base,
        minCols: 2, maxCols: 2, widthPriority: 2,
        minCellWidth: Math.max(base.minCellWidth || 0, 78),
      };

    default:
      return base;
  }
}

/** 문항 수 배수 제약 (반반 섞기 등). 없으면 1. */
export function getCountMultiple(item) {
  const spec = getLayoutSpec(item);
  return (spec && spec.countMultiple) || 1;
}

export function resolveGridLayout(config, count, fontScale = 1) {
  const safeCount = Math.max(1, count);
  const scale = Math.max(0.8, Number(fontScale) || 1);
  const maxCols = Math.min(config.maxCols, safeCount);
  const minCols = Math.min(config.minCols || 1, maxCols);
  const usableWidth = config.usableWidth || SHEET_GRID_BOUNDS.width;
  const usableHeight = config.usableHeight || SHEET_GRID_BOUNDS.height;
  const requiredWidth = (config.minCellWidth || 40) * scale;
  const requiredHeight = (config.minCellHeight || 28) * Math.min(scale, 1.2);
  let best = null;

  for (let cols = minCols; cols <= maxCols; cols++) {
    const rows = Math.ceil(safeCount / cols);
    if (rows > config.maxRows) continue;

    const cells = cols * rows;
    const emptyRatio = (cells - safeCount) / cells;
    const fullness = safeCount / (config.maxCols * config.maxRows);
    const cellWidth = usableWidth / cols;
    const cellHeight = usableHeight / rows;
    const cellAspect = cellWidth / cellHeight;
    const widthFit = cellWidth / requiredWidth;
    const heightFit = cellHeight / requiredHeight;
    const preferredCols = clamp(
      Math.round(config.maxCols * Math.pow(fullness, 0.35) - ((scale - 1) * (config.widthPriority || 0))),
      minCols, maxCols
    );
    let score = 100;
    score -= Math.abs(cellAspect - (config.targetCellAspect || 1)) * 18;
    score -= emptyRatio * 18;
    score -= Math.abs(cols - preferredCols) * 4 * (1 - fullness);
    score -= (rows / config.maxRows) * 6;
    if (widthFit < 1) score -= (1 - widthFit) * 140;
    else score += Math.min(widthFit - 1, 0.45) * 12;
    if (heightFit < 1) score -= (1 - heightFit) * 110;
    else score += Math.min(heightFit - 1, 0.5) * 8;
    if (rows === 1 && safeCount > 2) score -= 8;
    if (cols === 1 && (config.minCols || 1) > 1) score -= 12;

    if (!best || score > best.score) {
      best = { cols, rows, score, widthFit, heightFit };
    }
  }

  if (!best) {
    best = { cols: maxCols, rows: Math.min(config.maxRows, Math.ceil(safeCount / maxCols)), score: 0 };
  }

  const density = safeCount <= Math.max(4, best.cols * 2)
    ? 'spacious'
    : (safeCount >= Math.max(best.cols * (config.maxRows - 1), config.maxCols * config.maxRows * 0.75) ? 'dense' : 'regular');
  const gapFactor = density === 'spacious' ? 1.15 : (density === 'dense' ? 0.9 : 1);
  const [baseRowGap, baseColGap] = config.baseGap || [12, 8];

  return {
    cols: best.cols,
    rows: best.rows,
    density,
    rowGap: Math.round(baseRowGap * gapFactor),
    colGap: Math.round(baseColGap * gapFactor),
  };
}

export function applyGridLayout(grid, layout) {
  grid.style.gridTemplateColumns = `repeat(${layout.cols}, minmax(0, 1fr))`;
  grid.style.gridTemplateRows = `repeat(${layout.rows}, minmax(0, 1fr))`;
  grid.style.rowGap = `${layout.rowGap}px`;
  grid.style.columnGap = `${layout.colGap}px`;
  grid.dataset.layoutMode = layout.density;
  grid.dataset.cols = layout.cols;
}
