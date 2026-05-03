#!/usr/bin/env node
/**
 * 회귀 테스트: 모든 학습지 generator 를 N회 실행 후
 * data-ans 속성을 파싱해 음수/소수 결과 발생 여부 검사.
 *
 * 사용:
 *   node .claude/scripts/validate.mjs           # 기본 5,000회
 *   node .claude/scripts/validate.mjs 1000      # 1,000회
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

for (const item of m.WORKSHEET_CATALOG) {
  for (let i = 0; i < ITERATIONS; i++) {
    let p;
    try {
      p = item.generator();
    } catch (e) {
      PROBLEMATIC.push({ id: item.id, type: 'CRASH', detail: e.message });
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
          PROBLEMATIC.push({ id: item.id, type: 'NEG', detail: `ans="${ans}" tok="${tok}"` });
          break;
        }
        if (/^[0-9]+\.[0-9]+$/.test(tok)) {
          PROBLEMATIC.push({ id: item.id, type: 'DEC', detail: `ans="${ans}" tok="${tok}"` });
          break;
        }
      }
    }
  }
}

const grouped = {};
for (const issue of PROBLEMATIC) {
  const key = `${issue.id}::${issue.type}`;
  (grouped[key] ||= []).push(issue.detail);
}
for (const [key, details] of Object.entries(grouped)) {
  console.log(`\n=== ${key} (${details.length}) ===`);
  console.log(details.slice(0, 3).join('\n'));
}

console.log(`\n총 학습지: ${m.WORKSHEET_CATALOG.length}`);
console.log(`문제 발견 학습지 수: ${new Set(PROBLEMATIC.map((p) => p.id)).size}`);
console.log(`총 위반 사례: ${PROBLEMATIC.length}`);

process.exit(PROBLEMATIC.length > 0 ? 1 : 0);
