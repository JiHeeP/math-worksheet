'use strict';

import { escapeAttr, simplify } from './utils.js';

/* -- 분수/빈칸 HTML 헬퍼 -- */

export function fracD(n, d) {
  return `<span class="frac-d"><span class="ft">${n}</span><span class="fb">${d}</span></span>`;
}

export function mixedD(w, n, d) {
  return `<span class="mixed-d"><span class="whole">${w}</span>${fracD(n, d)}</span>`;
}

export function numBlank(value, unit = '') {
  return `<span class="num-blank" data-ans="${escapeAttr(value)}">${value}</span>${unit ? `<span class="unit-tail">${unit}</span>` : ''}`;
}

export function textBlank(value, minWidth = 72) {
  return `<span class="text-blank" style="min-width:${minWidth}px" data-ans="${escapeAttr(value)}">${value}</span>`;
}

export function symBlank(value) {
  return `<span class="sym-blank" data-ans="${escapeAttr(value)}">${value}</span>`;
}

export function multiBlank(values) {
  return values.map(v => numBlank(v)).join(' ');
}

function repeatedHtml(count, render) {
  return Array.from({ length: count }, (_, index) => render(index)).join('');
}

function thousandBlockHtml(index) {
  return `<svg class="base-ten-thousand" viewBox="0 0 36 34" role="img" aria-label="천 모형 ${index + 1}">
    <polygon class="base-ten-thousand-top" points="9,2 27,2 34,9 16,9"></polygon>
    <polygon class="base-ten-thousand-side" points="27,2 34,9 34,27 27,20"></polygon>
    <rect class="base-ten-thousand-front" x="2" y="9" width="25" height="25"></rect>
    <line class="base-ten-thousand-edge" x1="2" y1="9" x2="9" y2="2"></line>
    <line class="base-ten-thousand-edge" x1="27" y1="9" x2="34" y2="9"></line>
    <line class="base-ten-thousand-edge" x1="27" y1="34" x2="34" y2="27"></line>
    <line class="base-ten-thousand-grid" x1="10.3" y1="9" x2="10.3" y2="34"></line>
    <line class="base-ten-thousand-grid" x1="18.6" y1="9" x2="18.6" y2="34"></line>
    <line class="base-ten-thousand-grid" x1="2" y1="17.3" x2="27" y2="17.3"></line>
    <line class="base-ten-thousand-grid" x1="2" y1="25.6" x2="27" y2="25.6"></line>
  </svg>`;
}

export function placeValueModelHtml({ thousands = 0, hundreds = 0, tens = 0, ones = 0 }) {
  const thousandBlocks = repeatedHtml(thousands, thousandBlockHtml);

  const hundredBlocks = repeatedHtml(hundreds, (index) => (
    `<span class="base-ten-hundred" aria-label="백 모형 ${index + 1}"></span>`
  ));

  const rods = repeatedHtml(tens, (rodIndex) => {
    const cells = repeatedHtml(10, (cellIndex) => (
      `<span class="base-ten-rod-cell" aria-hidden="true" data-cell="${cellIndex + 1}"></span>`
    ));
    return `<span class="base-ten-rod" aria-label="십 모형 ${rodIndex + 1}">${cells}</span>`;
  });

  const cubes = repeatedHtml(ones, (cubeIndex) => (
    `<span class="base-ten-one" aria-label="낱개 ${cubeIndex + 1}"></span>`
  ));

  const largeGroups = [
    thousandBlocks ? `<span class="base-ten-group base-ten-thousands" data-count="${thousands}">${thousandBlocks}</span>` : '',
    hundredBlocks ? `<span class="base-ten-group base-ten-hundreds" data-count="${hundreds}">${hundredBlocks}</span>` : '',
  ].join('');

  const smallGroups = [
    rods ? `<span class="base-ten-group base-ten-rods" data-count="${tens}">${rods}</span>` : '',
    cubes ? `<span class="base-ten-group base-ten-ones" data-count="${ones}">${cubes}</span>` : '',
  ].join('');

  const rows = [
    largeGroups ? `<span class="base-ten-row base-ten-large-row">${largeGroups}</span>` : '',
    smallGroups ? `<span class="base-ten-row base-ten-small-row">${smallGroups}</span>` : '',
  ].join('');

  const labelParts = [
    thousands ? `천 모형 ${thousands}개` : '',
    hundreds ? `백 모형 ${hundreds}개` : '',
    tens ? `십 모형 ${tens}개` : '',
    ones ? `낱개 ${ones}개` : '',
  ].filter(Boolean).join(', ');

  return `<span class="base-ten-model place-value-model" aria-label="${escapeAttr(labelParts)}">${rows}</span>`;
}

export function baseTenModelHtml(tens, ones) {
  return placeValueModelHtml({ tens, ones });
}

export function fracBlank(n, d) {
  return `<span class="frac-blank">
    <span class="fb-top" data-ans="${escapeAttr(n)}">${n}</span>
    <span class="fb-line"></span>
    <span class="fb-bot" data-ans="${escapeAttr(d)}">${d}</span>
  </span>`;
}

export function mixedBlank(w, n, d) {
  return `<span class="mixed-d"><span class="num-blank" data-ans="${escapeAttr(w)}">${w}</span>${fracBlank(n, d)}</span>`;
}

/**
 * 가르기 다이어그램: 한 수 위에 두 부분으로 가르는 가지(branch) 와
 * 두 작은 박스 (원본 PoC 스타일).
 *      num
 *      / \
 *    [p1] [p2]
 * 1·2학년 받아올림/내림 가르기 풀이용. 박스 안 숫자는 정답 토글로 노출.
 */
export function splitDiagramHtml(num, part1, part2) {
  return `<span class="split-container">
    <span class="split-target-num">${num}</span>
    <svg class="split-line-svg" viewBox="0 0 60 16" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="0" x2="12" y2="16" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="30" y1="0" x2="48" y2="16" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="bottom-boxes">
      <span class="small-box" data-ans="${escapeAttr(part1)}"><span class="small-box-answer">${part1}</span></span>
      <span class="small-box" data-ans="${escapeAttr(part2)}"><span class="small-box-answer">${part2}</span></span>
    </span>
  </span>`;
}

export function formulaResultHtml(num, den) {
  const [sn, sd] = simplify(num, den);
  if (sd === 1) return numBlank(sn);
  if (sn > sd) {
    const whole = Math.floor(sn / sd);
    const remain = sn % sd;
    if (remain === 0) return numBlank(whole);
    return mixedBlank(whole, remain, sd);
  }
  return fracBlank(sn, sd);
}

/* -- 테이블 헬퍼 -- */

export function relationTableHtml(xLabel, yLabel, xs, ys) {
  const headCells = xs.map((value) => `<td>${value}</td>`).join('');
  const bodyCells = ys.map((value) => `<td>${value}</td>`).join('');
  return `<table class="relation-table">
    <tbody>
      <tr><th>${xLabel}</th>${headCells}</tr>
      <tr><th>${yLabel}</th>${bodyCells}</tr>
    </tbody>
  </table>`;
}

/* -- SVG 도형 헬퍼 -- */

const SHAPE_VIEW_WIDTH = 160;
const SHAPE_BOTTOM_Y = 80;

function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safePositive(value, fallback = 1) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function svgNum(value) {
  return Number(Number(value).toFixed(1));
}

function fitProportionalBox(unitWidth, unitHeight, {
  maxWidth = 104,
  maxHeight = 58,
  minRatio = 0.45,
  maxRatio = 3.4,
} = {}) {
  const ratio = clampValue(safePositive(unitWidth) / safePositive(unitHeight), minRatio, maxRatio);
  let width = maxWidth;
  let height = width / ratio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  return { width: svgNum(width), height: svgNum(height) };
}

function centeredX(width) {
  return svgNum((SHAPE_VIEW_WIDTH - width) / 2);
}

function svgText(x, y, content, attrs = '') {
  return `<text x="${svgNum(x)}" y="${svgNum(y)}"${attrs ? ` ${attrs}` : ''}>${content}</text>`;
}

export function svgShell(inner) {
  return `<svg class="shape-svg" viewBox="0 0 160 104" aria-hidden="true">${inner}</svg>`;
}

export function unitGridSvg(cols, rows) {
  const cell = 20;
  const width = cols * cell;
  const height = rows * cell;
  const startX = 18;
  const startY = 18;
  const rects = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rects.push(`<rect class="grid-fill" x="${startX + (x * cell)}" y="${startY + (y * cell)}" width="${cell}" height="${cell}"></rect>`);
    }
  }

  for (let x = 0; x <= cols; x++) {
    rects.push(`<line class="grid-line" x1="${startX + (x * cell)}" y1="${startY}" x2="${startX + (x * cell)}" y2="${startY + height}"></line>`);
  }

  for (let y = 0; y <= rows; y++) {
    rects.push(`<line class="grid-line" x1="${startX}" y1="${startY + (y * cell)}" x2="${startX + width}" y2="${startY + (y * cell)}"></line>`);
  }

  rects.push(`<text x="${startX + width + 8}" y="${startY + 15}">한 칸 = 1㎠</text>`);
  return svgShell(rects.join(''));
}

export function rectangleSvg(w, h) {
  const size = fitProportionalBox(w, h, { maxWidth: 104, maxHeight: 58, minRatio: 0.4, maxRatio: 3.6 });
  const x = centeredX(size.width);
  const y = svgNum(SHAPE_BOTTOM_Y - size.height);
  const sideTextX = x + size.width + 8;
  const sideAnchor = sideTextX > 145 ? 'end' : 'start';

  return svgShell(`
    <rect class="outline" x="${x}" y="${y}" width="${size.width}" height="${size.height}"></rect>
    ${svgText(x + (size.width / 2), y - 6, `${w}cm`, 'text-anchor="middle"')}
    ${svgText(sideAnchor === 'end' ? 154 : sideTextX, y + (size.height / 2) + 4, `${h}cm`, `text-anchor="${sideAnchor}"`)}
  `);
}

export function perimeterParallelogramSvg(base, side) {
  return svgShell(`
    <polygon class="outline" points="36,78 122,78 102,28 16,28"></polygon>
    <text x="44" y="95">${base}cm</text>
    <text x="13" y="57">${side}cm</text>
  `);
}

const TRIANGLE_APEX_RATIOS = [0.5, 0.28, 0.72, 0.4, 0.6, 0.14, 0.86, 0.48];

function variantValue(values, variant = 0) {
  const safeIndex = Math.max(0, Number(variant) || 0);
  return values[safeIndex % values.length];
}

export function triangleSvg(base, height, variant = 0) {
  const size = fitProportionalBox(base, height, { maxWidth: 108, maxHeight: 58, minRatio: 0.55, maxRatio: 3.2 });
  const x = centeredX(size.width);
  const baseY = SHAPE_BOTTOM_Y;
  const topY = svgNum(baseY - size.height);
  const apexX = svgNum(x + (size.width * variantValue(TRIANGLE_APEX_RATIOS, variant)));
  const heightAnchor = apexX > 92 ? 'end' : 'start';
  const heightLabelX = heightAnchor === 'end' ? apexX - 8 : apexX + 8;

  return svgShell(`
    <polygon class="outline" points="${x},${baseY} ${svgNum(x + size.width)},${baseY} ${apexX},${topY}"></polygon>
    <line class="guide" x1="${apexX}" y1="${topY}" x2="${apexX}" y2="${baseY}"></line>
    ${svgText(heightLabelX, topY + (size.height / 2) + 4, `높이 ${height}cm`, `text-anchor="${heightAnchor}"`)}
    ${svgText(x + (size.width / 2), baseY + 16, `밑변 ${base}cm`, 'text-anchor="middle"')}
  `);
}

const PARALLELOGRAM_SLANTS = [18, -18, 10, -24, 26, -10, 22, -14];

function parallelogramGeometry(base, height, variant = 0) {
  const size = fitProportionalBox(base, height, { maxWidth: 94, maxHeight: 56, minRatio: 0.7, maxRatio: 3.1 });
  const maxSlant = Math.min(28, Math.max(10, size.width * 0.32));
  const slant = svgNum(clampValue(variantValue(PARALLELOGRAM_SLANTS, variant), -maxSlant, maxSlant));
  const totalWidth = size.width + Math.abs(slant);
  const x = svgNum(((SHAPE_VIEW_WIDTH - totalWidth) / 2) + Math.max(0, -slant));
  const bottomY = SHAPE_BOTTOM_Y;
  const topY = svgNum(bottomY - size.height);
  const guideX = svgNum(slant >= 0 ? x + slant : x + size.width + slant);

  return {
    x,
    bottomY,
    topY,
    width: size.width,
    height: size.height,
    slant,
    guideX,
    points: `${x},${bottomY} ${svgNum(x + size.width)},${bottomY} ${svgNum(x + size.width + slant)},${topY} ${svgNum(x + slant)},${topY}`,
  };
}

export function parallelogramSvg(base, height, variant = 0) {
  const shape = parallelogramGeometry(base, height, variant);
  const heightAnchor = shape.guideX > 84 ? 'end' : 'start';
  const heightLabelX = heightAnchor === 'end' ? shape.guideX - 8 : shape.guideX + 8;

  return svgShell(`
    <polygon class="outline" points="${shape.points}"></polygon>
    <line class="guide" x1="${shape.guideX}" y1="${shape.topY}" x2="${shape.guideX}" y2="${shape.bottomY}"></line>
    ${svgText(shape.x + (shape.width / 2), shape.bottomY + 16, `밑변 ${base}cm`, 'text-anchor="middle"')}
    ${svgText(heightLabelX, shape.topY + (shape.height / 2) + 4, `높이 ${height}cm`, `text-anchor="${heightAnchor}"`)}
  `);
}

const TRAPEZOID_TOP_POSITIONS = [0.5, 0.2, 0.8, 0.34, 0.66, 0.1, 0.9, 0.44];

export function trapezoidSvg(top, bottom, height, variant = 0) {
  const size = fitProportionalBox(bottom, height, { maxWidth: 108, maxHeight: 56, minRatio: 0.75, maxRatio: 3.4 });
  const bottomX = centeredX(size.width);
  const bottomY = SHAPE_BOTTOM_Y;
  const topY = svgNum(bottomY - size.height);
  const topWidth = svgNum(clampValue(size.width * (safePositive(top) / safePositive(bottom)), 28, size.width - 10));
  const topRange = Math.max(0, size.width - topWidth);
  const topX = svgNum(bottomX + (topRange * variantValue(TRAPEZOID_TOP_POSITIONS, variant)));
  const guideX = svgNum(topX + topWidth);
  const heightAnchor = guideX > 88 ? 'end' : 'start';
  const heightLabelX = heightAnchor === 'end' ? guideX - 8 : guideX + 8;

  return svgShell(`
    <polygon class="outline" points="${bottomX},${bottomY} ${svgNum(bottomX + size.width)},${bottomY} ${svgNum(topX + topWidth)},${topY} ${topX},${topY}"></polygon>
    <line class="guide" x1="${guideX}" y1="${topY}" x2="${guideX}" y2="${bottomY}"></line>
    ${svgText(topX + (topWidth / 2), topY - 7, `윗변 ${top}cm`, 'text-anchor="middle"')}
    ${svgText(bottomX + (size.width / 2), bottomY + 16, `아랫변 ${bottom}cm`, 'text-anchor="middle"')}
    ${svgText(heightLabelX, topY + (size.height / 2) + 4, `높이 ${height}cm`, `text-anchor="${heightAnchor}"`)}
  `);
}

export function rhombusSvg(d1, d2) {
  const size = fitProportionalBox(d1, d2, { maxWidth: 104, maxHeight: 66, minRatio: 0.55, maxRatio: 3 });
  const cx = SHAPE_VIEW_WIDTH / 2;
  const cy = 52;
  const leftX = svgNum(cx - (size.width / 2));
  const rightX = svgNum(cx + (size.width / 2));
  const topY = svgNum(cy - (size.height / 2));
  const bottomY = svgNum(cy + (size.height / 2));

  return svgShell(`
    <polygon class="outline" points="${cx},${topY} ${rightX},${cy} ${cx},${bottomY} ${leftX},${cy}"></polygon>
    <line class="guide" x1="${leftX}" y1="${cy}" x2="${rightX}" y2="${cy}"></line>
    <line class="guide" x1="${cx}" y1="${topY}" x2="${cx}" y2="${bottomY}"></line>
    ${svgText(cx, topY - 7, `대각선 ${d1}cm`, 'text-anchor="middle"')}
    ${svgText(cx, bottomY + 12, `대각선 ${d2}cm`, 'text-anchor="middle"')}
  `);
}

export function perimeterRhombusSvg(side) {
  return svgShell(`
    <polygon class="outline" points="78,18 122,52 78,86 34,52"></polygon>
    <text x="98" y="41">${side}cm</text>
  `);
}

export function perimeterTriangleSvg(a, b, c) {
  return svgShell(`
    <polygon class="outline" points="24,78 124,78 70,18"></polygon>
    <text x="54" y="94">${a}cm</text>
    <text x="30" y="49">${b}cm</text>
    <text x="97" y="48">${c}cm</text>
  `);
}
