#!/usr/bin/env node
/**
 * 카탈로그 정합성 종합 점검.
 *
 * 검사 항목
 *  1) 깨진 prereq refs (resolvePrereq 가 [?] 로 시작하는 경우)
 *  2) ext → unitRef 승격 후보 (대상 학기가 이제 구현됨)
 *  3) 같은 학기 안 단원 ID 중복
 *  4) 선수학습 복제본의 원본(source) 연결
 *  5) 배치 프리셋(layout) 값
 *  6) 수준(level)·수준 진단지
 *
 * 사용:
 *   node .claude/scripts/audit.mjs
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const catalogPath = path.join(projectRoot, 'app', 'js', 'catalog.js');

const m = await import(`file://${catalogPath}`);

const allItems = m.WORKSHEET_CATALOG;
const grades = Object.keys(m.GRADE_META);

console.log(`\n## 카탈로그 정합성 점검\n`);
console.log(`총 학습지: ${allItems.length}개`);
console.log(`구현 학기: ${grades.join(', ')}\n`);

/* ── 1. 깨진 prereq refs ── */
const broken = [];
for (const it of allItems) {
  if (!it.prereqs) continue;
  for (const p of it.prereqs) {
    const r = m.resolvePrereq(p, it.grade);
    if (r.label.startsWith('[?]')) {
      broken.push({ id: it.id, prereq: JSON.stringify(p), label: r.label });
    }
  }
}
console.log(`### 1. 깨진 prereq refs: ${broken.length}건`);
broken.slice(0, 10).forEach((b) => console.log(`  - ${b.id} → ${b.label}`));

/* ── 2. ext → unitRef 승격 후보 ── */
const extPromotion = [];
for (const it of allItems) {
  if (!it.prereqs) continue;
  for (const p of it.prereqs) {
    if (p.kind !== 'ext') continue;
    const match = /^\[(\d-\d)\]\s*(.+)/.exec(p.label);
    if (!match) continue;
    const [, gradeShort, restLabel] = match;
    const targetGrade = `g${gradeShort}`;
    if (!grades.includes(targetGrade)) continue;
    // target grade 의 단원 중 라벨 부분 일치 단원 추정
    const gradeMeta = m.GRADE_META[targetGrade];
    const matchedUnit = Object.entries(gradeMeta.units).find(
      ([, u]) => restLabel.includes(u.name) || u.name.includes(restLabel.split(' ')[0])
    );
    if (matchedUnit) {
      extPromotion.push({
        id: it.id,
        currentLabel: p.label,
        suggested: `unitRef('${targetGrade}', '${matchedUnit[0]}')`,
      });
    }
  }
}
console.log(`\n### 2. ext → unitRef 승격 후보: ${extPromotion.length}건`);
extPromotion.slice(0, 10).forEach((e) =>
  console.log(`  - ${e.id} | ${e.currentLabel} → ${e.suggested}`)
);

/* ── 3. 같은 학기 단원 ID 중복 ── */
const dupUnits = [];
for (const grade of grades) {
  const seen = new Set();
  for (const it of allItems.filter((x) => x.grade === grade)) {
    const key = `${grade}::${it.unit}::${it.label}`;
    if (seen.has(key)) dupUnits.push(key);
    seen.add(key);
  }
}
console.log(`\n### 3. 학기·단원 안에서 학습지 라벨 중복: ${dupUnits.length}건`);
dupUnits.forEach((d) => console.log(`  - ${d}`));

/* ── 4. 선수학습 복제본 → 원본 연결 (source) ──
   선수학습 항목은 source: sheetRef('g{학기}', '원본ID') 로 원래 학년 학습지를 가리켜야 한다.
   (화면의 "원래 학습지로" 이동 버튼이 이 값을 쓴다.) */
const orphanPrereqs = [];
for (const it of allItems.filter((x) => x.section === '선수학습')) {
  if (!it.source) {
    orphanPrereqs.push({ id: it.id, label: it.label, reason: 'source 없음' });
    continue;
  }
  const r = m.resolvePrereq(it.source, it.grade);
  if (!r.action || !r.action.sheet) {
    orphanPrereqs.push({ id: it.id, label: it.label, reason: `깨진 source ${JSON.stringify(it.source)}` });
  } else if (it.from && r.action.grade !== it.from) {
    orphanPrereqs.push({ id: it.id, label: it.label, reason: `from=${it.from} 인데 source 학기=${r.action.grade}` });
  }
}
console.log(`\n### 4. 선수학습 원본(source) 연결 문제: ${orphanPrereqs.length}건`);
orphanPrereqs.slice(0, 15).forEach((o) => console.log(`  - ${o.id} (${o.label}) → ${o.reason}`));

/* ── 5. 배치 프리셋 (layout) 값 ── */
const L = await import(`file://${path.join(projectRoot, 'app', 'js', 'layout.js')}`);
const badLayouts = [];
for (const it of allItems) {
  const spec = L.getLayoutSpec(it);
  if (!spec) continue;
  if (!L.LAYOUT_PRESETS.includes(spec.preset) && spec.preset !== undefined) badLayouts.push(`${it.id} → ${spec.preset}`);
  if (spec.preset === 'oneColRows' && !(spec.rows > 0)) badLayouts.push(`${it.id} → oneColRows 에 rows 없음`);
  if (spec.countMultiple && !(Number.isInteger(spec.countMultiple) && spec.countMultiple > 1)) badLayouts.push(`${it.id} → countMultiple=${spec.countMultiple}`);
}
console.log(`\n### 5. 잘못된 배치 프리셋: ${badLayouts.length}건`);
badLayouts.forEach((b) => console.log(`  - ${b}`));

/* ── 6. 수준(level) 값 ── */
const badLevels = [];
for (const it of allItems) {
  if (it.level === null || it.level === undefined) continue;
  if (![0, 1, 2].includes(it.level)) badLevels.push(`${it.id} → level=${it.level}`);
  else if (it.level === 0 && it.section !== '선수학습') badLevels.push(`${it.id} → level 0 은 선수학습만`);
  else if (it.level > 0 && it.section !== '본단원') badLevels.push(`${it.id} → level ${it.level} 은 본단원만`);
}
for (const it of allItems.filter((x) => x.kind === 'diagnostic' && x.diagnosticFrom === 'level')) {
  const lv = new Set((it.sourceIds || []).map((id) => m.catalogMap[id] && m.catalogMap[id].level));
  if (!(it.sourceIds || []).length) badLevels.push(`${it.id} → 수준 진단지에 학습지 없음`);
  if (![...lv].some((v) => v > 0)) badLevels.push(`${it.id} → 수준 진단지에 본단원(1·2) 블록 없음`);
}
console.log(`\n### 6. 수준(level)·수준 진단지 문제: ${badLevels.length}건`);
badLevels.forEach((b) => console.log(`  - ${b}`));

/* ── 종합 ── */
const totalIssues = broken.length + extPromotion.length + dupUnits.length + orphanPrereqs.length + badLayouts.length + badLevels.length;
console.log(`\n---\n총 점검 항목: ${totalIssues}건 (broken=${broken.length}, ext_promo=${extPromotion.length}, dup=${dupUnits.length}, orphan=${orphanPrereqs.length}, layout=${badLayouts.length}, level=${badLevels.length})`);

process.exit(broken.length + dupUnits.length + orphanPrereqs.length + badLayouts.length + badLevels.length > 0 ? 1 : 0);
