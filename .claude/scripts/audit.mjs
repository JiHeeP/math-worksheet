#!/usr/bin/env node
/**
 * 카탈로그 정합성 종합 점검.
 *
 * 검사 항목
 *  1) 깨진 prereq refs (resolvePrereq 가 [?] 로 시작하는 경우)
 *  2) ext → unitRef 승격 후보 (대상 학기가 이제 구현됨)
 *  3) 같은 학기 안 단원 ID 중복
 *  4) 본단원에 등록 안 된 선수학습 generator (문서적 갭)
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

/* ── 4. 선수학습 generator 가 본단원으로도 등록되어 있나 ── */
// 제너레이터 함수 객체 (참조 동일성) 로 비교
const genToMain = new Map(); // gen function → list of main 학습지 ID
for (const it of allItems.filter((x) => x.section === '본단원')) {
  if (!genToMain.has(it.generator)) genToMain.set(it.generator, []);
  genToMain.get(it.generator).push(it.id);
}

const orphanPrereqs = [];
for (const it of allItems.filter((x) => x.section === '선수학습')) {
  const mainPlaces = genToMain.get(it.generator) || [];
  // from 학기에 본단원으로 등록되어 있는지
  const fromGrade = it.from || it.grade;
  const inSourceGrade = mainPlaces.some((mid) => m.catalogMap[mid].grade === fromGrade);
  if (!inSourceGrade) {
    orphanPrereqs.push({
      id: it.id,
      label: it.label,
      from: fromGrade,
      mainPlaces: mainPlaces.length === 0 ? '(없음)' : mainPlaces.join(', '),
    });
  }
}
console.log(
  `\n### 4. 선수학습이지만 from 학기 본단원에 미등록: ${orphanPrereqs.length}건`
);
orphanPrereqs.slice(0, 15).forEach((o) =>
  console.log(`  - ${o.id} (${o.label}) → from=${o.from}, 본단원: ${o.mainPlaces}`)
);

/* ── 종합 ── */
const totalIssues = broken.length + extPromotion.length + dupUnits.length + orphanPrereqs.length;
console.log(`\n---\n총 점검 항목: ${totalIssues}건 (broken=${broken.length}, ext_promo=${extPromotion.length}, dup=${dupUnits.length}, orphan=${orphanPrereqs.length})`);

process.exit(broken.length + dupUnits.length > 0 ? 1 : 0);
