# 분석 기록: 분수 계산 과정 한 줄 표시와 빈칸 크기 통일

- **일시**: 2026-05-05
- **요구사항 원문**: 사진처럼 분수의 계산 과정이 나오는 모든 학습지는 풀이 과정이 한 줄로 나와야 한다. 현재는 단이 나눠져 있어 짤려 있고 학생이 서술하기 어렵다. 또한 분수의 곱셈과 나눗셈 학습지의 네모 칸 크기가 일정하지 않으므로 적절하면서도 일정하게 맞춘다.
- **판정**: ✅ 안전

## 영향 범위

| 대상 | 영향 수준 | 상세 |
|---|---:|---|
| `app/js/templates.js` | 중간 | `fracStepProblemMultiLine` 구조와 `fracMulStep`/`fracDivStep`, 대분수 일부 단계 풀이가 한 줄 흐름으로 바뀔 수 있음 |
| `app/css/worksheet.css` | 중간 | `.frac-step-flow`, `.frac-multi-line`, `.frac-blank`, `.num-blank`의 배치와 빈칸 크기 규칙 조정 |
| `app/js/layout.js` | 낮음 | 한 줄 풀이가 잘리지 않도록 계산 과정 학습지의 1열 배치/행 높이 설정을 유지하거나 미세 조정 |
| `app/js/catalogs/g5-2.js`, `app/js/catalogs/g6-1.js`, `app/js/catalogs/g6-2.js` | 낮음 | 이미 계산 과정 학습지는 1열 위주 설정을 사용 중이며, 필요하면 문제 수 기본값만 확인 |
| 수학 데이터 생성기 | 없음 | 계산값 자체를 바꾸지 않고 표시 방식만 바꾸는 작업 |

## 점검 결과

| 점검 항목 | 결과 | 근거 |
|---|---|---|
| 기존 약속 | ✅ | 제너레이터는 기존처럼 순수 데이터만 반환하고, 표시 변경은 `templates.js`/CSS에서 처리 가능 |
| 연결 관계 | ✅ | 낮은 층 제너레이터가 HTML 표현을 새로 갖지 않도록 템플릿 계층에서 해결 가능 |
| 데이터 모양 | ✅ | 저장 데이터나 카탈로그 ID를 삭제/변경하지 않음 |
| 과거 기록 | ✅ | 기존 학습지 ID와 선택 흐름은 그대로 유지 가능 |
| 사용자 흐름 | ✅ | 학년/단원/학습지 선택, 새로 만들기, 정답 보기, 인쇄 흐름은 그대로 사용 |
| 되돌리기 어려움 | ✅ | 배포/삭제/외부 의존성 추가 없음. CSS/템플릿 변경이라 되돌리기 쉬움 |

## 현재 상태 요약

- 사진의 지향점은 `2/4 ÷ 1/4 = 2/4 × □/□ = □/□ = □`처럼 한 문제 안에서 계산 과정이 가로로 이어지는 형태다.
- 현재 `app/js/templates.js`의 `fracStepProblemMultiLine()`은 `line1`, `line2`, `line3`을 각각 별도 `<div class="concept-answer frac-step-flow">`로 렌더링한다.
- `T.mixedSeparateStep`, `T.sameMixedAddCarryStep`, `T.sameMixedSubBorrowStep`, `T.fracMulStep`, `T.fracDivStep`이 이 다중 줄 구조를 사용한다.
- `app/css/worksheet.css`에는 `.frac-multi-line` 세로 배치와 `.problem-item.frac-mul-step` 전용 줄 간격 규칙이 있어, 곱셈/나눗셈 과정이 사진과 달리 줄 단위로 나뉜다.
- 분수 빈칸은 `.frac-blank .fb-top/.fb-bot`이 `min-width`와 `padding` 중심이라 숫자 자리수에 따라 실제 폭이 달라진다. 반면 `.frac-step-flow .num-blank`은 고정 정사각형에 가깝다. 이 차이가 “네모 칸이 일정하지 않다”는 문제의 핵심이다.

## 기술 요구사항

| 순서 | 작업 유형 | 대상 | 설명 | 의존 순서 |
|---:|---|---|---|---|
| 1 | BUG_FIX | `app/js/templates.js` | 다중 줄 풀이 객체 `{ line1, line2, line3 }`을 한 줄 문자열로 이어 붙이는 공통 조립 방식을 추가하거나 `fracStepProblemMultiLine()`이 한 개의 `frac-step-flow`만 만들도록 변경 | — |
| 2 | THEME_CHANGE | `app/css/worksheet.css` | `.frac-step-flow`가 계산 과정을 한 줄로 유지하도록 `white-space: nowrap`, `flex-wrap: nowrap`, 적절한 gap/line-height를 정리 | 1 |
| 3 | THEME_CHANGE | `app/css/worksheet.css` | 분수 계산 과정 안의 `.frac-blank .fb-top/.fb-bot` 폭과 높이를 고정 규칙으로 맞춰 분자/분모 칸 크기를 일정하게 함 | 1 |
| 4 | THEME_CHANGE | `app/css/worksheet.css` | 곱셈/나눗셈 전용 `.frac-mul-step` 세로 줄 규칙을 제거하거나 한 줄 흐름에 맞게 축소 | 1, 2 |
| 5 | BUG_FIX | `app/js/layout.js` 또는 카탈로그 설정 | 한 줄이 길어지는 계산 과정 학습지는 1열 배치를 유지하고, 잘림이 있으면 기본 문제 수/행 높이 안전값을 조정 | 2 |
| 6 | DOC_CHANGE | `CHANGELOG.md` | 화면/인쇄 표현 변경이므로 날짜별 변경 이력에 짧게 기록 | 1-5 |
| 7 | BUG_FIX | 브라우저 검수 | 사진 기준으로 5-2 분수 곱셈, 6-1/6-2 분수 나눗셈, 5-1/4-2 분수 단계 풀이를 정답 보기/인쇄 기준으로 확인 | 1-6 |

## 제시한 대안

- **권장안**: 계산 과정 템플릿은 모두 한 줄 렌더링으로 통일하고, 긴 식은 학습지 배치를 1열로 보장한다. 사진과 가장 잘 맞고 학생이 옆으로 풀이를 이어 쓰기 좋다.
- **보수안**: 곱셈/나눗셈만 한 줄로 바꾸고 대분수 덧셈/뺄셈의 “자연수·분수 따로” 풀이 3줄은 유지한다. 다만 사용자가 “모든 학습지”라고 했으므로 요구와 덜 맞는다.
- **비권장안**: CSS만 억지로 줄바꿈을 막는다. DOM은 3줄 그대로라 간격과 잘림 문제가 남을 가능성이 크다.

## 검증 계획

- 로컬 정적 서버로 `app/worksheet.html`을 열어 확인한다.
- 5-2 2단원 계산 과정 7종, 6-1 1단원 계산 과정 3종, 6-2 1단원 계산 과정 3종을 우선 확인한다.
- 5-1 5단원과 4-2 1단원의 분수 단계 풀이도 함께 확인해 “모든 분수 계산 과정”의 회귀를 본다.
- 정답 보기 전/후 모두 빈칸 크기가 흔들리지 않는지 확인한다.
- 인쇄 화면에서 한 줄이 오른쪽으로 잘리거나 문제 영역 밖으로 나가지 않는지 확인한다.
