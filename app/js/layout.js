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
  mul_3d2d: { type: 'mul_l',  minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.58, minCellWidth: 36, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d: { type: 'div',    minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_norem: { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_2d1d_rem: { type: 'div', minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 0.72, minCellWidth: 38, minCellHeight: 48, baseGap: [10, 8] },
  div_3d1d: { type: 'div',    minCols: 2, maxCols: 3, maxRows: 3, targetCellAspect: 0.78, minCellWidth: 40, minCellHeight: 58, baseGap: [10, 8] },
  div_3d2d: { type: 'div',    minCols: 2, maxCols: 3, maxRows: 3, targetCellAspect: 0.78, minCellWidth: 42, minCellHeight: 58, baseGap: [10, 8] },
};

export const GRID_LAYOUTS = {
  standard: { minCols: 2, maxCols: 4, maxRows: 5, targetCellAspect: 1.45, minCellWidth: 48, minCellHeight: 26, widthPriority: 1.2, baseGap: [12, 8] },
  practice: { minCols: 2, maxCols: 3, maxRows: 5, targetCellAspect: 1.32, minCellWidth: 52, minCellHeight: 28, widthPriority: 1.25, baseGap: [12, 8] },
  dense:    { minCols: 2, maxCols: 4, maxRows: 9, targetCellAspect: 1.12, minCellWidth: 36, minCellHeight: 16, widthPriority: 0.8, baseGap: [6, 5] },
  divgrid:  { minCols: 2, maxCols: 3, maxRows: 4, targetCellAspect: 1.0,  minCellWidth: 50, minCellHeight: 30, widthPriority: 1.0, baseGap: [12, 8] },
  concept:  { minCols: 1, maxCols: 2, maxRows: 5, targetCellAspect: 1.05, minCellWidth: 72, minCellHeight: 44, widthPriority: 0.9, baseGap: [14, 14] },
  wide:     { minCols: 1, maxCols: 2, maxRows: 4, targetCellAspect: 1.08, minCellWidth: 78, minCellHeight: 66, widthPriority: 0.8, baseGap: [16, 16] },
};

export const THREE_PLUS_HORIZONTAL_IDS = new Set([
  'u1_main_addsub',
  'u1_main_muldiv',
  'u1_main_addsubmul',
  'u1_main_addsubdiv',
  'u1_main_mix',
]);

export const TWO_COLUMN_WORKSHEET_IDS = new Set([
  'u4_main_red_process',
  'u4_main_lcd_process',
]);

export function getHtmlLayoutConfig(item) {
  const base = GRID_LAYOUTS[item.grid];
  if (!base) return null;

  if (TWO_COLUMN_WORKSHEET_IDS.has(item.id)) {
    return {
      ...base,
      minCols: 2, maxCols: 2, widthPriority: 1.5,
      minCellWidth: Math.max(base.minCellWidth || 0, 76),
    };
  }

  if (!THREE_PLUS_HORIZONTAL_IDS.has(item.id)) return base;
  return {
    ...base,
    minCols: 2, maxCols: 2, widthPriority: 2,
    minCellWidth: Math.max(base.minCellWidth || 0, 78),
  };
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
}
