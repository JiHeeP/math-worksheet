#!/usr/bin/env node
/**
 * 단계 옵션이 있는 학습지에 대해 각 stage 별로 회귀 테스트.
 *
 * 사용:
 *   node .claude/scripts/validate-stages.mjs        # 기본 5,000회/스테이지
 *   node .claude/scripts/validate-stages.mjs 1000   # 1,000회/스테이지
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const catalogPath = path.join(projectRoot, 'app', 'js', 'catalog.js');

const ITERATIONS = Number(process.argv[2]) || 5000;

const m = await import(`file://${catalogPath}`);

function parseAnsAttrs(html) {
  if (typeof html !== 'string') return [];
  return [...html.matchAll(/data-ans="([^"]*)"/g)].map((mm) => mm[1]);
}
function collectHtml(p) {
  if (!p) return '';
  if (typeof p === 'string') return p;
  let html = '';
  if (p.html) html += p.html;
  if (p.lines) html += Object.values(p.lines).join('\n');
  return html;
}

const PROBLEMATIC = [];
const ALLOW = new Set(['', '없음', '<', '>', '=', 'cm', 'm', 'km', 'km²', 'cm²', 'm²']);

let testedItems = 0;
let totalCases = 0;

for (const item of m.WORKSHEET_CATALOG) {
  if (item.kind === 'diagnostic') continue;
  if (!item.controls) continue;

  const unitMeta = m.getUnitMeta(item.grade, item.unit);
  const allowsDecimal = [item.label, unitMeta && unitMeta.name]
    .filter(Boolean)
    .some((text) => text.includes('소수'));

  let stageKey = null;
  let stages = null;
  if (item.controls.numberDifficulty) {
    stageKey = 'numberStage';
    stages = item.controls.numberDifficulty.stages || [1, 2, 3];
  } else if (item.controls.fractionDifficulty) {
    stageKey = 'fractionStage';
    stages = item.controls.fractionDifficulty.stages || [1, 2, 3];
  } else {
    continue;
  }

  testedItems++;

  for (const stage of stages) {
    for (let i = 0; i < ITERATIONS; i++) {
      let p;
      try {
        p = item.generator({ [stageKey]: stage });
      } catch (e) {
        PROBLEMATIC.push({ id: item.id, stage, type: 'CRASH', detail: e.message });
        break;
      }
      const html = collectHtml(p);
      const answers = parseAnsAttrs(html);
      for (const ans of answers) {
        const tr = ans.trim();
        if (ALLOW.has(tr)) continue;
        const tokens = tr.split(/[,\s]+/).filter(Boolean);
        for (const tok of tokens) {
          if (tok.startsWith('-')) {
            PROBLEMATIC.push({ id: item.id, stage, type: 'NEG', detail: `ans="${ans}" tok="${tok}"` });
            break;
          }
          if (!allowsDecimal && /^[0-9]+\.[0-9]+$/.test(tok)) {
            PROBLEMATIC.push({ id: item.id, stage, type: 'DEC', detail: `ans="${ans}" tok="${tok}"` });
            break;
          }
        }
      }
      totalCases++;
    }
  }
}

const grouped = {};
for (const issue of PROBLEMATIC) {
  const key = `${issue.id}@stage${issue.stage}::${issue.type}`;
  (grouped[key] ||= []).push(issue.detail);
}
for (const [key, details] of Object.entries(grouped)) {
  console.log(`\n=== ${key} (${details.length}) ===`);
  console.log(details.slice(0, 3).join('\n'));
}

console.log(`\n테스트한 학습지: ${testedItems}`);
console.log(`총 실행: ${totalCases}`);
console.log(`문제 발견 학습지 수: ${new Set(PROBLEMATIC.map((p) => `${p.id}@${p.stage}`)).size}`);
console.log(`총 위반 사례: ${PROBLEMATIC.length}`);

process.exit(PROBLEMATIC.length > 0 ? 1 : 0);
