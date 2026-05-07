# 분석 기록: 5학년 1학기 단원별 선수학습 진단지 생성 및 맨 앞 배치

- **일시**: 2026-05-06
- **요구사항 원문**: 5학년 1학기 각 단원별로 진단지를 생성하고, 각 단원별 학습지 맨 앞단에 붙여줘라.
- **판정**: ✅ 안전하게 진행 가능

## 요구사항 해석

- 5학년 1학기 각 단원에서 기존 `선수학습` 학습지를 진단 문항 원천으로 삼는다.
- 선수학습 항목 1개당 4문항을 생성한다.
- 진단지는 A4 2단 구성으로 만든다.
- 한 단은 최대 24문항, 한 장은 최대 48문항으로 잡는다.
- 48문항을 넘으면 2장 이상을 허용한다.
- 선수학습 항목이 없는 단원은 진단지를 만들지 않는다.
- 진단지 항목은 각 단원의 학습지 선택 목록 맨 앞에 표시한다.

## 현재 상태

현재 브랜치: `feature/g5-1-diagnostic`

현재 `app/js/app.js`의 `populateWorksheetSelect()`는 `getWorksheetsByUnit(gradeId, unitId)` 결과 순서대로 드롭다운을 만든다. `getWorksheetsByUnit()`은 `WORKSHEET_CATALOG.filter(...)`만 수행하므로, `app/js/catalogs/g5-1.js`에서 단원 entries 배열의 앞에 들어간 항목이 드롭다운에서도 앞에 표시된다.

따라서 진단지를 맨 앞에 붙이려면 각 `defineUnit(...)`의 첫 그룹으로 진단지 그룹을 두는 방식이 가장 안전하다.

## 현재 5-1 선수학습 현황

| 단원 | 선수학습 항목 수 | 진단 문항 수 | 예상 장수 | 처리 |
|---|---:|---:|---:|---|
| 1단원 자연수의 혼합계산 | 13개 | 52문항 | 2장 | 진단지 생성, 맨 앞 배치 |
| 2단원 약수와 배수 | 2개 | 8문항 | 1장 | 진단지 생성, 맨 앞 배치 |
| 3단원 규칙과 대응 | 0개 | 0문항 | 0장 | 진단지 없음 |
| 4단원 약분과 통분 | 2개 | 8문항 | 1장 | 진단지 생성, 맨 앞 배치 |
| 5단원 분수의 덧셈과 뺄셈 | 6개 | 24문항 | 1장 | 진단지 생성, 맨 앞 배치 |
| 6단원 다각형의 둘레와 넓이 | 2개 | 8문항 | 1장 | 진단지 생성, 맨 앞 배치 |

총 추가 진단지 학습지 수는 5개다. 3단원은 선수학습이 없으므로 추가하지 않는다.

## 영향 범위

| 대상 | 영향 수준 | 상세 |
|---|---:|---|
| `app/js/catalog.js` | 중간 | `진단지` 그룹 헬퍼를 추가하고, `kind: 'diagnostic'` 항목이 같은 단원의 선수학습 항목 ID를 참조할 수 있게 한다. 기존 `function` 선언 규칙을 지킨다. |
| `app/js/catalogs/g5-1.js` | 중간 | u1/u2/u4/u5/u6의 `defineUnit(...)` 첫 그룹에 진단지를 추가한다. u3은 추가하지 않는다. |
| `app/js/renderers.js` | 높음 | 진단지용 compact 문항 변환과 `createDiagnosticSheets()`를 추가한다. PDF형 세로셈도 한 줄 식으로 압축해야 한다. |
| `app/js/app.js` | 중간 | `item.kind === 'diagnostic'` 생성 분기를 추가한다. 기존 fit-count 자동 축소와 충돌하지 않게 한다. |
| `app/css/worksheet.css` | 중간 | A4 2단 진단지 레이아웃, compact 문항, 인쇄 스타일을 추가한다. |
| `.claude/scripts/validate.mjs` | 낮음~중간 | 진단지 항목은 generator가 없거나 특수 generator일 수 있으므로 일반 generator 검증에서 skip 또는 별도 처리해야 한다. |
| `CHANGELOG.md` | 낮음 | 사용자 화면에 새 진단지 항목이 추가되므로 기록한다. |

## 권장 설계

### 1. `진단지` catalog 그룹 추가

`catalog.js`에 `function` 선언으로 `진단지(defaults)` 헬퍼를 추가한다.

```js
export function 진단지(defaults = {}) {
  return {
    section: '진단지',
    lessonRef: '선수학습 진단',
    defaults,
    items: [학습지('선수학습 진단지', null, {
      id: defaults.id,
      kind: 'diagnostic',
      diagnosticFrom: '선수학습',
    })],
  };
}
```

정확한 구현은 기존 `defineUnit()` 흐름에 맞춰 조정한다. 중요한 점은 `defineUnit()`이 모든 entries를 만든 뒤, `kind: 'diagnostic'` 항목에 같은 단원의 `section === '선수학습'` source id 목록을 연결하는 것이다.

이렇게 하면 같은 선수학습 목록을 별도 배열로 중복 작성하지 않아도 된다.

### 2. 진단지 source 자동 연결

`defineUnit()` 처리 후:

- `kind: 'diagnostic'`
- `diagnosticFrom: '선수학습'`

인 항목에 대해 같은 단원의 선수학습 entries를 찾아 `sourceIds` 또는 유사 필드에 연결한다.

진단지가 선수학습 그룹보다 앞에 있어도, entries 전체를 만든 뒤 연결하면 드롭다운 순서와 source 연결을 둘 다 만족할 수 있다.

### 3. compact 렌더링

기존 학습지를 그대로 이어 붙이면 24문항/단 기준을 지키기 어렵다. 진단지는 다음처럼 압축한다.

| 기존 형태 | 진단지 표현 |
|---|---|
| `vertical` 또는 PDF add/sub/mul 데이터 | `a + b = □`, `a × b = □` |
| PDF division 데이터 `{ dvsr, dvnd, quot, rem }` | `dvnd ÷ dvsr = □` 또는 `dvnd ÷ dvsr = □ ... □` |
| 기존 `horizProblem` | 내부 HTML을 compact 문제로 재사용 |
| 분수/대분수 한 줄 문제 | 기존 분수 HTML을 compact CSS로 표시 |
| 단계 풀이/개념 문제 | 진단 목적에 필요한 식과 답칸만 표시. 너무 크면 진단지 전용 compact 변환 추가 |

### 4. 페이지 분할

- source 1개 = 4문항
- 6개 source = 한 단 24문항
- 12개 source = 한 장 48문항
- 13개 source 이상 = 다음 A4 sheet로 분할

1단원은 13개 source라서 1쪽 48문항 + 2쪽 4문항이 된다.

### 5. 드롭다운 맨 앞 배치

`g5-1.js`에서 각 단원의 첫 그룹으로 진단지를 둔다.

```js
const u1 = defineUnit(GRADE_ID, 'u1', '자연수의 혼합계산', [
  진단지({ id: 'u1_pre_diagnostic' }),
  선수학습(...),
  차시(...),
]);
```

`populateWorksheetSelect()`가 catalog 순서를 그대로 사용하므로, 이 방식이면 `[진단지] 선수학습 진단지`가 해당 단원 선택 목록의 첫 번째 항목이 된다.

## 점검 결과

| 점검 항목 | 결과 | 근거 |
|---|---|---|
| 기존 약속 | ✅ | 기존 선수학습 generator를 삭제하지 않고 재사용한다. generator에서 HTML을 새로 만들지 않고 renderer에서 표현을 담당한다. |
| 연결 관계 | ✅ | catalog는 source 관계만 갖고, 진단지 렌더링은 renderer/app 계층에서 처리한다. |
| 데이터 모양 | ✅ | 기존 학습지 ID와 `from` 규칙을 유지한다. 새 `section: '진단지'`, `kind: 'diagnostic'`만 추가한다. |
| 과거 기록 | ✅ | 본단원 출처 태그 금지, 선수학습 출처 태그 규칙을 건드리지 않는다. 진단지 source 제목에도 출처는 필요 시 한 번만 표시한다. |
| 사용자 흐름 | ⚠️ | 진단지는 한 항목이 여러 A4 sheet를 만들 수 있어 `generate()`와 문제 수/쪽수 입력 해석을 조심해야 한다. |
| 되돌리기 어려움 | ✅ | 정적 JS/CSS 변경이며 빌드 도구, 의존성, 파일 이동, 배포 설정 변경이 없다. |

## 기술 요구사항

| 순서 | 작업 유형 | 대상 | 설명 | 의존 순서 |
|---:|---|---|---|---|
| 1 | DATA_EDIT | `app/js/catalog.js` | `진단지` 그룹 헬퍼 추가, `defineUnit()`이 diagnostic source를 같은 단원의 선수학습 entries로 자동 연결하게 수정 | — |
| 2 | NEW_SERVICE | `app/js/renderers.js` | `createDiagnosticSheets(item, fontScale)`와 compact 문제 변환 함수 추가 | 1 |
| 3 | BUG_FIX | `app/js/app.js` | `kind: 'diagnostic'` 생성 분기 추가. 문제 수 입력은 총 문항 수 표시, 쪽수 입력은 같은 진단지를 몇 부 만들지로 처리 | 2 |
| 4 | THEME_CHANGE | `app/css/worksheet.css` | 진단지 2단 레이아웃, source 블록, compact 문제, 정답 표시, print 스타일 추가 | 2 |
| 5 | DATA_EDIT | `app/js/catalogs/g5-1.js` | u1/u2/u4/u5/u6 첫 그룹에 진단지 추가. u3은 추가하지 않음 | 1 |
| 6 | BUG_FIX | `.claude/scripts/validate.mjs` | `kind: 'diagnostic'` 항목이 일반 generator 검증에서 crash를 만들지 않게 처리 | 1 |
| 7 | DOC_CHANGE | `CHANGELOG.md` | 5-1 단원별 선수학습 진단지 추가 기록 | 1-6 |
| 8 | TEST | 브라우저/스크립트 | validate, audit, 5개 진단지 표시/정답/인쇄 확인 | 1-7 |

## 검증 계획

명령:

```bash
node .claude/scripts/audit.mjs
node .claude/scripts/validate.mjs 1000
python3 -m http.server 8000 --directory app
```

브라우저 확인:

- 5-1 1단원: 드롭다운 첫 항목이 `[진단지] 선수학습 진단지`, 52문항, 2장
- 5-1 2단원: 드롭다운 첫 항목이 `[진단지] 선수학습 진단지`, 8문항, 1장
- 5-1 3단원: 진단지 없음, 기존 첫 본단원 학습지 유지
- 5-1 4단원: 드롭다운 첫 항목이 `[진단지] 선수학습 진단지`, 8문항, 1장
- 5-1 5단원: 드롭다운 첫 항목이 `[진단지] 선수학습 진단지`, 24문항, 1장
- 5-1 6단원: 드롭다운 첫 항목이 `[진단지] 선수학습 진단지`, 8문항, 1장
- 정답 보기 전/후에 layout 깨짐 없음
- 인쇄 화면에서 A4 2단이 유지되고 문항이 잘리지 않음

## 제시한 대안

- **보수안**: 단원별 진단지 generator를 하드코딩한다. 구현은 단순하지만 선수학습 항목과 중복이 생겨 유지보수가 나빠진다.
- **비권장안**: 기존 선수학습 학습지를 그대로 4문항씩 이어 붙인다. 세로셈/PDF/개념 카드가 커서 한 단 24문항 기준을 지키기 어렵다.

