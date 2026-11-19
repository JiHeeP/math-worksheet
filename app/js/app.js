'use strict';

import {
  GRADE_META, DEFAULT_GRADE_ID,
  catalogMap, getUnitsOfGrade, getUnitMeta, getWorksheetsByUnit, getGradeMeta,
  resolvePrereq,
} from './catalog.js';
import { createDiagnosticSheets, createSheet, getWorksheetLimit } from './renderers.js';
import { getHtmlLayoutConfig, getCountMultiple } from './layout.js';

let answerShown = false;
let selectedGugudanDans = [2];
let selectedNumberStage = 2;
let selectedFractionStage = 2;
let selectedSectionFilter = '본단원';
const fitCountCache = new Map();
const SECTION_FILTERS = ['전체', '진단지', '선수학습', '본단원'];
const DEFAULT_STAGE = 2;
// 난이도 버튼 라벨 (catalog controls.*Difficulty.labels 로 학습지별 덮어쓰기 가능)
const STAGE_LABELS = {
  numberStage: { labels: ['1~20', '20~50', '50~99'], hint: '계산에 쓰는 수의 범위' },
  fractionStage: { labels: ['쉬움', '보통', '어려움'], hint: '분모와 자연수 부분의 크기 (쉬움 = 작은 수)' },
};

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

function getNumberStageControl(item) {
  return item && item.controls && item.controls.numberDifficulty;
}

function getFractionStageControl(item) {
  return item && item.controls && item.controls.fractionDifficulty;
}

function clampStageToAllowed(stage, allowedStages) {
  if (!Array.isArray(allowedStages) || allowedStages.length === 0) return stage;
  if (allowedStages.includes(stage)) return stage;
  // 가장 가까운 허용 단계로 보정
  return allowedStages.reduce((best, s) => (Math.abs(s - stage) < Math.abs(best - stage) ? s : best));
}

function getCurrentGeneratorContext(item) {
  if (isGugudanDanControlled(item)) return { gugudanDans: selectedGugudanDans.slice() };
  const numCtl = getNumberStageControl(item);
  if (numCtl) {
    const allowed = numCtl.stages || [1, 2, 3];
    return { numberStage: clampStageToAllowed(selectedNumberStage, allowed) };
  }
  const fracCtl = getFractionStageControl(item);
  if (fracCtl) {
    const allowed = fracCtl.stages || [1, 2, 3];
    return { fractionStage: clampStageToAllowed(selectedFractionStage, allowed) };
  }
  return {};
}

function updateGugudanDanControl(item) {
  const control = document.getElementById('gugudanDanControl');
  if (!control) return;

  const enabled = isGugudanDanControlled(item);
  control.hidden = !enabled;
  control.querySelectorAll('.dan-button').forEach((button) => {
    const active = selectedGugudanDans.includes(Number(button.dataset.dan));
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function updateStageControl(controlId, datasetKey, item, getControlMeta, currentStage) {
  const control = document.getElementById(controlId);
  if (!control) return;

  const meta = getControlMeta(item);
  control.hidden = !meta;
  if (!meta) return;

  const allowed = meta.stages || [1, 2, 3];
  const effectiveStage = clampStageToAllowed(currentStage, allowed);
  const labelSet = STAGE_LABELS[datasetKey] || { labels: [], hint: '' };
  const labels = meta.labels || labelSet.labels;
  control.title = meta.hint || labelSet.hint;
  control.querySelectorAll('.dan-button').forEach((button) => {
    const stage = Number(button.dataset[datasetKey]);
    if (labels[stage - 1]) button.textContent = labels[stage - 1];
    const isAllowed = allowed.includes(stage);
    button.disabled = !isAllowed;
    button.classList.toggle('is-disabled', !isAllowed);
    const active = isAllowed && stage === effectiveStage;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function updateNumberStageControl(item) {
  updateStageControl('numberStageControl', 'numberStage', item, getNumberStageControl, selectedNumberStage);
}

function updateFractionStageControl(item) {
  updateStageControl('fractionStageControl', 'fractionStage', item, getFractionStageControl, selectedFractionStage);
}

function updateAllStageControls(item) {
  updateGugudanDanControl(item);
  updateNumberStageControl(item);
  updateFractionStageControl(item);
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

/* ── 학습지가 바뀔 때: 그 학습지에 맞는 기본값으로 되돌림 ──
   - 글자 크기: 학습지 기본값 → 학기 기본값 → 보통 (예전에는 진단지의 '작게'가 다음 학습지로 남았음)
   - 난이도: 2단계(보통)로 초기화 (사용자 결정 2026-11-19)
   - 해당 없는 조절은 숨김 (진단지의 문제 수 등) */
/* 글자 크기 중 이 학습지가 A4에 1문항도 제대로 안 들어가는 크기는 고를 수 없게 한다.
   (예: 긴 단계 풀이 1열 학습지의 '아주 크게') 측정은 화면이 먼저 바뀐 뒤 따로 한다. */
let fontCheckTimer = null;
function updateFontOptions(item) {
  const select = document.getElementById('fontScale');
  Array.from(select.options).forEach((option) => {
    option.disabled = false;
    option.textContent = option.textContent.replace(/ \(너무 큼\)$/, '');
  });
  clearTimeout(fontCheckTimer);
  if (!item || item.kind === 'diagnostic') return;
  fontCheckTimer = setTimeout(() => {
    const current = catalogMap[document.getElementById('worksheetSelect').value];
    if (current !== item) return;
    const ctx = getCurrentGeneratorContext(item);
    Array.from(select.options).forEach((option) => {
      const scale = parseFloat(option.value);
      if (!(scale > 1)) return;
      if (getWorksheetLimit(item, scale) <= 1) return;
      if (getSafeWorksheetLimit(item, scale, ctx) > 1) return;
      option.disabled = true;
      option.textContent += ' (너무 큼)';
    });
  }, 50);
}

function applyWorksheetDefaults(item) {
  if (!item) return;
  selectedNumberStage = DEFAULT_STAGE;
  selectedFractionStage = DEFAULT_STAGE;
  applyWorksheetDefaultFontScale(item);
  const countGroup = document.getElementById('problemCount').closest('.input-group');
  if (countGroup) countGroup.hidden = item.kind === 'diagnostic';
  document.getElementById('problemCount').value = '';
  updateAllStageControls(item);
  updateJumpControl(item);
  updateSelectedMeta();
  updateFontOptions(item);
}

/* ── 선수학습 ↔ 원본 이동 ── */

function formatActionTag(action) {
  return action && action.grade ? ` (${formatGradeShort(action.grade)})` : '';
}

function getJumpTargets(item) {
  if (!item) return [];
  const targets = [];
  const seen = new Set();
  const add = (label, action) => {
    if (!action) return;
    const key = `${action.grade}/${action.unit}/${action.sheet || ''}/${action.section || ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    targets.push({ label, action });
  };

  // 1) 선수학습 복제본 → 원래 학년 학습지
  if (item.source) {
    const r = resolvePrereq(item.source, item.grade);
    if (r.action) add(`원래 학습지로${formatActionTag(r.action)}`, r.action);
  }
  // 2) 같은 단원에 [선수학습] 항목이 있으면 그 목록으로
  if (item.section !== '선수학습') {
    const hasPre = getWorksheetsByUnit(item.grade, item.unit).some((x) => x.section === '선수학습');
    if (hasPre) add('이 단원 선수학습으로', { grade: item.grade, unit: item.unit, section: '선수학습' });
  }
  // 3) 카탈로그 prereqs (다른 학기 단원·학습지)
  (item.prereqs || []).forEach((p) => {
    const r = resolvePrereq(p, item.grade);
    if (r.action) add(`선수학습: ${r.label}`, r.action);
  });
  return targets;
}

let currentJumpTargets = [];

function updateJumpControl(item) {
  const button = document.getElementById('jumpButton');
  const select = document.getElementById('jumpSelect');
  if (!button || !select) return;
  currentJumpTargets = getJumpTargets(item);

  button.hidden = currentJumpTargets.length !== 1;
  select.hidden = currentJumpTargets.length < 2;
  if (currentJumpTargets.length === 1) {
    button.textContent = `${currentJumpTargets[0].label} →`;
  } else if (currentJumpTargets.length > 1) {
    select.innerHTML = ['<option value="">선수학습으로 이동…</option>']
      .concat(currentJumpTargets.map((t, i) => `<option value="${i}">${t.label}</option>`))
      .join('');
    select.value = '';
  }
}

function jumpTo(index) {
  const target = currentJumpTargets[index];
  if (target) navigateTo(target.action, { push: true });
}

/* ── 주소(#학기/단원/학습지)로 열기 · 뒤로 가기 ── */

function buildHash() {
  const sheet = document.getElementById('worksheetSelect').value;
  return `#${currentGradeId()}/${getCurrentUnitId()}/${sheet}`;
}

function syncHash(push = false) {
  const hash = buildHash();
  if (location.hash === hash) return;
  try {
    if (push) history.pushState(null, '', hash);
    else history.replaceState(null, '', hash);
  } catch (e) { /* file:// 등에서 실패해도 동작에는 지장 없음 */ }
}

function parseHash() {
  const raw = decodeURIComponent((location.hash || '').replace(/^#/, ''));
  if (!raw) return null;
  const [grade, unit, sheet] = raw.split('/');
  if (!GRADE_META[grade]) return null;
  const action = { grade };
  if (unit && getUnitMeta(grade, unit)) action.unit = unit;
  if (sheet && catalogMap[sheet] && catalogMap[sheet].grade === grade) {
    action.sheet = sheet;
    action.unit = catalogMap[sheet].unit;
  }
  return action;
}

function navigateTo(action, { push = false, generateNow = true } = {}) {
  if (!action || !GRADE_META[action.grade]) return;
  const gradeSelect = document.getElementById('gradeSelect');
  const unitSelect = document.getElementById('unitSelect');
  gradeSelect.value = action.grade;
  populateUnitSelect(action.grade);
  const unitId = action.unit && getUnitMeta(action.grade, action.unit)
    ? action.unit
    : Object.keys(getUnitsOfGrade(action.grade))[0];
  unitSelect.value = unitId;

  const sheet = action.sheet ? catalogMap[action.sheet] : null;
  if (sheet) selectedSectionFilter = sheet.section;
  else if (action.section) selectedSectionFilter = action.section;
  else selectedSectionFilter = '본단원';

  populateWorksheetSelect(action.grade, unitId, action.sheet);
  syncHash(push);
  if (generateNow) generate('replace');
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
    applyWorksheetDefaults(item);
  }
}

function currentGradeId() {
  return document.getElementById('gradeSelect').value;
}

function getCurrentFontScale() {
  return parseFloat(document.getElementById('fontScale').value) || 1;
}

function getDefaultFontScale(item) {
  if (!item) return 1;
  if (item.defaultFontScale) return item.defaultFontScale;
  const gradeMeta = getGradeMeta(item.grade);
  return (gradeMeta && gradeMeta.defaultFontScale) || 1;
}

function applyWorksheetDefaultFontScale(item) {
  if (!item) return;
  const fontScaleSelect = document.getElementById('fontScale');
  const nextValue = String(getDefaultFontScale(item));
  if (fontScaleSelect.value === nextValue) return;
  fontScaleSelect.value = nextValue;
  const container = document.getElementById('sheets-container');
  container.style.setProperty('--font-scale', nextValue);
  container.style.setProperty('--pdf-scale', nextValue);
}

function getFitCacheKey(item, fontScale, generatorContext = {}) {
  let contextKey = '';
  if (isGugudanDanControlled(item)) {
    contextKey = `@dan-${(generatorContext.gugudanDans || selectedGugudanDans).join('-')}`;
  } else if (getNumberStageControl(item)) {
    contextKey = `@nstage-${generatorContext.numberStage ?? selectedNumberStage}`;
  } else if (getFractionStageControl(item)) {
    contextKey = `@fstage-${generatorContext.fractionStage ?? selectedFractionStage}`;
  }
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
      const isDecimalGrid = child.matches('.decimal-vertical-grid, .decimal-longdiv-grid, .decimal-natural-step');
      // 글자 크기 1.2배처럼 소수 픽셀이 생기면 scroll/client 높이가 반올림 때문에 2px 까지 어긋난다.
      // (예전에는 이 오차로 '크게'에서 세로셈 학습지가 1문항만 나왔음)
      const scrollOverflow = !isDecimalGrid && (child.scrollWidth > child.clientWidth + 2 || child.scrollHeight > child.clientHeight + 2);
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

function getColumnAttempts(item, count, fontScale = 1) {
  if (item.kind !== 'html') return [null];

  const config = getHtmlLayoutConfig(item, fontScale);
  if (!config) return [null];

  const attempts = [null];
  for (let maxCols = config.maxCols - 1; maxCols >= 1; maxCols--) {
    if (count > maxCols * config.maxRows) continue;
    attempts.push({ maxCols });
  }
  return attempts;
}

/* ── 문제 수 맞추기 ──
   문제마다 길이가 무작위라, 한 번만 재면 쪽마다·생성할 때마다 문항 수가 달라졌다 (2026-11-19 정비).
   1) 기준 문항 수: 여러 번 재서 가장 작은 값 (FIT_TRIALS) → 학습지·글자 크기·난이도별로 캐시
   2) 쪽마다 그 수로 맞을 때까지 문제만 다시 뽑기 (PAGE_RETRIES)
   3) 그래도 다른 쪽이 생기면 가장 작은 수로 모든 쪽을 맞춤
   4) layout.countMultiple (반반 섞기 등) 이 있으면 그 배수로 */
const FIT_TRIALS = 4;
const PAGE_RETRIES = 6;

function roundToCountMultiple(item, count) {
  const multiple = getCountMultiple(item);
  if (multiple <= 1 || count < multiple) return count;
  return count - (count % multiple);
}

function prepareMeasureHost(fontScale) {
  const host = getMeasureHost();
  host.style.setProperty('--font-scale', fontScale);
  host.style.setProperty('--pdf-scale', fontScale);
  return host;
}

function tryCreateAtCount(item, count, fontScale, generatorContext, retries = 1) {
  const host = prepareMeasureHost(fontScale);
  for (let attempt = 0; attempt < retries; attempt++) {
    for (const options of getColumnAttempts(item, count, fontScale)) {
      const sheet = createSheet(item, count, fontScale, {
        ...(options || {}),
        generatorContext,
      });
      host.appendChild(sheet);
      if (sheetFits(sheet)) return sheet;
      sheet.remove();
    }
  }
  return null;
}

function createFittedSheet(item, desiredCount, fontScale, generatorContext = {}) {
  const hardLimit = getWorksheetLimit(item, fontScale);
  const start = Math.min(hardLimit, Math.max(1, desiredCount || hardLimit));
  const multiple = getCountMultiple(item);

  for (let count = start; count >= 1; count--) {
    if (multiple > 1 && count >= multiple && count % multiple !== 0) continue;
    const sheet = tryCreateAtCount(item, count, fontScale, generatorContext, 1);
    if (sheet) return { sheet, count };
  }

  const host = prepareMeasureHost(fontScale);
  const fallback = createSheet(item, 1, fontScale, { generatorContext });
  host.appendChild(fallback);
  return { sheet: fallback, count: 1 };
}

function getSafeWorksheetLimit(item, fontScale, generatorContext = {}) {
  if (item.kind === 'diagnostic') return getWorksheetLimit(item);

  const key = getFitCacheKey(item, fontScale, generatorContext);
  if (fitCountCache.has(key)) return fitCountCache.get(key);

  let count = getWorksheetLimit(item, fontScale);
  for (let trial = 0; trial < FIT_TRIALS; trial++) {
    const fitted = createFittedSheet(item, count, fontScale, generatorContext);
    fitted.sheet.remove();
    count = fitted.count;
    if (count <= 1) break;
  }
  count = roundToCountMultiple(item, count);
  fitCountCache.set(key, count);
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
      createDiagnosticSheets(item, fontScale).forEach((sheet) => {
        container.appendChild(sheet);
        fitLevelDiagnosticBlocks(sheet);
      });
    }
    problemCountInput.value = '';
    problemCountInput.dataset.max = totalCount;
    problemCountInput.placeholder = totalCount;
    return;
  }

  const maxCount = getSafeWorksheetLimit(item, fontScale, generatorContext);
  const hasCustomCount = customCount > 0;
  const desiredCount = roundToCountMultiple(
    item,
    hasCustomCount ? Math.min(getWorksheetLimit(item, fontScale), customCount) : maxCount,
  );

  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    const sheet = tryCreateAtCount(item, desiredCount, fontScale, generatorContext, PAGE_RETRIES);
    if (sheet) pages.push({ sheet, count: desiredCount });
    else pages.push(createFittedSheet(item, Math.max(1, desiredCount - 1), fontScale, generatorContext));
  }

  // 쪽마다 문항 수가 같도록: 더 많은 쪽은 가장 작은 수로 다시 만든다.
  const fittedCount = Math.min(...pages.map((p) => p.count));
  pages.forEach((page, index) => {
    if (page.count === fittedCount) return;
    const redo = tryCreateAtCount(item, fittedCount, fontScale, generatorContext, PAGE_RETRIES);
    if (!redo) return;
    page.sheet.remove();
    pages[index] = { sheet: redo, count: fittedCount };
  });
  pages.forEach((page) => container.appendChild(page.sheet));

  if (!customCount || customCount > fittedCount) {
    problemCountInput.value = customCount > fittedCount ? fittedCount : '';
    problemCountInput.dataset.max = fittedCount;
    problemCountInput.placeholder = fittedCount;
  }
}

/* 수준 진단지: 2열로 넘치는 블록(대분수 답·개념 문제 등)은 1열 4줄로 바꾼다. */
function fitLevelDiagnosticBlocks(sheet) {
  if (!sheet.classList.contains('level-diagnostic-sheet')) return;
  sheet.querySelectorAll('.diagnostic-problems').forEach((grid) => {
    const overflow = Array.from(grid.querySelectorAll('.diagnostic-problem')).some((p) => (
      p.scrollWidth > p.clientWidth + 1
    ));
    if (overflow) grid.classList.add('single-col');
  });
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
  syncHash();
});

document.getElementById('unitSelect').addEventListener('change', (event) => {
  populateWorksheetSelect(currentGradeId(), event.target.value);
  syncHash();
});

document.getElementById('sectionFilter').addEventListener('click', (event) => {
  const button = event.target.closest('.stage-filter-button');
  if (!button || button.disabled) return;

  const nextFilter = button.dataset.sectionFilter;
  if (!SECTION_FILTERS.includes(nextFilter)) return;
  selectedSectionFilter = nextFilter;
  populateWorksheetSelect(currentGradeId(), getCurrentUnitId());
  syncHash();
  generate('replace');
});

document.getElementById('worksheetSelect').addEventListener('change', () => {
  const item = catalogMap[document.getElementById('worksheetSelect').value];
  applyWorksheetDefaults(item);
  syncHash();
});

document.getElementById('jumpButton').addEventListener('click', () => jumpTo(0));
document.getElementById('jumpSelect').addEventListener('change', (event) => {
  if (event.target.value === '') return;
  jumpTo(Number(event.target.value));
});

window.addEventListener('popstate', () => {
  const action = parseHash();
  if (action) navigateTo(action, { push: false });
});

document.getElementById('problemCount').addEventListener('input', sanitizeProblemCountInput);
document.getElementById('problemCount').addEventListener('keydown', handleProblemCountKeydown);

document.getElementById('gugudanDanControl').addEventListener('click', (event) => {
  const button = event.target.closest('.dan-button');
  if (!button) return;

  const dan = Number(button.dataset.dan);
  if (!Number.isInteger(dan) || dan < 2 || dan > 9) return;

  if (selectedGugudanDans.includes(dan)) {
    if (selectedGugudanDans.length === 1) return;
    selectedGugudanDans = selectedGugudanDans.filter((value) => value !== dan);
  } else {
    selectedGugudanDans = [...selectedGugudanDans, dan].sort((a, b) => a - b);
  }

  const item = catalogMap[document.getElementById('worksheetSelect').value];
  updateAllStageControls(item);
  updateSelectedMeta();
  if (isGugudanDanControlled(item)) generate('replace');
});

document.getElementById('numberStageControl').addEventListener('click', (event) => {
  const button = event.target.closest('.dan-button');
  if (!button || button.disabled) return;

  const stage = Number(button.dataset.numberStage);
  if (![1, 2, 3].includes(stage)) return;

  const item = catalogMap[document.getElementById('worksheetSelect').value];
  const meta = getNumberStageControl(item);
  if (!meta) return;
  const allowed = meta.stages || [1, 2, 3];
  if (!allowed.includes(stage)) return;

  selectedNumberStage = stage;
  updateAllStageControls(item);
  updateSelectedMeta();
  generate('replace');
});

document.getElementById('fractionStageControl').addEventListener('click', (event) => {
  const button = event.target.closest('.dan-button');
  if (!button || button.disabled) return;

  const stage = Number(button.dataset.fractionStage);
  if (![1, 2, 3].includes(stage)) return;

  const item = catalogMap[document.getElementById('worksheetSelect').value];
  const meta = getFractionStageControl(item);
  if (!meta) return;
  const allowed = meta.stages || [1, 2, 3];
  if (!allowed.includes(stage)) return;

  selectedFractionStage = stage;
  updateAllStageControls(item);
  updateSelectedMeta();
  generate('replace');
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
const initialAction = parseHash();
if (initialAction) {
  navigateTo(initialAction, { push: false });
} else {
  populateUnitSelect(DEFAULT_GRADE_ID);
  const firstUnitId = Object.keys(getUnitsOfGrade(DEFAULT_GRADE_ID))[0];
  populateWorksheetSelect(DEFAULT_GRADE_ID, firstUnitId);
  generate('replace');
}
