'use strict';

import { rand, randChoice } from '../../utils.js';
import { numBlank, textBlank, relationTableHtml } from '../../helpers.js';
import { conceptProblem, relationProblem } from '../../templates.js';

const RELATION_SCENARIOS = [
  { subject: '로봇', target: '바퀴', xLabel: '로봇 수', yLabel: '바퀴 수', factor: 4, unitA: '대', unitB: '개' },
  { subject: '의자', target: '팔걸이', xLabel: '의자 수', yLabel: '팔걸이 수', factor: 2, unitA: '개', unitB: '개' },
  { subject: '드론', target: '날개', xLabel: '드론 수', yLabel: '날개 수', factor: 4, unitA: '대', unitB: '개' },
  { subject: '쟁반', target: '컵', xLabel: '쟁반 수', yLabel: '컵 수', factor: 3, unitA: '개', unitB: '개' },
];

export function genU3MainRelationFind1() {
  const s = randChoice(RELATION_SCENARIOS), x = rand(2, 8), y = x * s.factor;
  return conceptProblem(`한 ${s.subject}에 ${s.target}가 ${s.factor}${s.unitB}씩 있습니다.<br>${s.subject} ${x}${s.unitA}의 ${s.target} 수는?`, numBlank(y, s.unitB));
}

export function genU3MainRelationFind2() {
  const s = randChoice(RELATION_SCENARIOS), x = rand(2, 8), y = x * s.factor;
  return conceptProblem(`한 ${s.subject}에 ${s.target}가 ${s.factor}${s.unitB}씩 있습니다.<br>${s.target}가 ${y}${s.unitB}라면 ${s.subject} 수는?`, numBlank(x, s.unitA));
}

export function genU3MainRelationTable() {
  const s = randChoice(RELATION_SCENARIOS), xs = [1, 2, 3, 4], bi = rand(1, 3);
  const ys = xs.map((x, i) => i === bi ? numBlank(x * s.factor) : `${x * s.factor}`);
  return relationProblem(`${s.subject} 수와 ${s.target} 수의 관계표를 완성해 보세요.`, relationTableHtml(s.xLabel, s.yLabel, xs, ys), '', `한 ${s.subject}에 ${s.target} ${s.factor}${s.unitB}씩입니다.`);
}

export function genU3MainRelationFormula() {
  const s = randChoice(RELATION_SCENARIOS);
  return conceptProblem(`${s.subject} 수를 □, ${s.target} 수를 △라고 할 때 식을 완성해 보세요.<br>△ = □ \u00d7 ${numBlank(s.factor)}`, textBlank(`${s.target} 수 = ${s.subject} 수 \u00d7 ${s.factor}`, 170), '아래 문장은 정답 확인용입니다.');
}

export function genU3MainRelationReal() {
  const s = randChoice(RELATION_SCENARIOS), xs = [2, 4, 6], ys = xs.map(x => x * s.factor);
  return relationProblem(`생활 속 대응 관계를 보고 빈칸을 채워 보세요.`, relationTableHtml(s.xLabel, s.yLabel, xs, [ys[0], ys[1], numBlank(ys[2])]), textBlank(`${s.yLabel} = ${s.xLabel} \u00d7 ${s.factor}`, 180));
}
