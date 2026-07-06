'use strict';

import { rand, resetSheetContext, generateWithUnique } from './utils.js';
import { escapeAttr } from './utils.js';
import {
  PDF_LAYOUTS, GRID_LAYOUTS, resolveGridLayout, applyGridLayout, getHtmlLayoutConfig,
} from './layout.js';
import {
  PDF_WORKSHEET_MAP, catalogMap,
  isPdfWorksheet, getPdfOpType, buildSheetTitle, getGradeMeta, PDF_GENERATORS,
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

  if (problem.kind === 'decimalVertical') {
    return renderDecimalVertical(problem, idx);
  }

  if (problem.kind === 'decimalLongDiv') {
    return renderDecimalLongDiv(problem, idx);
  }

  const layoutClass = problem.layout || 'horiz-box';
  const itemClass = problem.itemClass ? ` ${problem.itemClass}` : '';
  return `<div class="problem-item${itemClass}">${num}<div class="${layoutClass}">${problem.html}</div></div>`;
}

function decimalParts(value) {
  const text = String(value);
  const pointIndex = text.indexOf('.');
  const digits = text.replace('.', '').split('');
  return {
    digits,
    decimalAfter: pointIndex === -1 ? null : text.slice(0, pointIndex).length,
  };
}

function decimalStartCol(parts, cols) {
  return cols - parts.digits.length + 1;
}

function decimalDigitNode(digit, col, row, isAnswer = false, colOffset = 1) {
  const safeDigit = escapeAttr(digit);
  const answerAttr = isAnswer ? ` data-ans="${safeDigit}"` : '';
  const answerClass = isAnswer ? ' decimal-answer-digit' : '';
  return `<span class="decimal-grid-digit${answerClass}" style="--grid-col:${col + colOffset};--row:${row};"${answerAttr}>${safeDigit}</span>`;
}

function decimalDigitNodes(parts, startCol, row, isAnswer = false, colOffset = 1) {
  return parts.digits
    .map((digit, i) => decimalDigitNode(digit, startCol + i, row, isAnswer, colOffset))
    .join('');
}

function decimalPointNode(parts, startCol, row, isAnswer = false, lineOffset = 2) {
  if (parts.decimalAfter === null) return '';
  const line = (startCol - 1) + parts.decimalAfter;
  const answerClass = isAnswer ? ' decimal-answer-point' : '';
  return `<span class="decimal-point-on-line${answerClass}" style="--grid-line:${line + lineOffset};--row:${row};"></span>`;
}

function renderDecimalVertical(problem, idx) {
  const num1 = decimalParts(problem.num1);
  const num2 = decimalParts(problem.num2);
  const ans = decimalParts(problem.ans);
  const workRows = problem.workRows ?? 2;
  const cols = Math.max(num1.digits.length, num2.digits.length, ans.digits.length, 4);
  const rows = workRows + 3;
  const topStart = decimalStartCol(num1, cols);
  const bottomStart = decimalStartCol(num2, cols);
  const answerStart = decimalStartCol(ans, cols);

  const body = [
    '<div class="decimal-grid-surface"></div>',
    `<span class="decimal-grid-op" style="--row:2;">${problem.op}</span>`,
    decimalDigitNodes(num1, topStart, 1),
    decimalPointNode(num1, topStart, 1),
    decimalDigitNodes(num2, bottomStart, 2),
    decimalPointNode(num2, bottomStart, 2),
    decimalDigitNodes(ans, answerStart, rows, true),
    decimalPointNode(ans, answerStart, rows, true),
  ].join('');

  return `<div class="problem-item decimal-grid-item"><div class="problem-num">${idx}</div><div class="decimal-vertical-grid" style="--cols:${cols};--rows:${rows};">${body}</div></div>`;
}

function renderDecimalLongDiv(problem, idx) {
  const dvsr = problem.workDvsr ?? problem.dvsr;
  const dvnd = problem.workDvnd ?? problem.dvnd;
  const quot = problem.quot ?? problem.ans;
  const divisor = decimalParts(dvsr);
  const dividend = decimalParts(dvnd);
  const quotient = decimalParts(quot);
  const divisorCols = Math.max(divisor.digits.length, 1);
  const workCols = Math.max(dividend.digits.length, quotient.digits.length, 4);
  const workRows = problem.workRows ?? 5;
  const rows = workRows + 2;
  const divisorStart = decimalStartCol(divisor, divisorCols);
  const dividendStart = divisorCols + 1;
  const quotientStart = divisorCols + 1;
  const totalCols = divisorCols + workCols;

  const html = [
    '<div class="decimal-longdiv-surface"></div>',
    `<span class="decimal-longdiv-top-line" style="--start-line:${divisorCols + 1};"></span>`,
    `<span class="decimal-longdiv-side-line" style="--side-line:${divisorCols + 1};"></span>`,
    decimalDigitNodes(quotient, quotientStart, 1, true, 0),
    decimalPointNode(quotient, quotientStart, 1, true, 1),
    decimalDigitNodes(divisor, divisorStart, 2, false, 0),
    decimalPointNode(divisor, divisorStart, 2, false, 1),
    decimalDigitNodes(dividend, dividendStart, 2, false, 0),
    decimalPointNode(dividend, dividendStart, 2, false, 1),
  ].join('');

  return `<div class="problem-item decimal-grid-item"><div class="problem-num">${idx}</div><div class="decimal-longdiv-grid" style="--divisor-cols:${divisorCols};--work-cols:${workCols};--start-line:${divisorCols + 1};--cols:${totalCols};--rows:${rows};">${html}</div></div>`;
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
  if (item.kind === 'diagnostic') return (item.sourceIds || []).length * 4;
  return isPdfWorksheet(item) ? getPdfLimit(item) : getHtmlLimit(item);
}

function withLayoutOverrides(config, options) {
  if (!options || !options.maxCols) return config;
  const maxCols = Math.max(1, Math.min(config.maxCols, options.maxCols));
  return {
    ...config,
    maxCols,
    minCols: Math.min(config.minCols || 1, maxCols),
  };
}

function formatSheetContext(generatorContext = {}) {
  const dans = Array.isArray(generatorContext.gugudanDans)
    ? generatorContext.gugudanDans.filter((value) => Number.isInteger(value) && value >= 2 && value <= 9)
    : [];
  if (!dans.length) return '';
  return `선택 단: ${dans.map((dan) => `${dan}단`).join(', ')}`;
}

function appendSheetTitle(sheet, item, options = {}) {
  const titleWrap = document.createElement('div');
  titleWrap.className = 'sheet-title';
  const title = buildSheetTitle(item);
  const main = document.createElement('div');
  main.className = 'sheet-title-main';
  main.textContent = title.main;
  titleWrap.appendChild(main);

  const contextText = formatSheetContext(options.generatorContext);
  if (contextText) {
    const detail = document.createElement('div');
    detail.className = 'sheet-title-detail';
    detail.textContent = contextText;
    titleWrap.appendChild(detail);
  }

  sheet.appendChild(titleWrap);
}

export function createSheet(item, countOverride, fontScale = 1, options = {}) {
  resetSheetContext();

  if (isPdfWorksheet(item)) {
    const opType = getPdfOpType(item);
    const cfg = withLayoutOverrides(PDF_LAYOUTS[opType], options);
    const count = countOverride || item.count;
    const layout = resolveGridLayout(cfg, count, fontScale);
    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    appendSheetTitle(sheet, item, options);

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
  const layoutCfg = withLayoutOverrides(getHtmlLayoutConfig(item) || {
    minCols: 1, maxCols: 4, maxRows: 10, targetCellAspect: 1,
    minCellWidth: 44, minCellHeight: 28, baseGap: [12, 8],
  }, options);
  const layout = resolveGridLayout(layoutCfg, count, fontScale);
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  appendSheetTitle(sheet, item, options);

  const grid = document.createElement('div');
  grid.className = `problem-grid ${item.grid}`;
  applyGridLayout(grid, layout);

  const generatorContext = options.generatorContext || {};
  for (let i = 1; i <= count; i++) {
    const problem = generateWithUnique(() => item.generator(generatorContext, i));
    grid.insertAdjacentHTML('beforeend', renderItem(problem, i));
  }

  sheet.appendChild(grid);
  return sheet;
}

/* ── 선수학습 진단지 렌더링 ── */

const DIAGNOSTIC_PROBLEMS_PER_SOURCE = 4;
const DIAGNOSTIC_SOURCES_PER_COLUMN = 6;
const DIAGNOSTIC_SOURCES_PER_PAGE = DIAGNOSTIC_SOURCES_PER_COLUMN * 2;

function formatGradeShort(gradeId) {
  const meta = getGradeMeta(gradeId);
  if (meta) return meta.short;
  const match = /^g(\d-\d)$/.exec(gradeId);
  return match ? match[1] : gradeId;
}

function diagnosticSourceTitle(source) {
  const tag = source.from ? ` (${formatGradeShort(source.from)})` : '';
  return `${source.label}${tag}`;
}

function diagnosticAnswer(value) {
  return `<span class="diagnostic-answer" data-ans="${escapeAttr(value)}">${escapeAttr(value)}</span>`;
}

function renderDiagnosticExpression(problem, idx, expression, answer) {
  return `<div class="diagnostic-problem">
    <span class="diagnostic-problem-num">${idx}</span>
    <span class="diagnostic-expression">${expression} = ${diagnosticAnswer(answer)}</span>
  </div>`;
}

function renderDiagnosticProblem(problem, idx) {
  if (problem && Number.isFinite(problem.num1) && Number.isFinite(problem.num2)) {
    return renderDiagnosticExpression(problem, idx, `${problem.num1} ${problem.op} ${problem.num2}`, problem.ans);
  }

  if (problem && (problem.kind === 'longdiv' || (Number.isFinite(problem.dvsr) && Number.isFinite(problem.dvnd)))) {
    const answer = problem.rem > 0 ? `${problem.quot} \u2026 ${problem.rem}` : problem.quot;
    return renderDiagnosticExpression(problem, idx, `${problem.dvnd} \u00f7 ${problem.dvsr}`, answer);
  }

  if (problem && problem.kind === 'html') {
    const layoutClass = problem.layout || 'horiz-box';
    const itemClass = problem.itemClass ? ` ${problem.itemClass}` : '';
    return `<div class="diagnostic-problem${itemClass}">
      <span class="diagnostic-problem-num">${idx}</span>
      <span class="diagnostic-html ${layoutClass}">${problem.html}</span>
    </div>`;
  }

  return `<div class="diagnostic-problem">${renderItem(problem, idx)}</div>`;
}

function generateDiagnosticProblem(source) {
  const generator = isPdfWorksheet(source) ? PDF_GENERATORS[getPdfOpType(source)] : source.generator;
  return generateWithUnique(generator);
}

function renderDiagnosticBlock(source, startIndex) {
  let problemIndex = startIndex;
  const problems = [];
  for (let i = 0; i < DIAGNOSTIC_PROBLEMS_PER_SOURCE; i++) {
    problems.push(renderDiagnosticProblem(generateDiagnosticProblem(source), problemIndex));
    problemIndex++;
  }

  return {
    html: `<section class="diagnostic-block">
      <h2 class="diagnostic-block-title">${diagnosticSourceTitle(source)}</h2>
      <div class="diagnostic-problems">${problems.join('')}</div>
    </section>`,
    nextIndex: problemIndex,
  };
}

function appendDiagnosticColumn(container, sources, problemIndex) {
  let nextIndex = problemIndex;
  for (const source of sources) {
    const rendered = renderDiagnosticBlock(source, nextIndex);
    container.insertAdjacentHTML('beforeend', rendered.html);
    nextIndex = rendered.nextIndex;
  }
  return nextIndex;
}

export function createDiagnosticSheets(item, fontScale = 1) {
  resetSheetContext();

  const sources = (item.sourceIds || [])
    .map((id) => catalogMap[id])
    .filter(Boolean);
  const sheets = [];
  let problemIndex = 1;
  const pageCount = Math.max(1, Math.ceil(sources.length / DIAGNOSTIC_SOURCES_PER_PAGE));

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const pageSources = sources.slice(
      pageIndex * DIAGNOSTIC_SOURCES_PER_PAGE,
      (pageIndex + 1) * DIAGNOSTIC_SOURCES_PER_PAGE
    );
    const leftSources = pageSources.slice(0, DIAGNOSTIC_SOURCES_PER_COLUMN);
    const rightSources = pageSources.slice(DIAGNOSTIC_SOURCES_PER_COLUMN);

    const sheet = document.createElement('div');
    sheet.className = 'sheet diagnostic-sheet';
    sheet.style.setProperty('--font-scale', fontScale);

    const titleWrap = document.createElement('div');
    titleWrap.className = 'sheet-title diagnostic-title';
    const title = buildSheetTitle(item);
    const main = document.createElement('div');
    main.className = 'sheet-title-main';
    main.textContent = pageCount > 1 ? `${title.main} (${pageIndex + 1}/${pageCount})` : title.main;
    titleWrap.appendChild(main);
    sheet.appendChild(titleWrap);

    const columns = document.createElement('div');
    columns.className = 'diagnostic-columns';
    const left = document.createElement('div');
    left.className = 'diagnostic-column';
    const right = document.createElement('div');
    right.className = 'diagnostic-column';

    problemIndex = appendDiagnosticColumn(left, leftSources, problemIndex);
    problemIndex = appendDiagnosticColumn(right, rightSources, problemIndex);

    columns.appendChild(left);
    columns.appendChild(right);
    sheet.appendChild(columns);
    sheets.push(sheet);
  }

  return sheets;
}
