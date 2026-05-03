---
description: 새 학년·학기 카탈로그 + generators 폴더 스캐폴드 생성. 사용자가 학기 ID(예 "g6-1") 와 단원 목록을 알려주면 자동으로 파일 만들고 catalog.js GRADES 배열에 등록.
---

# /new-grade — 새 학기 추가

## 입력
- 학기 ID: `gN-M` 형식 (예: `g6-1`, `g4-1`)
- 추가할 단원 목록 (사용자 확인)

## 절차

### 1. CURRICULUM.md 확인
[CURRICULUM.md](../../CURRICULUM.md) 의 "학기별 단원 정렬" 섹션에서 해당 학기 단원 목록 확인. 사용자에게 어떤 단원부터 만들지 묻기.

### 2. 폴더 생성
```bash
mkdir -p app/js/generators/g{학기}
```

### 3. 카탈로그 파일 생성

`app/js/catalogs/g{학기}.js`:

```js
'use strict';

/**
 * {학년}학년 {학기}학기 카탈로그.
 *
 * 현재 구현 단원: ...
 * 미구현: ...
 */

import { defineUnit, 차시, 학습지 } from '../catalog.js';

// generator import 들 (단원 추가 시 같이 추가)

const GRADE_ID = 'g{학기}';

// 단원 정의는 사용자 확인 후 추가

export const meta = {
  id: GRADE_ID,
  short: '{학년}-{학기}',
  name: '{학년}학년 {학기}학기',
  units: {
    // u1: { short: '1단원', name: '...' }, ...
  },
};

export const entries = [];
export const pdfMap = {};
export const pdfGenerators = {};
```

### 4. catalog.js GRADES 배열 등록

학년·학기 순서를 지키며 import 추가:

```js
import * as g{학기_underscore} from './catalogs/g{학기}.js';

const GRADES = [..., g{학기_underscore}, ...];  // 순서 유지
```

### 5. 단원별 generator 작성 (사용자 요청 시)

각 단원에 대해:
- `app/js/generators/g{학기}/u{단원번호}.js` 작성
- 자연수 결과 무결성 보장 (음수/0/소수 X) — CLAUDE.md "수학 결과 무결성" 절 참고
- 카탈로그 파일에 import 추가 + `defineUnit` 블록 작성
- 받아올림/내림 같은 단계 풀이가 필요하면 [CLAUDE.md](../../CLAUDE.md) "분수 계산 단계 풀이" 표 참고하여 적절한 T 템플릿 사용

### 6. 검증

```bash
node .claude/scripts/validate.mjs 1000
```

학습지 수가 늘어나고 위반 0건이면 성공.

### 7. 완료 보고
- 새 학기 + 단원 + 학습지 수 표로 정리
- 사용자에게 commit/push 진행 여부 확인 (auto mode 면 그냥 진행)

## 자주 발생하는 실수
- ❌ catalog.js 의 GRADES 배열에 새 학기를 빼먹음 → 드롭다운에 안 나타남
- ❌ generator 가 horizProblem 사용했는데 catalog 에서 `kind: 'pdf'` 지정 → 두 개 충돌
- ❌ 분수 계산에서 do-while 없이 음수 결과 가능 → CLAUDE.md 무결성 규칙 어김
- ❌ unit ID 충돌은 학기 prefix 가 자동 부착되므로 학기 안에서만 유일하면 됨
