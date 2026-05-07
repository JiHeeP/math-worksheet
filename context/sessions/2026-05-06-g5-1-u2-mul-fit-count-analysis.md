# 분석 기록: 5-1 2단원 곱셈구구 적정 문제 수 1개 문제

- **일시**: 2026-05-06
- **요구사항 원문**: 왜 5-1-2 곱셈구구의 경우에 저 광활한 페이지에 적정 문제수가 1개냐
- **판정**: ✅ 안전하게 수정 가능

## 현상

5학년 1학기 2단원 `곱셈구구` 학습지를 선택하면 문제 수 placeholder와 `data-max`가 `1`로 잡힌다.

브라우저에서 재현한 값:

| 항목 | 값 |
|---|---:|
| 선택 학습지 | `g5-1_u2_pre_mul` |
| 원래 catalog count | 36 |
| grid | `dense` |
| 이론상 hard limit | 36문항 |
| 실제 자동 맞춤 결과 | 1문항 |

## 원인

문제 생성기 자체는 정상이다.

```js
export function genU2PreMul() {
  const a = rand(2, 9), b = rand(1, 9);
  return horizProblem(`${a} × ${b}`, numBlank(a * b));
}
```

문제는 `app/js/app.js`의 자동 맞춤 판정 함수 `hasWrappedHorizontalProblem()`이다.

현재 로직은 `.horiz-box`의 높이가 아래 기준을 넘으면 줄바꿈/넘침으로 판단한다.

```js
const oneLineLimit = Math.max(fontSize * 1.45, fontSize + 10);
return widthOverflow || rect.height > oneLineLimit;
```

그런데 `곱셈구구`는 한 줄 식이지만 답칸이 `numBlank()`라서 높이가 글자보다 크다.

관련 CSS:

```css
:root { --write-box-size: 1.85em; }

.num-blank {
  min-height: var(--write-box-size);
}
```

실제 브라우저 측정값:

| 측정 항목 | 값 |
|---|---:|
| `.horiz-box` font-size | 12.8px |
| 현재 one-line 기준 | 22.8px |
| 실제 한 줄 문제 높이 | 23.67px |
| 결과 | 한 줄인데 wrapped로 오판 |

즉, 한 줄 문제인데 답칸 높이 때문에 `0.87px` 정도 기준을 넘고, 자동 맞춤은 36문항부터 1문항까지 모두 “안 들어감”으로 판단한다. 마지막 fallback이 1문항을 반환해서 “광활한 페이지에 1개”가 된다.

글자 크기를 `작게/보통/크게`로 바꿔도 같은 로직 때문에 계속 1개로 잡힌다.

## 영향 범위

| 대상 | 영향 수준 | 상세 |
|---|---:|---|
| `app/js/app.js` | 중간 | 자동 맞춤 판정만 수정하면 된다. 생성기와 catalog는 건드릴 필요가 없다. |
| `app/css/worksheet.css` | 낮음 | CSS 수정 없이 JS 판정 기준 수정으로 해결 가능하다. 필요 시 보조 조정만 한다. |
| `app/js/layout.js` | 낮음 | `dense` hard limit 36은 정상이다. |
| `app/js/generators/g5-1/u2.js` | 없음 | `genU2PreMul()`은 정상이다. |

## 점검 결과

| 점검 항목 | 결과 | 근거 |
|---|---|---|
| 기존 약속 | ✅ | generator/catalog 구조 변경 없이 자동 맞춤 판정만 고치면 된다. |
| 연결 관계 | ✅ | UI fit 측정 로직 내부 수정이다. 데이터 계층 영향 없음. |
| 데이터 모양 | ✅ | 학습지 ID, count, grid, generator 반환 형태 변경 없음. |
| 과거 기록 | ✅ | 기존 학습지의 의미나 출처 정보 변경 없음. |
| 사용자 흐름 | ⚠️ | 자동 맞춤 판정은 여러 가로식 학습지에 영향을 줄 수 있으므로 대표 학습지를 함께 확인해야 한다. |
| 되돌리기 어려움 | ✅ | 작은 JS 조건 수정이며 배포/의존성/파일 이동 없음. |

## 안전한 수정 방향

`hasWrappedHorizontalProblem()`이 글자 크기만 보지 말고, 답칸 같은 실제 자식 요소 높이를 함께 고려해야 한다.

권장 방식:

1. `.horiz-box` 내부 자식 요소들의 실제 높이를 측정한다.
2. `oneLineLimit`을 `fontSize 기준`과 `가장 큰 자식 요소 높이 + 여유값` 중 큰 값으로 잡는다.
3. 실제 줄바꿈은 width overflow 또는 높이가 그 기준을 충분히 넘을 때만 판정한다.

예상 수정 방향:

```js
const childHeights = Array.from(box.children)
  .map((child) => child.getBoundingClientRect().height)
  .filter(Boolean);
const childLimit = Math.max(...childHeights, 0) + 4;
const oneLineLimit = Math.max(fontSize * 1.55, fontSize + 12, childLimit);
```

이렇게 하면 답칸 때문에 높은 “정상 한 줄”은 통과하고, 실제 여러 줄로 꺾인 문제는 계속 잡을 수 있다.

## 기술 요구사항

| 순서 | 작업 유형 | 대상 | 설명 | 의존 순서 |
|---:|---|---|---|---|
| 1 | BUG_FIX | `app/js/app.js` | `hasWrappedHorizontalProblem()`의 한 줄 높이 판정 기준을 실제 답칸 높이까지 고려하도록 수정 | — |
| 2 | TEST | 브라우저 | 5-1 2단원 `곱셈구구`가 36문항으로 잡히는지 확인 | 1 |
| 3 | TEST | 브라우저 | 같은 단원 `나눗셈 (한 자리 나누기)`도 36문항으로 잡히는지 확인 | 1 |
| 4 | TEST | 브라우저 | 가로식/분수 대표 학습지에서 overflow 오판이 생기지 않는지 확인 | 1 |
| 5 | TEST | 스크립트 | `node .claude/scripts/validate.mjs 1000`, `node .claude/scripts/audit.mjs` 실행 | 1 |
| 6 | DOC_CHANGE | `CHANGELOG.md` | 자동 맞춤 판정 수정 기록 | 1-5 |

## 검증 계획

명령:

```bash
node .claude/scripts/validate.mjs 1000
node .claude/scripts/audit.mjs
python3 -m http.server 8000 --directory app
```

브라우저 확인:

- 5-1 2단원 `곱셈구구`: 문제 수 placeholder 36, 한 장 36문항, overflow 0건
- 5-1 2단원 `나눗셈 (한 자리 나누기)`: 문제 수 placeholder 36, 한 장 36문항, overflow 0건
- 5-1 2단원 `선수학습 진단지`: 기존 8문항/1장 유지
- 대표 가로식 학습지에서 실제 줄바꿈 감지는 유지

