'use strict';

import { UNIT_META, catalogMap, getWorksheetsByUnit } from './catalog.js';
import { createSheet, getWorksheetLimit } from './renderers.js';

let answerShown = false;

function populateUnitSelect() {
  const unitSelect = document.getElementById('unitSelect');
  unitSelect.innerHTML = Object.entries(UNIT_META)
    .map(([id, meta]) => `<option value="${id}">${meta.short}: ${meta.name}</option>`)
    .join('');
}

function updateSelectedMeta() {
  const item = catalogMap[document.getElementById('worksheetSelect').value];
  const section = document.getElementById('selectedSection');
  const lesson = document.getElementById('selectedLesson');
  const countInput = document.getElementById('problemCount');
  const limit = getWorksheetLimit(item);
  const defaultCount = Math.min(item.count, limit);
  section.textContent = `${UNIT_META[item.unit].short} \u00b7 ${item.section}`;
  lesson.textContent = `교과 차시: ${item.lessonRef}`;
  countInput.placeholder = defaultCount;
  countInput.max = limit;
  if (countInput.value) {
    countInput.value = Math.min(parseInt(countInput.value, 10) || defaultCount, limit);
  }
}

function populateWorksheetSelect(unitId, preferredId) {
  const worksheetSelect = document.getElementById('worksheetSelect');
  const items = getWorksheetsByUnit(unitId);
  worksheetSelect.innerHTML = items.map((item) =>
    `<option value="${item.id}">[${item.section}] ${item.label}</option>`
  ).join('');

  const nextId = preferredId && items.some((item) => item.id === preferredId) ? preferredId : items[0].id;
  worksheetSelect.value = nextId;
  updateSelectedMeta();
}

function generate(mode) {
  const container = document.getElementById('sheets-container');
  const problemCountInput = document.getElementById('problemCount');
  const worksheetId = document.getElementById('worksheetSelect').value;
  const pageCount = Math.min(20, Math.max(1, parseInt(document.getElementById('pageCount').value, 10) || 1));
  const item = catalogMap[worksheetId];

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

document.getElementById('unitSelect').addEventListener('change', (event) => {
  populateWorksheetSelect(event.target.value);
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

// 버튼 이벤트를 전역에 노출 (HTML onclick 사용)
window.generate = generate;
window.toggleAnswers = toggleAnswers;

/* ── 초기화 ── */

populateUnitSelect();
populateWorksheetSelect('u1');
generate('replace');
