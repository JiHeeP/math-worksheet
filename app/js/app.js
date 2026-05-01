'use strict';

import {
  GRADE_META, DEFAULT_GRADE_ID,
  catalogMap, getUnitsOfGrade, getUnitMeta, getWorksheetsByUnit,
  resolvePrereq,
} from './catalog.js';
import { createSheet, getWorksheetLimit } from './renderers.js';

let answerShown = false;

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

function updateSelectedMeta() {
  const item = catalogMap[document.getElementById('worksheetSelect').value];
  if (!item) return;
  const section = document.getElementById('selectedSection');
  const lesson = document.getElementById('selectedLesson');
  const countInput = document.getElementById('problemCount');
  const limit = getWorksheetLimit(item);
  const defaultCount = Math.min(item.count, limit);
  const unitMeta = getUnitMeta(item.grade, item.unit);
  const unitShort = unitMeta ? unitMeta.short : item.unit;
  section.textContent = `${unitShort} · ${item.section}`;
  lesson.textContent = `교과 차시: ${item.lessonRef}`;
  countInput.placeholder = defaultCount;
  countInput.max = limit;
  if (countInput.value) {
    countInput.value = Math.min(parseInt(countInput.value, 10) || defaultCount, limit);
  }
  renderPrereqs(item);
}

function renderPrereqs(item) {
  const panel = document.getElementById('prereqPanel');
  panel.innerHTML = '';
  if (!item.prereqs || item.prereqs.length === 0) {
    panel.hidden = true;
    return;
  }

  const label = document.createElement('span');
  label.className = 'prereq-label';
  label.textContent = '선수학습';
  panel.appendChild(label);

  for (const p of item.prereqs) {
    const r = resolvePrereq(p, item.grade);
    if (r.action) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'prereq-chip clickable';
      btn.textContent = r.label;
      btn.addEventListener('click', () => navigateToPrereq(r.action));
      panel.appendChild(btn);
    } else {
      const span = document.createElement('span');
      span.className = 'prereq-chip external';
      span.textContent = r.label;
      panel.appendChild(span);
    }
  }
  panel.hidden = false;
}

function navigateToPrereq(action) {
  const gradeSelect = document.getElementById('gradeSelect');
  const unitSelect = document.getElementById('unitSelect');

  if (gradeSelect.value !== action.grade) {
    gradeSelect.value = action.grade;
    populateUnitSelect(action.grade);
  }
  unitSelect.value = action.unit;
  populateWorksheetSelect(action.grade, action.unit, action.sheet);
  generate('replace');
}

function populateWorksheetSelect(gradeId, unitId, preferredId) {
  const worksheetSelect = document.getElementById('worksheetSelect');
  const items = getWorksheetsByUnit(gradeId, unitId);
  worksheetSelect.innerHTML = items.map((item) =>
    `<option value="${item.id}">[${item.section}] ${item.label}</option>`
  ).join('');

  const nextId = preferredId && items.some((item) => item.id === preferredId) ? preferredId : (items[0] && items[0].id);
  if (nextId) {
    worksheetSelect.value = nextId;
    updateSelectedMeta();
  }
}

function currentGradeId() {
  return document.getElementById('gradeSelect').value;
}

function generate(mode) {
  const container = document.getElementById('sheets-container');
  const problemCountInput = document.getElementById('problemCount');
  const worksheetId = document.getElementById('worksheetSelect').value;
  const pageCount = Math.min(20, Math.max(1, parseInt(document.getElementById('pageCount').value, 10) || 1));
  const item = catalogMap[worksheetId];
  if (!item) return;

  const customCount = parseInt(problemCountInput.value, 10);
  const maxCount = getWorksheetLimit(item);
  const defaultCount = Math.min(item.count, maxCount);
  const effectiveCount = (customCount > 0) ? Math.min(maxCount, customCount) : defaultCount;

  if (customCount > maxCount) {
    problemCountInput.value = effectiveCount;
  }

  const fontScale = document.getElementById('fontScale').value;
  container.style.setProperty('--font-scale', fontScale);
  container.style.setProperty('--pdf-scale', fontScale);

  if (mode === 'replace') container.innerHTML = '';
  container.classList.remove('answers-shown');
  answerShown = false;

  for (let i = 0; i < pageCount; i++) {
    container.appendChild(createSheet(item, effectiveCount, parseFloat(fontScale)));
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

document.getElementById('worksheetSelect').addEventListener('change', () => {
  updateSelectedMeta();
});

document.getElementById('fontScale').addEventListener('change', () => {
  const container = document.getElementById('sheets-container');
  const scale = document.getElementById('fontScale').value;
  container.style.setProperty('--font-scale', scale);
  container.style.setProperty('--pdf-scale', scale);
});

window.generate = generate;
window.toggleAnswers = toggleAnswers;

/* ── 초기화 ── */

populateGradeSelect();
populateUnitSelect(DEFAULT_GRADE_ID);
const firstUnitId = Object.keys(getUnitsOfGrade(DEFAULT_GRADE_ID))[0];
populateWorksheetSelect(DEFAULT_GRADE_ID, firstUnitId);
generate('replace');
