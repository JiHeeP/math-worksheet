---
description: 기존 학기·단원에 학습지 1개 추가. generator 함수 작성 + catalog 등록 + 회귀 테스트까지 일괄.
---

# /new-worksheet — 학습지 1개 추가

## 입력 (대화로 확인)

1. **학기**: 어느 학기? (구현된 학기 목록 보여주기)
2. **단원**: 그 학기의 어느 단원? (해당 학기의 units 보여주기)
3. **구분**: 본단원 / 선수학습?
4. **라벨**: 학습지 표시 이름 (예: "두 자리 수 ÷ 한 자리 수 (나머지 없음)")
5. **종류**:
   - **단순 한 줄** (`horizProblem`): "5 + 3 = ___" 형태
   - **세로셈** (PDF): 자릿수 칸 형태. 기존 PDF generator 키 (add_2d, mul_2d1d 등) 매핑
   - **단계 풀이** (T 템플릿): 받아올림/내림이 있는 분수 등
   - **기타** (htmlProblem): 직접 HTML 조립
6. **선수학습이면**: 출처 학기 ID (`from: 'gX-Y'`)
7. **선수학습 의존성**: prereqs 가 있나? (sheetRef / unitRef / ext)

## 절차

### 1. Generator 함수 작성

`app/js/generators/g{학기}/u{단원}.js` 의 적절한 위치에 함수 추가.

#### 자연수 계산 invariant 체크리스트
- ❌ 음수 결과 안 나오나? (예: `a - b - c` 에서 `a > b + c` 강제)
- ❌ 0 결과 안 나오나?
- ❌ 소수/분수 결과 안 나오나? (정수 나눗셈은 `q × d` 형태로 강제)
- ❌ 중간 계산이 음수 안 되나?

분수 계산이면 do-while 로 결과 양수 강제. CLAUDE.md "수학 결과 무결성" 절 참고.

#### Generator 형태별

**단순 한 줄** (가장 흔함):
```js
export function genXxx() {
  const a = rand(...), b = rand(...);
  return horizProblem(`${a} + ${b}`, numBlank(a + b));
}
```

**세로셈**: generator 는 데이터만 반환, PDF generator 키와 매핑.
```js
// generator 함수 자체는 단순 (호출되지 않음 — PDF generator 가 직접 데이터 생성)
// 또는 기존 PDF_GENERATORS_U1 의 함수 재사용
```

**단계 풀이**: generator 는 `{ a, b, ... }` 같은 데이터 객체 반환. 카탈로그에서 T.xxxStep 템플릿과 바인딩.

### 2. Catalog 에 등록

`app/js/catalogs/g{학기}.js` 의 해당 단원 `defineUnit(...)` 안에 학습지 줄 추가:

```js
학습지('라벨', genXxx, {
  id: 'uN_main_xxx',          // 또는 uN_pre_xxx
  // 선수학습이면:
  // from: 'gX-Y',
  // 선수학습 의존:
  // prereqs: [sheetRef('uN_main_yyy'), unitRef('gX-Y', 'uM')],
})
```

세로셈이면 추가로:
- `kind: 'pdf'` 옵션
- 카탈로그 하단 `pdfMap` 에 `'g{학기}_uN_main_xxx': 'pdf_generator_key'` 추가
- `pdfGenerators` 가 PDF_GENERATORS 를 export 하는지 확인

### 3. 검증

```bash
node .claude/scripts/validate.mjs 1000
```

위반 0건 + 학습지 수 +1 확인.

### 4. 사용자에게 보고

| 항목 | 결과 |
|---|---|
| 추가된 학습지 | `[학기] 단원 라벨` |
| 학습지 수 | N → N+1 |
| 회귀 테스트 | ✅ 0건 위반 |
| 커밋 메시지 안 | "feat: ... 학습지 추가" 형식 |

자동으로 commit/push (auto mode 면).

## 자주 헷갈리는 점

- **학습지 ID 는 학기 prefix 자동 부착**: `id: 'u3_main_add'` 만 쓰면 `g{학기}_u3_main_add` 가 됨
- **선수학습 from 매핑 기준**: 2022 개정 교육과정. 추측하지 말고 [CURRICULUM.md](../../CURRICULUM.md) 의 학기별 단원 목록 확인
- **prereqs 의 sheetRef vs unitRef**: 같은 학기 안의 다른 학습지/단원은 각각 sheetRef/unitRef. 다른 학기는 `unitRef('gX-Y', 'uN')` 로 두 인자.
