'use strict';

import {
  GRADE_META, DEFAULT_GRADE_ID,
  catalogMap, getUnitsOfGrade, getUnitMeta, getWorksheetsByUnit, getGradeMeta,
} from './catalog.js';
import { createDiagnosticSheets, createSheet, getWorksheetLimit } from './renderers.js';
import { getHtmlLayoutConfig } from './layout.js';

let answerShown = false;
let selectedGugudanDan = 2;
let selectedSectionFilter = '전체';
const fitCountCache = new Map();
const SECTION_FILTERS = ['전체', '진단지', '선수학습', '본단원'];

function populateGradeSelect() {
  const gradeSelect = document.getElementById('gradeSelect');
  gradeSelect.innerHTML = Object.values(GRADE_META)
    .map((g) => `<option value="${g.id}">${g.name}</option>`)
    .join('');
  gradeSelect.value = DEFAULT_GRADE_ID;
}

function populateUnitSelect(gradeId) {
  const unitSelect = document.getElementById('unitSelect');
  const units = getUnitsOfGrade(gradeId);
  unitSelect.innerHTML = Object.entries(units)
    .map(([id, meta]) => `<option value="${id}">${meta.short}: ${meta.name}</option>`)
    .join('');
}

function formatGradeShort(gradeId) {
  const meta = getGradeMeta(gradeId);
  if (meta) return meta.short;
  // 미구현 학기 fallback: 'g4-2' → '4-2'
  const match = /^g(\d-\d)$/.exec(gradeId);
  return match ? match[1] : gradeId;
}

function updateSelectedMeta() {
  // 메타 칩(단원·구분, 교과 차시) 은 드롭다운 라벨과 중복되어 제거됨 (2026-05-02).
  // 여기서는 문제 수 입력 한도만 갱신.
  const item = catalogMap[document.getElementById('worksheetSelect').value];
  if (!item) return;
  const countInput = document.getElementById('problemCount');
  const fontScale = getCurrentFontScale();
  const generatorContext = getCurrentGeneratorContext(item);
  const limit = getSafeWorksheetLimit(item, fontScale, generatorContext);
  countInput.placeholder = limit;
  countInput.dataset.max = limit;
  if (countInput.value) {
    countInput.value = Math.min(parseInt(countInput.value, 10) || limit, limit);
  }
}

function isGugudanDanControlled(item) {
  return Boolean(item && item.controls && item.controls.gugudanDan);
}

function getCurrentGeneratorContext(item) {
  return isGugudanDanControlled(item) ? { gugudanDan: selectedGugudanDan } : {};
}

function updateGugudanDanControl(item) {
  const control = document.getElementById('gugudanDanControl');
  if (!control) return;

  const enabled = isGugudanDanControlled(item);
  control.hidden = !enabled;
  control.querySelectorAll('.dan-button').forEach((button) => {
    const active = Number(button.dataset.dan) === selectedGugudanDan;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function sanitizeProblemCountInput() {
  const input = document.getElementById('problemCount');
  input.value = input.value.replace(/[^\d]/g, '');
}

function handleProblemCountKeydown(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  generate('replace');
}

function getCurrentUnitId() {
  return document.getElementById('unitSelect').value;
}

function getSectionFilteredItems(items) {
  if (selectedSectionFilter === '전체') return items;
  return items.filter((item) => item.section === selectedSectionFilter);
}

function ensureSectionFilterAvailable(items) {
  if (selectedSectionFilter === '전체') return;
  if (items.some((item) => item.section === selectedSectionFilter)) return;
  selectedSectionFilter = '전체';
}

function updateSectionFilterControl(items) {
  const control = document.getElementById('sectionFilter');
  if (!control) return;

  const available = new Set(items.map((item) => item.section));
  control.querySelectorAll('.stage-filter-button').forEach((button) => {
    const section = button.dataset.sectionFilter;
    const disabled = section !== '전체' && !available.has(section);
    const active = section === selectedSectionFilter;
    button.disabled = disabled;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function populateWorksheetSelect(gradeId, unitId, preferredId) {
  const worksheetSelect = document.getElementById('worksheetSelect');
  const allItems = getWorksheetsByUnit(gradeId, unitId);
  ensureSectionFilterAvailable(allItems);
  updateSectionFilterControl(allItems);

  const items = getSectionFilteredItems(allItems);
  worksheetSelect.innerHTML = items.map((item) => {
    // `from` 이 명시된 항목 (선수학습) 만 출처 태그 표시.
    // 본단원은 현재 학기와 같아서 태그 생략 (사용자 결정 2026-05-02).
    const tag = item.from ? ` (${formatGradeShort(item.from)})` : '';
    return `<option value="${item.id}">[${item.section}] ${item.label}${tag}</option>`;
  }).join('');

  const nextId = preferredId && items.some((item) => item.id === preferredId) ? preferredId : (items[0] && items[0].id);
  if (nextId) {
    const item = catalogMap[nextId];
    worksheetSelect.value = nextId;
    applyWorksheetDefaultFontScale(item);
    updateGugudanDanControl(item);
    updateSelectedMeta();
  }
}

function currentGradeId() {
  return document.getElementById('gradeSelect').value;
}

function getCurrentFontScale() {
  return parseFloat(document.getElementById('fontScale').value) || 1;
}

function applyWorksheetDefaultFontScale(item) {
  if (!item || !item.defaultFontScale) return;
  const fontScaleSelect = document.getElementById('fontScale');
  const nextValue = String(item.defaultFontScale);
  if (fontScaleSelect.value === nextValue) return;
  fontScaleSelect.value = nextValue;
  const container = document.getElementById('sheets-container');
  container.style.setProperty('--font-scale', nextValue);
  container.style.setProperty('--pdf-scale', nextValue);
}

function getFitCacheKey(item, fontScale, generatorContext = {}) {
  const contextKey = isGugudanDanControlled(item)
    ? `@dan-${generatorContext.gugudanDan || selectedGugudanDan}`
    : '';
  return `${item.id}@${fontScale.toFixed(2)}${contextKey}`;
}

function getMeasureHost() {
  let host = document.getElementById('fitMeasureHost');
  if (host) return host;

  host = document.createElement('div');
  host.id = 'fitMeasureHost';
  host.setAttribute('aria-hidden', 'true');
  host.style.position = 'absolute';
  host.style.left = '-10000px';
  host.style.top = '0';
  host.style.width = 'var(--paper-width)';
  host.style.pointerEvents = 'none';
  host.style.visibility = 'hidden';
  document.body.appendChild(host);
  return host;
}

function sheetFits(sheet) {
  const grid = sheet.querySelector('.problem-grid');
  const items = Array.from(sheet.querySelectorAll('.problem-item'));
  const sheetOverflow = sheet.scrollHeight > sheet.clientHeight + 1 || sheet.scrollWidth > sheet.clientWidth + 1;
  const gridOverflow = grid && (grid.scrollHeight > grid.clientHeight + 1 || grid.scrollWidth > grid.clientWidth + 1);
  const sheetRect = sheet.getBoundingClientRect();
  const itemOverflow = items.some((item) => (
    item.scrollHeight > item.clientHeight + 1 ||
    item.scrollWidth > item.clientWidth + 1 ||
    item.getBoundingClientRect().bottom > sheetRect.bottom + 1 ||
    item.getBoundingClientRect().right > sheetRect.right + 1
  ));

  return (
    !sheetOverflow &&
    !gridOverflow &&
    !itemOverflow &&
    !hasWrappedHorizontalProblem(sheet) &&
    !hasProblemContentOverflow(sheet)
  );
}

function hasWrappedHorizontalProblem(sheet) {
  return Array.from(sheet.querySelectorAll('.horiz-box')).some((box) => {
    const rect = box.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    const style = getComputedStyle(box);
    const fontSize = parseFloat(style.fontSize) || 16;
    const childHeights = Array.from(box.children)
      .map((child) => child.getBoundingClientRect().height)
      .filter(Boolean);
    const tallestChild = Math.max(0, ...childHeights);
    const oneLineLimit = Math.max(fontSize * 1.55, fontSize + 12, tallestChild + 3);
    const widthOverflow = box.scrollWidth > box.clientWidth + 1;
    return widthOverflow || rect.height > oneLineLimit;
  });
}

function hasProblemContentOverflow(sheet) {
  return Array.from(sheet.querySelectorAll('.problem-item')).some((item) => {
    const itemRect = item.getBoundingClientRect();
    const content = Array.from(item.children).filter((child) => !child.classList.contains('problem-num'));

    return content.some((child) => {
      const rect = child.getBoundingClientRect();
      const isDecimalGrid = child.matches('.decimal-vertical-grid, .decimal-longdiv-grid');
      const scrollOverflow = !isDecimalGrid && (child.scrollWidth > child.clientWidth + 1 || child.scrollHeight > child.clientHeight + 1);
      const outsideItem = (
        rect.left < itemRect.left - 1 ||
        rect.right > itemRect.right + 1 ||
        rect.top < itemRect.top - 1 ||
        rect.bottom > itemRect.bottom + 1
      );
      return scrollOverflow || outsideItem;
    });
  });
}

function getColumnAttempts(item, count) {
  if (item.kind !== 'html') return [null];

  const config = getHtmlLayoutConfig(item);
  if (!config) return [null];

  const attempts = [null];
  for (let maxCols = config.maxCols - 1; maxCols >= 1; maxCols--) {
    if (count > maxCols * config.maxRows) continue;
    attempts.push({ maxCols });
  }
  return attempts;
}

function createFittedSheet(item, desiredCount, fontScale, updateCache = false, generatorContext = {}) {
  const host = getMeasureHost();
  host.style.setProperty('--font-scale', fontScale);
  host.style.setProperty('--pdf-scale', fontScale);
  const hardLimit = getWorksheetLimit(item);
  const start = Math.min(hardLimit, Math.max(1, desiredCount || hardLimit));

  for (let count = start; count >= 1; count--) {
    for (const options of getColumnAttempts(item, count)) {
      const sheet = createSheet(item, count, fontScale, {
        ...(options || {}),
        generatorContext,
      });
      host.appendChild(sheet);
      const fits = sheetFits(sheet);
      if (fits) {
        if (updateCache) fitCountCache.set(getFitCacheKey(item, fontScale, generatorContext), count);
        return { sheet, count };
      }
      sheet.remove();
    }
  }

  const fallback = createSheet(item, 1, fontScale, { generatorContext });
  host.appendChild(fallback);
  if (updateCache) fitCountCache.set(getFitCacheKey(item, fontScale, generatorContext), 1);
  return { sheet: fallback, count: 1 };
}

function getSafeWorksheetLimit(item, fontScale, generatorContext = {}) {
  if (item.kind === 'diagnostic') return getWorksheetLimit(item);

  const key = getFitCacheKey(item, fontScale, generatorContext);
  if (fitCountCache.has(key)) return fitCountCache.get(key);

  const hardLimit = getWorksheetLimit(item);
  const { sheet, count } = createFittedSheet(item, hardLimit, fontScale, true, generatorContext);
  sheet.remove();
  return count;
}

function generate(mode) {
  const container = document.getElementById('sheets-container');
  const problemCountInput = document.getElementById('problemCount');
  const worksheetId = document.getElementById('worksheetSelect').value;
  const pageCount = Math.min(20, Math.max(1, parseInt(document.getElementById('pageCount').value, 10) || 1));
  const item = catalogMap[worksheetId];
  if (!item) return;

  const customCount = parseInt(problemCountInput.value, 10);
  const fontScale = getCurrentFontScale();
  const generatorContext = getCurrentGeneratorContext(item);
  container.style.setProperty('--font-scale', fontScale);
  container.style.setProperty('--pdf-scale', fontScale);

  if (mode === 'replace') container.innerHTML = '';
  container.classList.remove('answers-shown');
  answerShown = false;

  if (item.kind === 'diagnostic') {
    const totalCount = getWorksheetLimit(item);
    for (let i = 0; i < pageCount; i++) {
      createDiagnosticSheets(item, fontScale).forEach((sheet) => container.appendChild(sheet));
    }
    problemCountInput.value = '';
    problemCountInput.dataset.max = totalCount;
    problemCountInput.placeholder = totalCount;
    return;
  }

  const maxCount = getSafeWorksheetLimit(item, fontScale, generatorContext);
  const hasCustomCount = customCount > 0;
  const desiredCount = hasCustomCount ? Math.min(getWorksheetLimit(item), customCount) : maxCount;
  let fittedCount = maxCount;
  for (let i = 0; i < pageCount; i++) {
    const fitted = createFittedSheet(
      item,
      desiredCount,
      fontScale,
      !hasCustomCount || customCount > maxCount,
      generatorContext,
    );
    fittedCount = Math.min(fittedCount, fitted.count);
    container.appendChild(fitted.sheet);
  }

  if (!customCount || customCount > fittedCount) {
    problemCountInput.value = customCount > fittedCount ? fittedCount : '';
    problemCountInput.dataset.max = fittedCount;
    problemCountInput.placeholder = fittedCount;
  }
}

function toggleAnswers() {
  answerShown = !answerShown;
  document.getElementById('sheets-container').classList.toggle('answers-shown', answerShown);
}

/* ── 이벤트 바인딩 ── */

document.getElementById('gradeSelect').addEventListener('change', (event) => {
  const gradeId = event.target.value;
  populateUnitSelect(gradeId);
  const firstUnitId = Object.keys(getUnitsOfGrade(gradeId))[0];
  populateWorksheetSelect(gradeId, firstUnitId);
});

document.getElementById('unitSelect').addEventListener('change', (event) => {
  populateWorksheetSelect(currentGradeId(), event.target.value);
});

document.getElementById('sectionFilter').addEventListener('click', (event) => {
  const button = event.target.closest('.stage-filter-button');
  if (!button || button.disabled) return;

  const nextFilter = button.dataset.sectionFilter;
  if (!SECTION_FILTERS.includes(nextFilter)) return;
  selectedSectionFilter = nextFilter;
  populateWorksheetSelect(currentGradeId(), getCurrentUnitId());
  generate('replace');
});

document.getElementById('worksheetSelect').addEventListener('change', () => {
  const item = catalogMap[document.getElementById('worksheetSelect').value];
  applyWorksheetDefaultFontScale(item);
  updateGugudanDanControl(item);
  updateSelectedMeta();
});

document.getElementById('problemCount').addEventListener('input', sanitizeProblemCountInput);
document.getElementById('problemCount').addEventListener('keydown', handleProblemCountKeydown);

document.getElementById('gugudanDanControl').addEventListener('click', (event) => {
  const button = event.target.closest('.dan-button');
  if (!button) return;

  selectedGugudanDan = Number(button.dataset.dan) || selectedGugudanDan;
  const item = catalogMap[document.getElementById('worksheetSelect').value];
  updateGugudanDanControl(item);
  updateSelectedMeta();
  if (isGugudanDanControlled(item)) generate('replace');
});

document.getElementById('fontScale').addEventListener('change', () => {
  const container = document.getElementById('sheets-container');
  const scale = document.getElementById('fontScale').value;
  container.style.setProperty('--font-scale', scale);
  container.style.setProperty('--pdf-scale', scale);
  updateSelectedMeta();
});

window.generate = generate;
window.toggleAnswers = toggleAnswers;

/* ── 초기화 ── */

populateGradeSelect();
populateUnitSelect(DEFAULT_GRADE_ID);
const firstUnitId = Object.keys(getUnitsOfGrade(DEFAULT_GRADE_ID))[0];
populateWorksheetSelect(DEFAULT_GRADE_ID, firstUnitId);
generate('replace');
