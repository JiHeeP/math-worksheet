# 분석 기록: 1-2-7단원 가르기 칸과 최종 답 칸 용어 확인

- **일시**: 2026-05-04
- **요구사항 원문**: 세로셈 최종 답 자리에는 네모가 필요 없으며, 1-2-7단원 가로 연습 전반에서 가르기 칸과 최종 답 네모칸이 맞지 않는다. 디자인 코드를 분석해 가르기 칸과 최종 답 네모칸을 부르는 용어를 확인한다.
- **판정**: ⚠️ 조건부 안전

## 영향 범위

| 대상 | 영향 수준 | 상세 |
|---|---|---|
| `app/js/generators/g1-2/u7.js` | 높음 | 원본 연습형 가로/세로 문제 HTML을 직접 만든다. |
| `app/js/helpers.js` | 중간 | `splitDiagramHtml()`이 가르기 다이어그램과 가르기 칸을 만든다. |
| `app/js/templates.js` | 중간 | 일반 가르기 풀이 템플릿은 최종 답을 `numBlank()`로 만든다. |
| `app/css/worksheet.css` | 높음 | 가르기 칸과 답 칸의 실제 크기/정렬을 결정한다. |

## 용어와 클래스

| 화면상 의미 | HTML/CSS 이름 | 생성 위치 | CSS 위치 |
|---|---|---|---|
| 가르기 전체 묶음 | `.split-container` | `helpers.js` `splitDiagramHtml()` | `worksheet.css` |
| 가르기 대상 숫자 | `.split-target-num` | `helpers.js` `splitDiagramHtml()` | `worksheet.css` |
| 가르기 가지선 | `.split-line-svg` | `helpers.js` `splitDiagramHtml()` | `worksheet.css` |
| 가르기 두 칸 묶음 | `.bottom-boxes` | `helpers.js` `splitDiagramHtml()` | `worksheet.css` |
| 가르기 숫자 칸 | `.small-box` | `helpers.js` `splitDiagramHtml()` | `worksheet.css` |
| 가로 연습 최종 답 네모칸 | `.origin-answer-box` | `g1-2/u7.js` `splitPracticeProblem()` | `worksheet.css` |
| 일반 템플릿 최종 답칸 | `.num-blank` | `helpers.js` `numBlank()` | `worksheet.css` |
| 세로셈 최종 답 줄 | `.origin-answer-row` | `g1-2/u7.js` `cherryPracticeProblem()` | `worksheet.css` |
| 세로셈 가르기 칸 | `.origin-input-circle` | `g1-2/u7.js` `cherryPracticeProblem()` | `worksheet.css` |

## 점검 결과

| 점검 항목 | 결과 | 근거 |
|---|---|---|
| 기존 약속 | ⚠️ | `design.md`는 가로셈 가르기 칸과 최종 답 칸의 동일 크기를 요구하지만, 코드상 최종 답칸이 `.origin-answer-box`와 `.num-blank`로 나뉜다. |
| 연결 관계 | ⚠️ | 1-2-7단원 가로 연습은 `g1-2/u7.js`가 직접 HTML을 만들고, 일반 가르기 풀이는 `templates.js`가 HTML을 만든다. |
| 데이터 모양 | ✅ | 계산 데이터 자체가 아니라 HTML/CSS 표현 문제다. |
| 사용자 흐름 | ⚠️ | 인쇄용 화면에서 칸 크기와 정렬이 틀어져 사용자에게 바로 보이는 문제다. |

## 기술 요구사항

| 순서 | 작업 유형 | 대상 | 설명 | 의존 순서 |
|---|---|---|---|---|
| 1 | THEME_CHANGE | `worksheet.css` | `.small-box`, `.origin-answer-box`, `.origin-equation-row .num-blank`의 크기 기준을 하나로 묶고 정렬 기준을 통일한다. | - |
| 2 | BUG_FIX | `g1-2/u7.js` | 가로 연습 세 종류가 모두 같은 가르기/답칸 체계를 쓰는지 확인한다. 세로셈 `.origin-answer-row`는 네모칸으로 만들지 않는다. | 1 |
| 3 | BUG_FIX | `helpers.js`/`templates.js` | 일반 가르기 풀이의 `numBlank()`가 가로 연습 답칸과 같은 시각 크기를 갖는지 확인한다. | 1 |
| 4 | VERIFY | 생성 HTML/CSS | 1-2-7단원 가로 연습 3종과 일반 가르기 풀이 3종을 생성해 클래스와 크기 기준을 검증한다. | 1-3 |

## 제시한 대안

- 세로셈 답 자리는 `.origin-answer-row`로 유지하고 네모칸화하지 않는다.
- 가로셈에서만 “쓰기 네모칸” 기준을 `--write-box-size` 하나로 통일한다.
- “최종 답칸”이라는 말이 코드에서 두 이름으로 흩어져 있으므로 구현 시 `.origin-answer-box`와 `.origin-equation-row .num-blank`를 함께 점검한다.
