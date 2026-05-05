---
name: develop
description: 이 레포 전용 구현 흐름. 승인된 analysis 기록을 기준으로 학습지/진단지/학기/카탈로그/버그 수정을 수행하고 validate, audit, 브라우저 확인으로 검증한다.
---

# /develop — math-worksheet 확인 후 구현

## 역할

사용자가 승인한 작업만 구현한다. 입력에 `context/sessions/` 분석 기록이 있으면 그 기록의 `기술 요구사항`과 `검증 계획`을 실행 기준으로 삼는다.

분석 기록 없이 기존 파일을 바꾸는 요청이면 먼저 `/analysis`가 필요한지 판단한다.

## 절대 규칙

- 빌드 도구, npm/yarn 의존성, TypeScript, 번들러를 추가하지 않는다.
- `app` 폴더 안의 파일 이동은 사용자 확인 없이는 하지 않는다.
- 제너레이터는 가능한 순수 데이터만 반환하고, 표현은 템플릿/렌더러에 둔다.
- UI 도메인 용어는 한국어로 유지한다. `단원`, `차시`, `선수학습`, `학습지`, `연습지`를 영어로 바꾸지 않는다.
- 선수학습 출처는 드롭다운 항목 끝의 `(X-Y)` 태그로만 표시한다.
- 본단원 항목에는 출처 태그를 붙이지 않는다.
- 차시별로 학습지 화면을 분리하지 않는다.
- 커밋/푸시는 사용자가 명시적으로 요청하거나 승인한 경우에만 한다.

## 구현 전 확인

1. `git status --short`로 기존 변경을 확인한다.
2. 분석 기록 또는 관련 파일을 다시 읽는다.
3. 바꿀 파일의 주변 코드를 읽고 기존 스타일을 따른다.
4. 사용자 변경으로 보이는 기존 변경은 되돌리지 않는다.
5. 수정 전에 어떤 파일을 왜 바꿀지 짧게 알린다.

## 작업 유형별 구현

### 새 학습지 추가

`new-worksheet/SKILL.md` 절차를 실행 단계에 통합한다.

1. `app/js/generators/g{학기}/u{단원}.js`에 generator 추가 또는 기존 함수 재사용
2. 필요한 helper/template 확인
3. `app/js/catalogs/g{학기}.js`에 import 추가
4. `학습지(...)` 등록
5. 선수학습이면 `from: 'gX-Y'` 명시
6. 필요한 경우 `prereqs: [sheetRef(...), unitRef(...), ext(...)]` 연결
7. PDF형이면 `kind: 'pdf'`, `pdfMap`, `pdfGenerators` 확인

자연수 계산 generator는 반드시 다음을 보장한다.

- 음수 결과 없음
- 0 결과 없음
- 소수/분수 결과 없음
- 중간 계산 음수 없음
- 나눗셈은 `q × d`로 정수 몫 보장

### 선수학습 진단지 추가

`new-diagnostic/SKILL.md` 절차를 실행 단계에 통합한다.

1. 분석 기록의 단원별 선수학습 항목 수와 예상 페이지 수를 다시 확인한다.
2. 기존 `선수학습(...)` entries를 재사용해 진단지 데이터를 만든다.
3. 항목당 4문항을 생성한다.
4. 한 단 24문항, 한 장 48문항 기준으로 자동 배치한다.
5. 기존 학습지 레이아웃을 그대로 붙이지 말고 compact 표현으로 렌더링한다.
6. 선수학습이 없는 단원에는 진단지 항목을 추가하지 않는다.
7. 화면 CSS와 `@media print`를 함께 수정한다.
8. 정답 보기 전/후 레이아웃을 브라우저에서 확인한다.

### 새 학년·학기 추가

`new-grade/SKILL.md` 절차를 실행 단계에 통합한다.

1. `CURRICULUM.md` 기준으로 단원 목록 확인
2. `app/js/generators/gX-Y/` 폴더 생성
3. `app/js/catalogs/gX-Y.js` 생성
4. `meta.units`, `entries`, `pdfMap`, `pdfGenerators` 구성
5. `app/js/catalog.js`에 import 추가
6. `GRADES` 배열에 학년·학기 순서대로 삽입
7. 단원 구현이 포함되면 generator/catalog 등록까지 진행

### 카탈로그 점검 및 정리

`audit-catalog/SKILL.md` 절차를 실행 단계에 통합한다.

1. `node .claude/scripts/audit.mjs` 실행
2. 깨진 refs 또는 라벨 중복은 기능 위험이므로 우선 수정
3. `ext` → `unitRef` 승격은 사용자가 승인한 범위에서만 일괄 수정
4. `node .claude/scripts/validate.mjs 5000` 실행
5. 결과를 표로 보고

### 버그 수정/화면 수정

1. 관련 파일을 최소 범위로 수정
2. `templates.js`, `renderers.js`, `layout.js`, `app.js`, CSS의 역할 경계를 지킨다
3. 인쇄 영향이 있으면 `@media print`까지 확인한다
4. 화면 수정은 가능하면 브라우저에서 실제 `worksheet.html`을 열어 검수한다

## 검증

변경 유형별로 필요한 검증을 실행한다.

| 변경 | 필수 확인 |
|---|---|
| generator/catalog 추가 | `node .claude/scripts/validate.mjs 1000` 이상 |
| 진단지 추가 | `node .claude/scripts/audit.mjs` + `node .claude/scripts/validate.mjs 1000` + 브라우저/인쇄 확인 |
| 카탈로그 참조 수정 | `node .claude/scripts/audit.mjs` |
| 자연수 계산 변경 | `node .claude/scripts/validate.mjs 5000` |
| 화면/인쇄/CSS 변경 | 로컬 서버 + 브라우저 확인 |
| 분수 단계 풀이 변경 | 정답 보기 전/후, 줄바꿈, data-ans 표시 확인 |

로컬 서버 예:

```bash
python3 -m http.server 8000 --directory app
```

브라우저에서 확인:

```text
http://localhost:8000/worksheet.html
```

## 문서 업데이트

다음 경우 `CHANGELOG.md`에 짧게 기록한다.

- 새 학기/단원/학습지 추가
- 사용자 화면 또는 인쇄 결과 변화
- 문제 생성 규칙 또는 정답 표시 방식 변화
- 카탈로그 출처/의존성 대량 정리

## 완료 보고

```text
✅ 작업 완료!
- 새로 만든 파일: ...
- 수정한 기존 파일: ...
- 확인한 내용: ...
- 남은 주의점: ...
```

검증을 못 했으면 이유를 명확히 말한다.

