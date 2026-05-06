# 분석 기록: 곱셈구구 단 선택 컨트롤 추가 계획

- **일시**: 2026-05-07
- **요구사항 원문**: `'곱셈구구'인 경우, 단 선택 버튼을 '인쇄' 옆에 생기게 한다. 2단부터 9단까지 원하는 단을 선택케 한다. 구현 계획`
- **판정**: ✅ 안전하게 진행 가능

## 요구사항 해석

- 학습지 선택이 곱셈구구일 때만 컨트롤바의 `인쇄` 버튼 옆에 2단~9단 선택 UI를 표시한다.
- 사용자가 원하는 단을 고르면 해당 단으로만 곱셈구구 문제가 생성된다.
- 곱셈구구가 아닌 학습지를 선택하면 단 선택 UI는 숨긴다.
- 사용자 흐름은 `단 선택 → 새로 만들기/이어 붙이기/인쇄`가 자연스럽게 이어져야 한다.

## 현재 상태

### 1. 컨트롤바 구조

`app/worksheet.html`의 버튼 순서:

1. `새로 만들기`
2. `이어 붙이기`
3. `정답 보기`
4. `인쇄`

요구사항의 “인쇄 옆”은 `인쇄` 버튼 바로 앞 또는 바로 뒤에 단 선택 컨트롤을 추가하는 것으로 해석할 수 있다. 화면 흐름상 `인쇄` 바로 앞에 두면 선택 후 인쇄하기가 자연스럽다.

### 2. 곱셈구구 generator 구조

5-1 선수학습 `곱셈구구`:

```js
export function genU2PreMul() {
  const a = rand(2, 9), b = rand(1, 9);
  return horizProblem(`${a} × ${b}`, numBlank(a * b));
}
```

2-2 본단원에는 이미 단별 generator factory가 있다.

```js
export function makeGugudanGen(dan) {
  return function genGugudanFixed() {
    const m = rand(1, 9);
    return horizProblem(`${dan} × ${m}`, numBlank(dan * m));
  };
}
```

즉 기존 수학 로직은 단 선택을 받도록 확장하기 쉽다.

### 3. 현재 워킹트리 주의사항

현재 `main`에는 아직 커밋되지 않은 자동 문제 수 보정 변경이 있다.

- `app/js/app.js`
- `app/worksheet.html`
- `CHANGELOG.md`

단 선택 컨트롤 구현은 이 변경 위에 얹어야 하며, 기존 수정 내용을 되돌리면 안 된다.

## 권장 설계

### 1. 카탈로그에 “단 선택 가능” 메타 추가

학습지 정의에 UI 제어용 메타를 넣는다.

예:

```js
학습지('곱셈구구', genU2PreMul, {
  id: 'u2_pre_mul',
  from: 'g2-2',
  controls: { gugudanDan: true },
})
```

확장 후보:

- `g5-1_u2_pre_mul` — 5-1 선수학습 곱셈구구
- `g2-2_u2_main_gugudan_basic` — 2-2 곱셈구구 기본
- `g2-2_u2_main_gugudan_mix` — 2-2 곱셈구구 혼합

이미 `2단`, `3단`처럼 단별로 분리된 학습지는 선택 UI가 없어도 되지만, 붙여도 동작은 가능하다. 우선은 혼합형/기본형에만 붙이는 것이 깔끔하다.

### 2. 컨트롤바에 단 선택 UI 추가

`app/worksheet.html`의 `인쇄` 버튼 옆에 단 선택 그룹을 추가한다.

권장 형태:

```html
<div class="input-group dan-control" id="gugudanDanControl" hidden>
  <label>단</label>
  <div class="segmented-control">
    <button type="button" data-dan="2">2단</button>
    ...
    <button type="button" data-dan="9">9단</button>
  </div>
</div>
```

UI 의도:

- 곱셈구구 선택 시에만 표시
- 기본값은 `2단` 또는 `혼합`
- 사용자 요구가 “2단부터 9단까지 원하는 단”이므로 일단 `2단`~`9단`만 제공

주의:

- 컨트롤바 아래에 별도 칩 패널을 만들지 않는다.
- 기존 출처 정보 표시 규칙과 무관하게 동작한다.

### 3. 앱 상태로 선택 단 관리

`app/js/app.js`에 상태를 둔다.

```js
let selectedGugudanDan = 2;
```

필요 함수:

- `isGugudanDanControlled(item)`
- `updateGugudanDanControl(item)`
- `getCurrentGeneratorContext(item)`

학습지 변경 시:

1. 선택한 학습지가 `controls.gugudanDan`이면 단 선택 UI 표시
2. 아니면 숨김
3. 단 버튼 클릭 시 `selectedGugudanDan` 갱신
4. 현재 학습지를 다시 생성하거나, 최소한 다음 `새로 만들기`부터 반영

권장은 버튼 클릭 즉시 `generate('replace')`를 호출하는 것이다. 사용자는 “2단 눌렀는데 바로 바뀐다”고 기대할 가능성이 높다.

### 4. generator에 UI 상태를 직접 import하지 않고 옵션으로 전달

현재 `renderers.js`는 `item.generator()`를 직접 호출한다.

이를 아래처럼 확장한다.

```js
function runGenerator(item, options) {
  return item.generator(options.generatorContext || {});
}
```

기존 generator들은 인자를 무시하므로 깨지지 않는다.

`createSheet(item, count, fontScale, options)`에서:

```js
const problem = generateWithUnique(() => item.generator(options.generatorContext || {}));
```

이 방식의 장점:

- generator가 DOM을 보지 않는다.
- 앱 상태는 app 계층에서 관리한다.
- 기존 generator와 호환된다.
- 자동 맞춤 측정 시에도 같은 단 옵션을 넣을 수 있다.

### 5. 곱셈구구 generator 수정

`genU2PreMul()`과 `genG22U2GugudanMix()`가 선택 단을 받을 수 있게 한다.

예:

```js
function resolveGugudanDan(context) {
  const dan = Number(context.gugudanDan);
  return dan >= 2 && dan <= 9 ? dan : rand(2, 9);
}
```

5-1:

```js
export function genU2PreMul(context = {}) {
  const a = resolveGugudanDan(context);
  const b = rand(1, 9);
  return horizProblem(`${a} × ${b}`, numBlank(a * b));
}
```

2-2 혼합:

```js
export function genG22U2GugudanMix(context = {}) {
  const dan = resolveGugudanDan(context);
  const m = rand(1, 9);
  return horizProblem(`${dan} × ${m}`, numBlank(dan * m));
}
```

### 6. fit cache key에 선택 단 포함

자동 문제 수 계산 캐시가 현재는 `item.id@fontScale` 기준이다.

단 선택이 생기면 아래처럼 단 값을 포함하는 것이 안전하다.

```js
`${item.id}@${fontScale}@dan-${selectedGugudanDan}`
```

곱셈구구는 2단~9단 모두 폭이 비슷하지만, 캐시가 UI 상태와 어긋나지 않게 하는 것이 맞다.

## 영향 범위

| 대상 | 영향 수준 | 상세 |
|---|---:|---|
| `app/worksheet.html` | 낮음 | 인쇄 버튼 옆에 숨김 상태의 단 선택 컨트롤 추가 |
| `app/css/worksheet.css` | 낮음 | segmented 단 선택 버튼 스타일 추가, 모바일 대응 |
| `app/js/catalog.js` | 낮음~중간 | `학습지` overrides의 `controls` 메타를 catalog item에 보존 |
| `app/js/catalogs/g5-1.js` | 낮음 | 5-1 곱셈구구에 `controls.gugudanDan` 추가 |
| `app/js/catalogs/g2-2.js` | 선택 | 2-2 곱셈구구 기본/혼합에도 같은 컨트롤을 붙일지 결정 |
| `app/js/generators/g5-1/u2.js` | 낮음 | `genU2PreMul(context)` 형태로 확장 |
| `app/js/generators/g2-2/u2.js` | 선택 | `genG22U2GugudanMix(context)` 확장 |
| `app/js/renderers.js` | 중간 | generator context 전달 |
| `app/js/app.js` | 중간 | 단 선택 UI 표시/상태/재생성/캐시 키 반영 |
| `CHANGELOG.md` | 낮음 | 기능 추가 기록 |

## 위험 점검

| 점검 항목 | 결과 | 근거 |
|---|---|---|
| 기존 약속 | ✅ | generator는 DOM을 직접 보지 않고 context만 받는다. 데이터/표현 분리를 유지한다. |
| 연결 관계 | ✅ | app → renderer → generator로 옵션을 전달하는 흐름이라 역참조가 없다. |
| 데이터 모양 | ✅ | 기존 학습지 ID와 count/grid는 유지하고, 선택 메타만 추가한다. |
| 과거 기록 | ✅ | 선수학습 출처 태그, 본단원 출처 태그 규칙을 건드리지 않는다. |
| 사용자 흐름 | ⚠️ | 단 선택 버튼이 곱셈구구가 아닌 학습지에서 숨겨져야 하고, 선택 후 문제 재생성이 명확해야 한다. |
| 되돌리기 어려움 | ✅ | 정적 JS/CSS/HTML 변경이며 배포 설정이나 의존성 추가가 없다. |

## 구현 순서

1. `catalog.js`에서 `controls` 메타를 catalog item에 보존한다.
2. `worksheet.html`에 `gugudanDanControl` UI를 `인쇄` 버튼 옆에 추가한다.
3. `worksheet.css`에 segmented button 스타일을 추가한다.
4. `app.js`에 `selectedGugudanDan`, 표시/숨김, 버튼 활성화, 클릭 처리, generator context, fit cache key 반영을 추가한다.
5. `renderers.js`가 `options.generatorContext`를 generator에 전달하도록 수정한다.
6. `g5-1/u2.js`의 `genU2PreMul(context)`를 선택 단 지원으로 확장한다.
7. 필요하면 `g2-2/u2.js`의 혼합형 generator도 같은 context를 지원한다.
8. `g5-1.js`의 곱셈구구 항목에 `controls: { gugudanDan: true }`를 추가한다.
9. 선택 범위 확정 시 `g2-2.js`의 기본/혼합 곱셈구구에도 같은 controls를 붙인다.
10. `worksheet.html` 캐시 버전과 `CHANGELOG.md`를 갱신한다.

## 검증 계획

명령:

```bash
node --check app/js/app.js
node --check app/js/renderers.js
node --check app/js/generators/g5-1/u2.js
node --check app/js/generators/g2-2/u2.js
node .claude/scripts/validate.mjs 1000
node .claude/scripts/audit.mjs
python3 -m http.server 8000 --directory app
```

브라우저 확인:

- 5-1 2단원 `곱셈구구` 선택 시 `인쇄` 옆에 2단~9단 버튼 표시
- 5-1 2단원 `나눗셈` 선택 시 단 선택 버튼 숨김
- 5-1 2단원 `선수학습 진단지` 선택 시 단 선택 버튼 숨김
- `2단` 선택 후 생성된 36문항이 모두 `2 × n`
- `9단` 선택 후 생성된 36문항이 모두 `9 × n`
- 정답 보기 정상
- 인쇄 media overflow 0
- 모바일 폭에서 컨트롤바가 깨지지 않음

선택 확장 검증:

- 2-2 2단원 `곱셈구구 (기본)` 또는 `곱셈구구 (2~9단 혼합)`에도 controls를 붙이면 동일하게 확인한다.

