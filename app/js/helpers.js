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
 * 가르기 다이어그램: 한 수 위에 두 부분으로 가르는 가지(branch) 와 두 작은 박스.
 *   ┌─ num ─┐
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
      <span class="small-box"><span class="small-box-answer" data-ans="${escapeAttr(part1)}">${part1}</span></span>
      <span class="small-box"><span class="small-box-answer" data-ans="${escapeAttr(part2)}">${part2}</span></span>
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
  return svgShell(`
    <rect class="outline" x="30" y="20" width="95" height="58"></rect>
    <text x="67" y="16">${w}cm</text>
    <text x="131" y="54">${h}cm</text>
  `);
}

export function triangleSvg(base, height) {
  return svgShell(`
    <polygon class="outline" points="24,78 124,78 58,22"></polygon>
    <line class="guide" x1="58" y1="22" x2="58" y2="78"></line>
    <text x="68" y="18">높이 ${height}cm</text>
    <text x="55" y="95">밑변 ${base}cm</text>
  `);
}

export function parallelogramSvg(base, height) {
  return svgShell(`
    <polygon class="outline" points="36,78 122,78 102,28 16,28"></polygon>
    <line class="guide" x1="102" y1="28" x2="102" y2="78"></line>
    <text x="44" y="95">밑변 ${base}cm</text>
    <text x="109" y="56">높이 ${height}cm</text>
  `);
}

export function trapezoidSvg(top, bottom, height) {
  return svgShell(`
    <polygon class="outline" points="34,78 122,78 104,28 54,28"></polygon>
    <line class="guide" x1="104" y1="28" x2="104" y2="78"></line>
    <text x="62" y="20">윗변 ${top}cm</text>
    <text x="48" y="95">아랫변 ${bottom}cm</text>
    <text x="110" y="56">높이 ${height}cm</text>
  `);
}

export function rhombusSvg(d1, d2) {
  return svgShell(`
    <polygon class="outline" points="78,18 122,52 78,86 34,52"></polygon>
    <line class="guide" x1="34" y1="52" x2="122" y2="52"></line>
    <line class="guide" x1="78" y1="18" x2="78" y2="86"></line>
    <text x="42" y="47">대각선 ${d1}cm</text>
    <text x="84" y="34">대각선 ${d2}cm</text>
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
