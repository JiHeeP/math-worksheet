'use strict';

import { rand, resetSheetContext, generateWithUnique } from './utils.js';
import { escapeAttr } from './utils.js';
import {
  PDF_LAYOUTS, GRID_LAYOUTS, resolveGridLayout, applyGridLayout, getHtmlLayoutConfig,
} from './layout.js';
import {
  PDF_WORKSHEET_MAP, catalogMap,
  isPdfWorksheet, getPdfOpType, buildSheetTitle, PDF_GENERATORS,
} from './catalog.js';

/* ── HTML 문제 렌더링 ── */

export function renderItem(problem, idx) {
  const num = `<div class="problem-num">${idx}</div>`;

  if (problem.kind === 'vertical') {
    return `<div class="problem-item">${num}
      <div class="calc-wrapper"><div class="calc-box">
        <div class="row">${problem.num1}</div>
        <div class="operator-row"><span>${problem.op}</span><span>${problem.num2}</span></div>
        <div class="calc-ans">${problem.ans}</div>
      </div></div>
    </div>`;
  }

  if (problem.kind === 'longdiv') {
    const remStr = problem.rem > 0 ? ` \u2026 ${problem.rem}` : '';
    return `<div class="problem-item">${num}
      <table class="ldiv-table">
        <tr>
          <td></td>
          <td><div class="ldiv-q-box"><span data-ans="${problem.quot}${remStr}">${problem.quot}${remStr}</span></div></td>
        </tr>
        <tr>
          <td class="ldiv-dvsr-td">${problem.dvsr}</td>
          <td class="ldiv-dvnd-td">${problem.dvnd}</td>
        </tr>
      </table>
    </div>`;
  }

  const layoutClass = problem.layout || 'horiz-box';
  const itemClass = problem.itemClass ? ` ${problem.itemClass}` : '';
  return `<div class="problem-item${itemClass}">${num}<div class="${layoutClass}">${problem.html}</div></div>`;
}

/* ── PDF 격자 렌더링 ── */

function pdfDigits(num, cols) {
  const digits = String(Math.abs(num)).split('').map(Number);
  while (digits.length < cols) digits.unshift(null);
  return digits;
}

function pdfCell(digit) {
  return digit !== null ? digit : '';
}

function renderPdfAddSub(problem, idx) {
  const cols = Math.max(
    String(problem.num1).length,
    String(problem.num2).length,
    String(Math.abs(problem.ans)).length
  );
  const d1 = pdfDigits(problem.num1, cols);
  const d2 = pdfDigits(problem.num2, cols);
  const da = pdfDigits(problem.ans, cols);

  let rows = '';
  rows += '<tr>' + '<td></td>' + d1.map((d) => `<td>${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + `<td class="pdf-op-cell pdf-sep-bottom">${problem.op}</td>` + d2.map((d) => `<td class="pdf-sep-bottom">${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + '<td></td>' + da.map((d) => `<td class="ans-digit">${pdfCell(d)}</td>`).join('') + '</tr>';

  return `<div class="problem-item"><div class="problem-num">${idx}</div><table class="pdf-grid-table">${rows}</table></div>`;
}

function renderPdfMulShort(problem, idx) {
  const cols = Math.max(String(problem.num1).length, String(problem.num2).length, String(problem.ans).length);
  const d1 = pdfDigits(problem.num1, cols);
  const d2 = pdfDigits(problem.num2, cols);
  const da = pdfDigits(problem.ans, cols);

  let rows = '';
  rows += '<tr>' + '<td></td>' + d1.map((d) => `<td>${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + '<td class="pdf-op-cell pdf-sep-bottom">\u00d7</td>' + d2.map((d) => `<td class="pdf-sep-bottom">${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + '<td></td>' + da.map((d) => `<td class="ans-digit">${pdfCell(d)}</td>`).join('') + '</tr>';

  return `<div class="problem-item"><div class="problem-num">${idx}</div><table class="pdf-grid-table">${rows}</table></div>`;
}

function renderPdfMulLong(problem, idx) {
  const ones = problem.num2 % 10;
  const tens = Math.floor(problem.num2 / 10);
  const partial1 = problem.num1 * ones;
  const partial2 = problem.num1 * tens;
  const cols = Math.max(
    String(problem.num1).length, String(problem.num2).length,
    String(partial1).length, String(partial2).length + 1, String(problem.ans).length
  );

  const d1 = pdfDigits(problem.num1, cols);
  const d2 = pdfDigits(problem.num2, cols);
  const dp1 = pdfDigits(partial1, cols);
  const dp2 = [];
  const p2Digits = String(partial2).split('').map(Number);
  while (dp2.length + p2Digits.length + 1 < cols) dp2.push(null);
  dp2.push(...p2Digits);
  dp2.push(null);
  const da = pdfDigits(problem.ans, cols);

  let rows = '';
  rows += '<tr>' + '<td></td>' + d1.map((d) => `<td>${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + '<td class="pdf-op-cell pdf-sep-bottom">\u00d7</td>' + d2.map((d) => `<td class="pdf-sep-bottom">${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + '<td></td>' + dp1.map((d) => `<td class="ans-digit">${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + '<td class="pdf-sep-bottom"></td>' + dp2.map((d) => `<td class="ans-digit pdf-sep-bottom">${pdfCell(d)}</td>`).join('') + '</tr>';
  rows += '<tr>' + '<td></td>' + da.map((d) => `<td class="ans-digit">${pdfCell(d)}</td>`).join('') + '</tr>';

  return `<div class="problem-item"><div class="problem-num">${idx}</div><table class="pdf-grid-table">${rows}</table></div>`;
}

function simulatePdfDivision(dvsr, dvnd) {
  const digits = String(dvnd);
  const steps = [];
  let current = 0;
  let started = false;

  for (let i = 0; i < digits.length; i++) {
    current = (current * 10) + parseInt(digits[i], 10);
    const quotientDigit = Math.floor(current / dvsr);
    if (quotientDigit > 0 || started) {
      started = true;
      const sub = quotientDigit * dvsr;
      steps.push({ sub, rem: current - sub });
      current -= sub;
    }
  }
  return steps;
}

function renderPdfDiv(problem, idx) {
  const divisorCols = String(problem.dvsr).length;
  const workCols = String(problem.dvnd).length;
  const quotientDigits = pdfDigits(problem.quot, workCols);
  const divisorDigits = pdfDigits(problem.dvsr, divisorCols);
  const dividendDigits = pdfDigits(problem.dvnd, workCols);
  const steps = simulatePdfDivision(problem.dvsr, problem.dvnd);
  const workRowCount = Math.max(steps.length, 1);

  let html = '<tr>';
  for (let c = 0; c < divisorCols; c++) html += '<td></td>';
  for (let c = 0; c < workCols; c++) html += `<td class="pdf-b pdf-quot-border ans-digit">${pdfCell(quotientDigits[c])}</td>`;
  html += '</tr>';

  html += '<tr>';
  for (let c = 0; c < divisorCols; c++) {
    const cls = c === divisorCols - 1 ? 'pdf-dvsr-border' : '';
    html += `<td class="${cls}">${pdfCell(divisorDigits[c])}</td>`;
  }
  for (let c = 0; c < workCols; c++) html += `<td class="pdf-b">${pdfCell(dividendDigits[c])}</td>`;
  html += '</tr>';

  for (let row = 0; row < workRowCount; row++) {
    html += '<tr>';
    for (let c = 0; c < divisorCols; c++) html += '<td></td>';
    for (let c = 0; c < workCols; c++) html += '<td class="pdf-b"></td>';
    html += '</tr>';
    html += '<tr>';
    for (let c = 0; c < divisorCols; c++) html += '<td></td>';
    for (let c = 0; c < workCols; c++) html += '<td class="pdf-b" style="border-top:2.5px solid #2f3640;"></td>';
    html += '</tr>';
  }

  html += '<tr>';
  for (let c = 0; c < divisorCols; c++) html += '<td></td>';
  for (let c = 0; c < workCols; c++) html += '<td class="pdf-b"></td>';
  html += '</tr>';

  return `<div class="problem-item"><div class="problem-num">${idx}</div><table class="pdf-div-table">${html}</table></div>`;
}

function renderPdfProblem(opType, problem, idx) {
  const type = PDF_LAYOUTS[opType].type;
  if (type === 'addsub') return renderPdfAddSub(problem, idx);
  if (type === 'mul_s') return renderPdfMulShort(problem, idx);
  if (type === 'mul_l') return renderPdfMulLong(problem, idx);
  return renderPdfDiv(problem, idx);
}

/* ── 시트 생성 ── */

function getPdfLimit(item) {
  const cfg = PDF_LAYOUTS[getPdfOpType(item)];
  return cfg.maxCols * cfg.maxRows;
}

function getHtmlLimit(item) {
  const cfg = getHtmlLayoutConfig(item);
  return cfg ? cfg.maxCols * cfg.maxRows : 40;
}

export function getWorksheetLimit(item) {
  return isPdfWorksheet(item) ? getPdfLimit(item) : getHtmlLimit(item);
}

export function createSheet(item, countOverride, fontScale = 1) {
  resetSheetContext();

  if (isPdfWorksheet(item)) {
    const opType = getPdfOpType(item);
    const cfg = PDF_LAYOUTS[opType];
    const count = countOverride || item.count;
    const layout = resolveGridLayout(cfg, count, fontScale);
    const sheet = document.createElement('div');
    sheet.className = 'sheet';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'sheet-title';
    const title = buildSheetTitle(item);
    const main = document.createElement('div');
    main.className = 'sheet-title-main';
    main.textContent = title.main;
    const sub = document.createElement('div');
    sub.className = 'sheet-title-sub';
    sub.textContent = title.sub;
    titleWrap.appendChild(main);
    titleWrap.appendChild(sub);
    sheet.appendChild(titleWrap);

    const grid = document.createElement('div');
    grid.className = 'problem-grid';
    applyGridLayout(grid, layout);

    for (let i = 1; i <= count; i++) {
      const problem = generateWithUnique(PDF_GENERATORS[opType]);
      grid.insertAdjacentHTML('beforeend', renderPdfProblem(opType, problem, i));
    }

    sheet.appendChild(grid);
    return sheet;
  }

  const count = countOverride || item.count;
  const layoutCfg = getHtmlLayoutConfig(item) || {
    minCols: 1, maxCols: 4, maxRows: 10, targetCellAspect: 1,
    minCellWidth: 44, minCellHeight: 28, baseGap: [12, 8],
  };
  const layout = resolveGridLayout(layoutCfg, count, fontScale);
  const sheet = document.createElement('div');
  sheet.className = 'sheet';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'sheet-title';
  const title = buildSheetTitle(item);
  const main = document.createElement('div');
  main.className = 'sheet-title-main';
  main.textContent = title.main;
  const sub = document.createElement('div');
  sub.className = 'sheet-title-sub';
  sub.textContent = title.sub;
  titleWrap.appendChild(main);
  titleWrap.appendChild(sub);
  sheet.appendChild(titleWrap);

  const grid = document.createElement('div');
  grid.className = `problem-grid ${item.grid}`;
  applyGridLayout(grid, layout);

  for (let i = 1; i <= count; i++) {
    const problem = generateWithUnique(item.generator);
    grid.insertAdjacentHTML('beforeend', renderItem(problem, i));
  }

  sheet.appendChild(grid);
  return sheet;
}
