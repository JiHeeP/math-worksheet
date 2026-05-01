# 코드 구조 설명서 (ARCHITECTURE)

> 이 문서는 **코드의 내부 구조**를 설명합니다.
> 사용자 안내는 [../README.md](../README.md), AI 협업 규칙은 [../CLAUDE.md](../CLAUDE.md) 참고.

## 한 장으로 보는 데이터 흐름

```
┌──────────────┐
│ catalog.js   │  학습지 메뉴 정의 (단원 → 차시 → 학습지)
└──────┬───────┘
       │ 사용자가 학습지 선택
       ▼
┌──────────────┐
│ app.js       │  UI 이벤트 받아서 generate() 호출
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ renderers.js │  createSheet() — 한 페이지(시트) 조립
└──────┬───────┘
       │ 문제 N개 만들 때마다
       ▼
┌──────────────┐       ┌──────────────┐
│ generator    │ ───▶  │ template     │
│ (uN.js)      │ data  │ (templates)  │
└──────────────┘       └──────┬───────┘
                              │ HTML 조각
                              ▼
                       ┌──────────────┐
                       │ layout.js    │  그리드에 배치
                       └──────┬───────┘
                              ▼
                          DOM 삽입
```

**핵심 원칙**: 제너레이터는 **데이터**만, 템플릿은 **HTML**만 책임진다.

## 모듈 13개 역할

| 파일 | 줄 수 | 역할 |
|------|------|------|
| `worksheet.html` | 74 | HTML 껍데기. 컨트롤(셀렉트/버튼)과 시트 컨테이너만. |
| `css/worksheet.css` | 746 | 화면 + `@media print` 스타일 전체 |
| `js/app.js` | UI 이벤트 바인딩, 초기화, `generate()` 함수. 학년·단원·학습지 캐스케이드 제어 |
| `js/catalog.js` | 빌더 함수(`defineUnit`, `차시`, `학습지`) + 학기 카탈로그 통합 진입점 |
| `js/catalogs/g5-1.js` | 5학년 1학기 단원 정의 묶음 (학기당 한 파일). 같은 학기는 여기서만 수정 |
| `js/templates.js` | 풀이 과정 템플릿 (`T.fracLcdStep` 등) |
| `js/renderers.js` | `createSheet()` — 한 페이지 조립 |
| `js/layout.js` | 그리드 레이아웃 엔진 (격자 배치) |
| `js/helpers.js` | HTML 조각 (`fracD`, `numBlank`, SVG 도형 등) |
| `js/utils.js` | 수학 유틸 (`rand`, `gcd`, `lcm`, `simplify`) |
| `js/generators/g5-1/u1.js` | 5-1 1단원 문제 데이터 생성기 |
| `js/generators/g5-1/u2.js` | 5-1 2단원 |
| `js/generators/g5-1/u3.js` | 5-1 3단원 |
| `js/generators/g5-1/u4.js` | 5-1 4단원 |
| `js/generators/g5-1/u5.js` | 5-1 5단원 |
| `js/generators/g5-1/u6.js` | 5-1 6단원 |

> 새 학년·학기는 `js/generators/g{학년}-{학기}/` + `js/catalogs/g{학년}-{학기}.js` 한 쌍을 추가하면 됨.

## 카탈로그 빌더

`catalog.js` 의 빌더 함수(`defineUnit` / `선수학습` / `차시` / `학습지`)를
학기별 카탈로그(`catalogs/g{학년}-{학기}.js`)에서 호출해 학습지를 등록합니다.
`defineUnit` 의 첫 인자는 학기 ID (`'g5-1'` 등), 두 번째 인자는 학기 안에서
유일한 단원 ID (`'u1'` 등)입니다. 학습지 ID에는 `g{학년}-{학기}_` prefix가
자동으로 부착됩니다.

```js
defineUnit('g5-1', 'u1', '자연수의 혼합 계산', [
  // 선수학습 그룹: 공통 속성을 한 번만 지정
  선수학습({ kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 수 덧셈', genU1PreAdd2d),
    학습지('두 자리 수 뺄셈', genU1PreSub2d, { count: 15 }),  // 개별 오버라이드
  ]),

  // 차시 그룹
  차시('1차시 덧셈과 뺄셈', [
    학습지('혼합(순서)', T.horizontal, genU1MainAddSubOrder),  // 템플릿 명시
  ]),
]);
```

| 빌더 | 의미 |
|------|------|
| `defineUnit(unitId, unitName, groups)` | 단원 정의 |
| `선수학습(defaults, items)` | 선수학습 그룹 (공통 속성 + 학습지들) |
| `차시(lessonRef, [defaults], items)` | 차시 그룹 |
| `학습지(label, [template], generator, [overrides])` | 개별 학습지 |

## 템플릿 카탈로그

`templates.js` 에 정의된 템플릿 (`T.xxx`):

| 템플릿 | 용도 | 필요한 데이터 예시 |
|--------|------|-------|
| `T.horizontal` | 가로셈 (식 = 답) | `{ expression, answer }` |
| `T.vertical` | 세로셈 (사칙연산) | `{ a, b, op }` |
| `T.longDiv` | 나눗셈 세로셈 | `{ dividend, divisor }` |
| `T.concept` | 개념 카드 (질문+답) | `{ question, answer, note? }` |
| `T.relation` | 관계 테이블 | `{ question, table, answer? }` |
| `T.shape` | 도형 넓이/둘레 | `{ shape, dims }` |
| `T.fracCompare` | 분수 크기 비교 | `{ frac1, frac2 }` |
| `T.fracConvert` | 분수 변환 | `{ from, to }` |
| `T.fracLcdStep` | 진분수 통분 (1줄) | `{ n1, d1, n2, d2, op }` |
| `T.mixedImproperStep` | 대분수 (가분수 변환, 1줄) | |
| `T.mixedSeparateStep` | 대분수 (따로 계산, 3줄) | |
| `T.divMethod` | 최대공약수/최소공배수 | |
| `T.pdfGrid` | PDF 격자 세로셈 | |
| `T.raw` | 자유 HTML (호환용) | |

## 새 학습지 추가하는 절차 (단계별)

### 시나리오: "1단원에 세 자리 수 덧셈 학습지를 추가하고 싶다"

#### 1. 제너레이터 작성

`js/generators/g5-1/u1.js` 열고 함수 추가:

```js
export function genU1PreAdd3d() {
  const a = rand(100, 999);
  const b = rand(100, 999);
  return {
    expression: `${a} + ${b}`,
    answer: a + b,
  };
}
```

> **주의**: HTML 문자열을 만들지 말 것. 데이터만 반환.

#### 2. 템플릿 확인/추가

위 데이터는 `T.horizontal` 이 그대로 받을 수 있음 → 새 템플릿 불필요.

만약 적합한 템플릿이 없다면 `js/templates.js` 에 추가:

```js
export const T = {
  // ... 기존 ...
  myNewTemplate: {
    render(data) {
      return `<div>...HTML...</div>`;
    }
  }
};
```

#### 3. 카탈로그 등록

`js/catalogs/g5-1.js` 에서 해당 단원의 `선수학습([...])` 배열에 한 줄 추가:

```js
선수학습({ kind: 'pdf', grid: 'standard', count: 20 }, [
  학습지('두 자리 수 덧셈', genU1PreAdd2d),
  학습지('세 자리 수 덧셈', T.horizontal, genU1PreAdd3d),  // ← 추가
  학습지('두 자리 수 뺄셈', genU1PreSub2d),
]);
```

`u1.js` 에서 `export` 한 함수는 `catalogs/g5-1.js` 가 자동으로 `import` 하지 않음 — 상단의 `import` 구문에 추가해야 함:

```js
import {
  genU1PreAdd2d,
  genU1PreAdd3d,  // ← 추가
  // ...
} from '../generators/g5-1/u1.js';
```

#### 4. 검수

브라우저에서 새로고침 → 단원 1 선택 → 새 학습지 선택 → "새로 만들기" → "정답 보기" 로 정답 확인 → "인쇄 미리보기" 로 출력 확인.

## 자주 헷갈리는 점

### `kind: 'pdf'` 와 `grid: 'standard'`

- `kind: 'pdf'` — PDF 격자(`T.pdfGrid`)에 자동 배치되는 형태
- `grid: 'standard'` — 표준 그리드 (보통 4열)
- 다른 옵션들은 `renderers.js` 와 `layout.js` 참고

### `count` 와 `getWorksheetLimit`

- `count`: 해당 학습지의 기본 문제 수
- `getWorksheetLimit(item)`: 한 페이지 최대 문제 수 (그리드/템플릿에 따라 다름)
- 사용자가 입력한 문제 수가 limit 초과 시 자동으로 limit으로 잘림 ([app.js:54-57](js/app.js#L54-L57))

### 인쇄 깨짐

CSS 수정 시 항상 `@media print` 영역을 함께 점검. 화면에선 멀쩡한데 인쇄 미리보기에서 어긋나는 경우가 잦음.

## 향후 확장 방향

상세는 [../CLAUDE.md](../CLAUDE.md) 참고.

1. **다른 학년 추가** — 학년/학기별 폴더 구조 결정 필요
2. **AI 연동** — 풀이 이미지 → 템플릿 자동 매칭 → 제너레이터 생성
3. **정답지 별도 출력** — 현재는 "정답 보기" 토글만 있음
