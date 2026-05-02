# AI 협업 가이드 (Claude / Cursor / 기타)

> 이 문서는 AI 도구가 이 프로젝트를 작업할 때 참고하는 가이드입니다.
> Claude Code는 자동으로 이 파일을 읽습니다. Cursor 등 다른 도구는 "CLAUDE.md를 먼저 읽어줘" 라고 한 줄 알려주세요.

## 프로젝트 한 줄 요약

초등 수학 학습지(워크시트) 자동 생성 웹 도구. 순수 HTML/CSS/JS, 빌드 도구 없음, Netlify 정적 배포.

자세한 사용/설치는 [README.md](README.md), 코드 구조는 [app/ARCHITECTURE.md](app/ARCHITECTURE.md) 참고.

## 사용자 / 작성자 컨텍스트

- **작성자**: 초보 개발자. 친절하고 자세한 설명을 선호. 한국어로 응답.
- **사용자**: 선생님, 학부모, 학생. 비개발자 사용자가 인쇄해서 쓰는 도구.
- **장기 목표**: 1~6학년 전 학년/학기 확장. 현재 구현 — **5-1 (전체)**, **4-2 (1단원만)**, **5-2 (1·2단원만)**.

## 도메인 용어 (한국 초등 수학 교육과정)

이 단어들은 코드와 UI 전반에 등장합니다. 영어로 번역하거나 바꾸지 마세요.

| 용어 | 의미 | 예시 |
|------|------|------|
| **단원** (unit) | 교과서의 큰 묶음 | "1단원 자연수의 혼합 계산" |
| **차시** (lesson) | 단원 안의 한 수업 분량 | "1차시 덧셈과 뺄셈" |
| **선수학습** | 본 단원을 배우기 전 복습할 내용 | 5학년에서 4학년 내용 복습 |
| **학습지** (worksheet) | 한 종류의 연습 문제 묶음 | "두 자리 수 덧셈 20문항" |
| **연습지** | 학습지와 거의 같은 뜻 (UI에 사용) | |

## 핵심 아키텍처 원칙

### 1. 데이터와 표현의 분리
- **제너레이터 (`js/generators/uN.js`)** 는 순수 데이터만 반환. HTML 만들지 말 것.
- **템플릿 (`js/templates.js`)** 이 데이터를 받아 풀이 과정 HTML을 그림.

올바른 예:
```js
// 제너레이터: 데이터만
function genFracAddLt1() {
  return { n1, d1, n2, d2, op: '+' };
}

// 템플릿이 렌더링
T.fracLcdStep.render(data);
```

### 2. 카탈로그 빌더 사용
새 학습지를 등록할 때 9개 필드를 일일이 쓰지 말고 빌더 함수를 쓰세요. 첫 인자는 학기 ID:

```js
defineUnit('g5-1', 'u1', '자연수의 혼합 계산', [
  선수학습({ kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 수 덧셈', genU1PreAdd2d, { id: 'u1_pre_add_2d', from: 'g2-1' }),
  ]),
  차시('1차시 덧셈과 뺄셈', [
    학습지('혼합(순서)', genU1MainAddSubOrder, { id: 'u1_main_addsub_order' }),
  ]),
]);
```

학습지 ID에는 학기 prefix가 자동 부착(`g5-1_u1_main_addsub_order`).

### 3. 모듈은 ES Modules로
- `import` / `export` 사용
- `<script type="module">` 로 브라우저 직접 로딩
- **Webpack, Vite, Babel 등 빌드 도구를 도입하지 마세요**

## 절대 하지 말 것 (DON'T)

- ❌ **빌드 도구 도입** (Webpack/Vite/Rollup/Babel/TypeScript 등). 의도적으로 단순한 구성 유지.
- ❌ **npm/yarn 의존성 추가**. `package.json`이 없는 상태가 정상.
- ❌ **HTML/CSS/JS를 한 파일에 합치기**. 방금 13개 모듈로 분리했음 (CHANGELOG 참고).
- ❌ **제너레이터에서 HTML 문자열 만들기**. 템플릿에 위임.
- ❌ **도메인 용어 영어 번역** (단원→Unit으로 UI 변경 등). 한국어 그대로.
- ❌ **`app` 폴더 안의 파일을 옮기는 작업** — Netlify 배포 설정과 연관 가능. 사용자 확인 후 진행.
- ❌ **선수학습 칩 패널 만들지 말 것**. 컨트롤바 아래에 별도 칩/배지 영역 X. 출처 정보는 학습지 드롭다운 항목 끝의 `(X-Y)` 태그로만 표시 (2026-05-02 사용자 확정).
- ❌ **본단원 항목에 출처 태그 X**. 드롭다운의 `[본단원] 라벨` 옆에 `(X-Y)` 표기 금지. 본단원은 현재 학기와 동일해 자명하므로 가독성을 위해 생략. 선수학습 항목에만 `(X-Y)` 표시 (2026-05-02 사용자 최종 결정).
- ❌ **차시별로 학습지 화면 분리 X**. 단원 안에서는 (사전 학습) / (본 학습) 두 묶음만 노출.

## 작업 규칙 (HARD — 어기면 회귀)

### 수학 결과 무결성 (자연수 계산)

`generator` 가 만드는 모든 자연수 계산 문제는 **초등 교육과정 범위 안의 답** 만 내야 한다. 새 generator 추가 또는 기존 변경 시 다음 invariants 가 절대 깨지면 안 됨:

- ❌ **음수 결과** (예: `5 − 7 = −2`)
- ❌ **0 결과** (자연수 = {1, 2, 3, ...} 정의에 따름)
- ❌ **소수/분수 결과** (예: `5 ÷ 2 = 2.5`)
- ❌ **중간 계산이 음수가 되는 식** (예: `3 − (5 + 2)` 의 안쪽 — `3 − 7`)

#### 보장 방법
1. **range 제약**: `a = rand(b + c + 1, 99)` 처럼 범위 자체를 안전하게 잡기
2. **do-while 재추출**: invariant 위반 시 재시도 (분수 generator 다수가 이 방식)
3. **나눗셈 정수 보장**: 피제수를 `q × d` 형태로 만들어 `÷ d = q` 가 정수가 되게
4. **곱셈/나눗셈 짝수 트릭**: 삼각형 넓이처럼 `÷ 2` 가 들어가면 변길이를 `rand(...) * 2` 로 짝수 강제 (u6.js 참고)

#### 검증 절차 (필수)
새/수정한 generator는 다음 sanity test 통과 확인:

```
node 스크립트로 각 generator 를 5,000회 무작위 실행 →
data-ans 속성 파싱 → 음의 부호 / 소수점 / "0" 단독 토큰 0건 확인
```

(2026-05-02 525,000회 회귀 테스트로 5-1 1단원의 음수/0 결과 케이스 5건 발견·수정. 이후 모든 자연수 generator는 이 절차로 검증되어야 함.)

### 분수 계산 단계 풀이

받아올림 / 받아내림 / 1을 d/d로 변환 등 **중간 단계가 의미 있는 분수 계산**은 단계 풀이 템플릿 사용. 정답만 한 줄로 보여주지 말 것.

| 케이스 | 템플릿 |
|---|---|
| (진분수)+(진분수), 합 ≥ 1 (가분수→대분수) | `T.sameFracAddGe1Step` (분모 같음) / `T.fracLcdStep` (분모 다름) |
| 1 − (진분수) | `T.oneMinusFracStep` |
| (자연수) − (진분수) | `T.intMinusFracStep` |
| (자연수) − (대분수) | `T.intMinusMixedStep` |
| 분모 같은 (대분수)+(대분수), 받아올림 | `T.sameMixedAddCarryStep` |
| 분모 같은 (대분수)−(대분수), 받아내림 | `T.sameMixedSubBorrowStep` |
| 분모 다른 (대분수) 사칙 | `T.mixedImproperStep`, `T.mixedSeparateStep` |

받아올림/내림이 없는 단순 케이스는 한 줄 풀이(`htmlProblem('frac-row', ...)`)로 OK.

### 학습지 출처 (`from`) 매핑

각 학습지의 출처 학년·학기를 카탈로그에 명시. 드롭다운 표시 규칙:

| 구분 | `from` 필드 | 드롭다운 표시 |
|---|---|---|
| **본단원** | 명시 안 함 | `[본단원] 라벨` (태그 없음 — 현재 학기와 같아서 자명) |
| **선수학습** | `from: 'g{학년}-{학기}'` 명시 | `[선수학습] 라벨 (X-Y)` |

`from` 매핑은 **2022 개정 교육과정 표준**을 따른다. 임의로 추측하지 말고 단원 구성을 확인 후 결정. 잘 모르겠으면 [CURRICULUM.md](CURRICULUM.md) 의 단원별 출처 매핑 표 참고.

### 카탈로그 import — 함수 선언 사용

`catalog.js` ↔ `catalogs/g{학기}.js` 가 서로 import 하는 순환 구조다. catalog.js 의 헬퍼 함수(`ext`, `unitRef`, `sheetRef` 등)는 **반드시 `function` 선언** 으로 작성:

```js
// 올바름 (호이스팅)
export function ext(label) { return { kind: 'ext', label }; }

// 틀림 (TDZ — 학기 카탈로그 평가 시 'Cannot access ext before initialization')
export const ext = (label) => ({ kind: 'ext', label });
```

## 자주 하는 작업 절차

### 새 학습지 추가하기

1. 적절한 단원의 제너레이터 파일 열기 (`js/generators/g{학년}-{학기}/uN.js`)
2. 함수 작성: 순수 데이터 객체 반환 (HTML 금지)
3. `js/templates.js` 에서 적합한 템플릿 확인. 없으면 새로 추가.
4. `js/catalogs/g{학년}-{학기}.js` 에서 `학습지(...)` 호출로 등록.
5. 브라우저에서 새로 만들기 → 정답 보기로 검수.

자세한 단계와 예시는 [app/ARCHITECTURE.md](app/ARCHITECTURE.md).

### 새 학년·학기 추가하기 (예: 4학년 1학기)

학년·학기 다중 지원 구조 (2026-05-01 도입). 한 앱에서 학년·학기 드롭다운으로 전환.

추가 절차:
1. `app/js/generators/g{학년}-{학기}/uN.js` 작성 (예: `g4-1/u1.js`).
   - 다른 학기 generators를 참고하되, 상대 import 경로는 `../../utils.js`, `../../helpers.js`, `../../templates.js`.
2. `app/js/catalogs/g{학년}-{학기}.js` 작성. `catalogs/g5-1.js` 와 동일한 형식.
   - `const GRADE_ID = 'g4-1';` 로 변경
   - 단원 import 경로를 새 폴더로 변경
   - `meta.short`, `meta.name`, `meta.units` 작성
3. `app/js/catalog.js` 하단 `GRADES` 배열에 `import * as g4_1 from './catalogs/g4-1.js';` 추가하고 `const GRADES = [g4_1, g5_1, ...];` 형태로 push.
4. 단원 ID는 학기 안에서만 유일하면 됨 (`u1`, `u2`...). 학기 prefix는 빌더가 자동 부착.

[CURRICULUM.md](CURRICULUM.md)에 1~6학년 학기별 단원 목록과 선수학습 체인이 정리되어 있음 — 카탈로그 작성 시 참고.

## 작업 스타일 가이드

- **응답은 한국어로**. 코드 식별자/주석은 기존 코드 스타일 따름 (현재 함수명은 영어, UI 문자열은 한국어).
- **변경 사항이 크면 `CHANGELOG.md` 에 기록** (날짜별 섹션).
- **테스트 자동화 없음**. 기능 검수는 브라우저에서 시각 확인.
- **인쇄(print)에서 깨지면 안 됨**. CSS의 `@media print` 영역을 항상 함께 점검.

## 막혔을 때 참고

- 변경 이력: [CHANGELOG.md](CHANGELOG.md)
- 코드 구조: [app/ARCHITECTURE.md](app/ARCHITECTURE.md)
- 사용자 안내: [README.md](README.md)
