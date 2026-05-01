# 변경 이력

## 2026-05-01: 모듈화 리팩토링 + 템플릿 시스템 도입

### 배경
- 기존 `worksheet.html` 단일 파일 3,052줄에 HTML/CSS/JS가 전부 포함
- 학습지 추가 시 제너레이터 + 렌더링 + 카탈로그를 매번 수동 작성해야 하는 비효율
- 학년 확장(1~6학년) 시 구조적으로 불가능한 상태

### 변경 내용

#### 1. 파일 분리 (1개 -> 13개 모듈)

| 기존 | 변경 후 | 줄 수 | 역할 |
|------|--------|------|------|
| worksheet.html (3052줄) | worksheet.html | 74 | HTML 껍데기만 |
| (같은 파일 내) | css/worksheet.css | 746 | 스타일 전체 |
| (같은 파일 내) | js/utils.js | 105 | 수학 유틸 (rand, gcd, lcm, simplify 등) |
| (같은 파일 내) | js/helpers.js | 153 | HTML 조각 생성 (fracD, numBlank, SVG 도형 등) |
| (같은 파일 내) | js/templates.js | 397 | 풀이 과정 템플릿 시스템 |
| (같은 파일 내) | js/layout.js | 133 | 그리드 레이아웃 엔진 |
| (같은 파일 내) | js/renderers.js | 277 | 문제 렌더링 + 시트 조립 |
| (같은 파일 내) | js/catalog.js | 413 | 카탈로그 빌더 + 학습지 목록 |
| (같은 파일 내) | js/app.js | 102 | UI 이벤트 + 초기화 |
| (같은 파일 내) | js/generators/u1.js | 186 | 1단원 제너레이터 |
| (같은 파일 내) | js/generators/u2.js | 53 | 2단원 제너레이터 |
| (같은 파일 내) | js/generators/u3.js | 38 | 3단원 제너레이터 |
| (같은 파일 내) | js/generators/u4.js | 94 | 4단원 제너레이터 |
| (같은 파일 내) | js/generators/u5.js | 112 | 5단원 제너레이터 |
| (같은 파일 내) | js/generators/u6.js | 68 | 6단원 제너레이터 |

#### 2. 템플릿 시스템 도입 (templates.js)

**핵심 변화**: 데이터(수학 로직)와 표현(풀이 과정 HTML)을 분리

기존:
```js
// 제너레이터가 수학 + 렌더링 전부 담당
function genU5MainAdd() {
  let d1, d2, n1, n2;
  // ... 숫자 생성
  // ... 통분 과정 HTML 직접 조립
  // ... 결과 포맷팅
  return fracStepProblem(steps);  // HTML이 섞인 결과
}
```

변경 후:
```js
// 제너레이터: 순수 데이터만
function genFracAddLt1() {
  return { n1, d1, n2, d2, op: '+' };
}

// 템플릿: 풀이 과정 렌더링만 (재사용 가능)
T.fracLcdStep.render(data)  // 통분 단계별 풀이
```

정의된 템플릿 목록:
- `T.horizontal` - 가로셈 (expression = answer)
- `T.vertical` - 세로셈 (사칙연산)
- `T.longDiv` - 나눗셈 세로셈
- `T.concept` - 개념 카드 (질문 + 답)
- `T.relation` - 관계 테이블
- `T.shape` - 도형 넓이/둘레
- `T.fracCompare` - 분수 크기 비교
- `T.fracConvert` - 분수 변환
- `T.fracLcdStep` - 진분수 통분 연산 (1줄 풀이)
- `T.mixedImproperStep` - 대분수 연산, 가분수 변환 (1줄)
- `T.mixedSeparateStep` - 대분수 연산, 따로 계산 (3줄)
- `T.divMethod` - 나눗셈법 (최대공약수/최소공배수)
- `T.pdfGrid` - PDF 격자 세로셈
- `T.raw` - 자유 HTML (호환용)

#### 3. 카탈로그 빌더 (catalog.js)

기존:
```js
// 학습지마다 9개 필드 수동 입력
{ id: 'u1_pre_add_2d', unit: 'u1', section: '선수학습',
  label: '두 자리 수 덧셈', lessonRef: '선수학습',
  kind: 'pdf', grid: 'standard', count: 20,
  generator: genU1PreAdd2d },
```

변경 후:
```js
// 공통 속성은 그룹에서 상속
defineUnit('u1', '자연수의 혼합 계산', [
  선수학습({ kind: 'pdf', grid: 'standard', count: 20 }, [
    학습지('두 자리 수 덧셈', genU1PreAdd2d),
    학습지('두 자리 수 뺄셈', genU1PreSub2d),
  ]),
  차시('1차시 덧셈과 뺄셈', [
    학습지('혼합(순서)', genU1MainAddSubOrder),
  ]),
]);
```

빌더 함수:
- `defineUnit(unitId, unitName, groups)` - 단원 정의
- `선수학습(defaults, items)` - 선수학습 그룹
- `차시(lessonRef, [defaults], items)` - 차시(본단원) 그룹
- `학습지(label, [template], generator, [overrides])` - 개별 학습지

#### 4. 기술 스택

- ES Modules (`import`/`export`) 사용 - 빌드 도구 불필요
- `<script type="module">` 로 브라우저 네이티브 지원
- Netlify 배포 구조 유지 (정적 파일만)

### 향후 확장 방향

1. **학년 추가**: `generators/` 에 파일 추가 + `catalog.js`에 등록
2. **새 템플릿**: `templates.js`에 `T.newTemplate` 추가
3. **AI 연동**: 풀이 과정 이미지 -> 템플릿 자동 매칭 -> 제너레이터 생성
