# AI 협업 가이드 (Claude / Cursor / 기타)

> 이 문서는 AI 도구가 이 프로젝트를 작업할 때 참고하는 가이드입니다.
> Claude Code는 자동으로 이 파일을 읽습니다. Cursor 등 다른 도구는 "CLAUDE.md를 먼저 읽어줘" 라고 한 줄 알려주세요.

## 프로젝트 한 줄 요약

초등 수학 학습지(워크시트) 자동 생성 웹 도구. 순수 HTML/CSS/JS, 빌드 도구 없음, Netlify 정적 배포.

자세한 사용/설치는 [README.md](README.md), 코드 구조는 [app/ARCHITECTURE.md](app/ARCHITECTURE.md) 참고.

## 사용자 / 작성자 컨텍스트

- **작성자**: 초보 개발자. 친절하고 자세한 설명을 선호. 한국어로 응답.
- **사용자**: 선생님, 학부모, 학생. 비개발자 사용자가 인쇄해서 쓰는 도구.
- **장기 목표**: 1~6학년 전 학년/학기 확장. 현재는 5학년 1학기만 구현됨.

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
새 학습지를 등록할 때 9개 필드를 일일이 쓰지 말고 빌더 함수를 쓰세요:

```js
defineUnit('u1', '자연수의 혼합 계산', [
  선수학습({ kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 수 덧셈', genU1PreAdd2d),
  ]),
  차시('1차시 덧셈과 뺄셈', [
    학습지('혼합(순서)', genU1MainAddSubOrder),
  ]),
]);
```

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
