---
description: 카탈로그 정합성 종합 점검 — 깨진 prereq refs, ext→unitRef 승격 후보, 단원 라벨 중복, 선수학습 갭. .claude/scripts/audit.mjs + validate.mjs 실행.
---

# /audit-catalog — 카탈로그 정합성 종합 점검

## 절차

### 1. 정합성 검사

```bash
node .claude/scripts/audit.mjs
```

다음 4가지를 검사:

1. **깨진 prereq refs** — `resolvePrereq` 가 `[?]` 반환 (대상 학기·단원 없음)
2. **ext → unitRef 승격 후보** — 외부 참조 라벨에 명시된 학기가 이제 구현되어 학기간 unitRef 로 바꿀 수 있는 것
3. **학기 안 학습지 라벨 중복** — 같은 학기·단원에서 동일 라벨 중복 등록
4. **선수학습 미등록** — 5-1 같은 곳에 선수학습으로 등록된 generator 가 from 학기의 본단원에 등록 안 된 경우

### 2. 자연수 결과 무결성 검사

```bash
node .claude/scripts/validate.mjs 5000
```

모든 학습지를 5,000회 무작위 실행 → data-ans 에서 음수/소수/CRASH 발생 학습지 식별.

### 3. 결과 종합

각 검사의 결과를 사용자에게 표로 정리해 보고:

| 검사 | 위반 건수 | 처리 |
|---|---|---|
| 깨진 refs | N | 즉시 수정 필요 |
| ext 승격 후보 | N | 추후 정리 (기능엔 영향 없음) |
| 라벨 중복 | N | 학습지 ID 또는 라벨 정정 |
| 선수학습 미등록 | N | 정보용 (의도적일 수 있음) |
| 자연수 위반 | N | **반드시 수정** (CLAUDE.md 규칙) |

### 4. 자동 수정 제안

ext → unitRef 승격 후보가 있으면 사용자에게 "지금 일괄 승격할까?" 묻고 승인 시:
1. 해당 카탈로그 파일에서 `ext('[X-Y] 단원명')` 을 `unitRef('gX-Y', 'uN')` 로 치환
2. 회귀 테스트로 정상 해결 확인
3. 커밋

자연수 위반이 있으면 위반 학습지의 generator 코드를 보고 invariant 강화 제안 (range 제약 추가, do-while 등).

## 사용 예
```
/audit-catalog

→ "1건 깨진 refs 발견: g5-1_u4_main_dec_cmp 의 [3-1] 분수와 소수 (미구현). 학기 추가 또는 ext 라벨 갱신 필요."
→ "ext 승격 후보 3건. 지금 일괄 승격할까요?"
```
