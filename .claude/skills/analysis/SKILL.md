---
name: analysis
description: 이 레포 전용 사전 분석. 구현 전 관련 파일을 읽고 영향 범위, 위험도, 작업 항목, 검증 계획을 context/sessions 기록으로 남긴다.
---

# /analysis — math-worksheet 사전 점검

## 역할

코드를 고치기 전에 요청이 안전한지 확인한다. 이 단계에서는 제품 코드(`app/` 등)를 수정하지 않는다. 단, 분석 기록 파일은 `context/sessions/`에 작성할 수 있다.

## 기본 확인 파일

요청과 무관하게 필요한 만큼만 읽는다.

- `AGENTS.md`: AI 작업 규칙, 금지 사항, 수학 무결성 규칙
- `README.md`: 사용/실행 방법
- `app/ARCHITECTURE.md`: 코드 흐름
- `CURRICULUM.md`: 학년·학기·선수학습 출처 판단
- 관련 `app/js/catalogs/g*-*.js`
- 관련 `app/js/generators/g*-*/u*.js`
- 관련 `app/js/templates.js`, `app/js/layout.js`, `app/js/renderers.js`, `app/js/app.js`, `app/css/worksheet.css`
- `.claude/scripts/audit.mjs`, `.claude/scripts/validate.mjs`

검색은 `rg`를 우선 사용한다.

## 요청 유형별 분석

### 새 학습지 추가

`new-worksheet/SKILL.md` 내용을 분석 단계에 통합한다.

확인할 것:

- 학기와 단원이 이미 구현되어 있는가
- 본단원/선수학습 구분이 맞는가
- 선수학습이면 `from: 'gX-Y'` 출처가 CURRICULUM 기준으로 맞는가
- 기존 템플릿으로 충분한가, 새 템플릿이 필요한가
- 자연수 계산이면 음수/0/소수/분수 결과 가능성이 없는가
- 분수 계산이면 필요한 단계 풀이 템플릿이 있는가
- 카탈로그 ID가 학기 안에서 중복되지 않는가

기술 요구사항에는 보통 다음을 넣는다.

1. generator 작성 또는 기존 generator 재사용
2. catalog import 추가
3. `학습지(...)` 등록
4. PDF형이면 `pdfMap`/`pdfGenerators` 연결
5. `node .claude/scripts/validate.mjs 1000` 이상 실행
6. 필요하면 브라우저/인쇄 확인

### 선수학습 진단지 추가

`new-diagnostic/SKILL.md` 내용을 분석 단계에 통합한다.

확인할 것:

- 대상 학기와 단원이 이미 구현되어 있는가
- 각 단원의 `선수학습(...)` 항목 수가 몇 개인가
- 선수학습 항목이 0개인 단원은 `진단지 없음`으로 처리되는가
- 항목당 4문항 기준으로 총 문항 수가 몇 개인가
- 한 단 24문항, 한 장 48문항 기준으로 몇 장이 필요한가
- 기존 generator 결과를 진단지용 compact 표현으로 바꿀 수 있는가
- 세로셈, 분수 단계 풀이, 도형/개념 문제가 한 장 배치를 깨지 않는가
- catalog에 진단지 항목을 중복 데이터 없이 등록할 수 있는가

기술 요구사항에는 보통 다음을 넣는다.

1. 진단지 catalog 등록 방식 결정
2. 기존 선수학습 entries를 읽어 진단지 항목을 구성
3. compact 렌더러 또는 템플릿 추가
4. A4 2단 CSS와 print 확인
5. `node .claude/scripts/audit.mjs` 실행
6. `node .claude/scripts/validate.mjs 1000` 이상 실행
7. 브라우저에서 단원별 진단지 표시와 페이지 분량 확인

### 새 학년·학기 추가

`new-grade/SKILL.md` 내용을 분석 단계에 통합한다.

확인할 것:

- `CURRICULUM.md`에 학기 단원 목록이 있는가
- 어느 단원까지 구현할지 사용자가 정했는가
- 새 `app/js/generators/gX-Y/` 폴더가 필요한가
- 새 `app/js/catalogs/gX-Y.js`가 필요한가
- `app/js/catalog.js`의 import와 `GRADES` 배열 순서가 어떻게 바뀌는가
- 기존 `app` 폴더 이동 없이 추가만 가능한가

### 카탈로그 점검

`audit-catalog/SKILL.md` 내용을 분석 단계에 통합한다.

실행 또는 확인 후보:

```bash
node .claude/scripts/audit.mjs
node .claude/scripts/validate.mjs 5000
```

보고 항목:

- 깨진 prereq refs
- `ext` → `unitRef` 승격 후보
- 학기·단원 안 라벨 중복
- 선수학습이지만 from 학기 본단원에 미등록된 항목
- 자연수 결과 무결성 위반

### 버그 수정/화면 수정

확인할 것:

- 사용자 흐름: 학년 선택 → 단원 선택 → 연습지 선택 → 새로 만들기 → 정답 보기 → 인쇄
- 데이터와 표현 분리가 깨지는가
- 제너레이터가 HTML을 새로 만들게 되는가
- CSS 변경이 `@media print`에 영향을 주는가
- 문제 수 자동 산정, 정답 표시, 드롭다운 라벨 규칙이 깨지는가

## 위험 점검표

| 점검 항목 | 확인 내용 |
|---|---|
| 기존 약속 | 함수 이름, 학습지 ID, catalog 빌더 규칙, ES Modules 규칙이 깨지는가 |
| 연결 관계 | generator가 표현 계층을 가져오거나 catalog 순환 import 규칙을 깨는가 |
| 데이터 모양 | 기존 학습지 ID, `from`, `prereqs`, `kind/grid/count` 의미를 바꾸는가 |
| 과거 기록 | 기존 출처 매핑이나 사용자 확정 규칙을 뒤집는가 |
| 사용자 흐름 | 드롭다운, 새로 만들기, 정답 보기, 인쇄가 끊기는가 |
| 되돌리기 어려움 | 파일 이동, 배포 설정, 의존성 추가, 대량 삭제가 있는가 |

판정은 `✅ 안전`, `⚠️ 조건부 안전`, `❌ 위험` 중 하나로 둔다. 애매하면 더 보수적으로 판단한다.

## 분석 기록 형식

`context/sessions/YYYY-MM-DD-{요청요약}.md`에 저장한다.

```markdown
# 분석 기록: [요청 요약]

- **일시**: YYYY-MM-DD
- **요구사항 원문**: ...
- **판정**: ✅ 안전 / ⚠️ 조건부 안전 / ❌ 위험

## 영향 범위

| 대상 | 영향 수준 | 상세 |
|---|---:|---|
| ... | 낮음/중간/높음 | ... |

## 현재 상태

- 실제 파일을 읽고 확인한 내용

## 점검 결과

| 점검 항목 | 결과 | 근거 |
|---|---|---|
| 기존 약속 | ✅/⚠️/❌ | 파일 경로와 이유 |

## 기술 요구사항

| 순서 | 작업 유형 | 대상 | 설명 | 의존 순서 |
|---:|---|---|---|---|
| 1 | BUG_FIX/DATA_EDIT/DOC_CHANGE/... | ... | ... | — |

## 검증 계획

- 실행할 명령과 브라우저 확인 항목

## 제시한 대안

- 필요할 때만 작성
```

## 사용자 보고 형식

```markdown
## 분석 결과: ...

### 판정: ✅ 안전하게 진행 가능 / ⚠️ 일부 주의 필요 / ❌ 위험

### 영향 범위
| 기능 | 영향 | 설명 |
|---|---|---|

### 안전한 방법
1. ...

### 다음 단계
이대로 진행할까요? "네"라고 답하시면 구현을 시작합니다.

상세 분석 기록: `context/sessions/...md`
```

