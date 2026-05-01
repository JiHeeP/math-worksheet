# 수학 학습지 만들기

초등학교 **수학 연습 문제지(워크시트)** 를 자동으로 생성하고 인쇄/PDF로 뽑을 수 있는 웹 도구입니다.
선생님과 학부모가 학생에게 줄 학습지를 빠르게 만들 수 있도록 돕습니다.

## 누구를 위한 것인가요?

- **선생님** — 단원/차시별로 즉석에서 학습지 출력
- **학부모** — 가정 학습용 연습 문제지 인쇄
- **학생** — 자기 주도 학습용

## 어떻게 사용하나요? (사용자)

### 웹에서 바로 쓰기

배포된 사이트에 접속해서 사용합니다. (Netlify 배포)

> 📌 배포 URL은 추후 여기에 추가

### 화면 사용법

1. **단원** 선택 (예: 1단원 자연수의 혼합 계산)
2. **연습지** 선택 (예: 두 자리 수 덧셈)
3. **쪽수**, **문제 수**, **글자 크기** 조정
4. **새로 만들기** 버튼 → 무작위로 새 문제 생성
5. **이어 붙이기** → 같은 종류로 한 페이지 더 추가
6. **정답 보기** → 정답 표시 토글
7. **인쇄** → PDF 저장 또는 종이 인쇄

## 폴더 구조

```
math-worksheet/
├── README.md              ← (이 파일) 프로젝트 안내
├── CLAUDE.md              ← AI 협업 가이드 (Claude/Cursor 등)
├── CHANGELOG.md           ← 변경 이력
├── netlify.toml           ← Netlify 배포 설정 (publish 폴더 지정)
├── docs/
│   └── references/        ← 교육과정 참고 자료 (배포에서 제외)
└── app/                   ← 실제 앱 (Netlify publish 대상)
    ├── ARCHITECTURE.md    ← 코드 구조 상세
    ├── worksheet.html     ← 진입점 (HTML 껍데기)
    ├── _redirects         ← Netlify 라우팅 설정
    ├── css/
    │   └── worksheet.css
    └── js/
        ├── app.js         ← UI 이벤트 + 초기화
        ├── catalog.js     ← 학습지 목록 정의
        ├── templates.js   ← 풀이 과정 템플릿
        ├── renderers.js   ← 문제 렌더링
        ├── layout.js      ← 그리드 레이아웃
        ├── helpers.js     ← HTML 조각 생성
        ├── utils.js       ← 수학 유틸 (rand, gcd, lcm 등)
        └── generators/    ← 단원별 문제 생성기
            └── u1.js ~ u6.js
```

## 기술 스택

- **순수 HTML / CSS / JavaScript (ES Modules)**
- 빌드 도구 없음 (`<script type="module">` 로 브라우저 직접 로딩)
- **배포**: Netlify (정적 파일 호스팅)

학습 부담이 적도록 의도적으로 단순한 구성을 유지합니다.

## 개발자용 안내

### 로컬에서 실행하기

ES Modules는 `file://` 로 직접 열면 CORS 오류가 납니다. 로컬 서버가 필요해요.

```bash
# 방법 1: Python (대부분 macOS/Linux에 기본 설치)
cd app
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000/worksheet.html 접속

# 방법 2: VS Code의 Live Server 확장 사용
# worksheet.html 우클릭 → "Open with Live Server"
```

### 새 학습지 추가하는 법

자세한 절차는 [app/ARCHITECTURE.md](app/ARCHITECTURE.md) 참고.

요약:
1. `js/generators/uN.js` 에 문제 데이터 생성 함수 작성
2. `js/templates.js` 에 적합한 템플릿이 없으면 추가
3. `js/catalog.js` 에 학습지 등록

### 배포

`main` 브랜치에 push 하면 Netlify가 자동 배포합니다.

## 로드맵

- [x] 5학년 1학기 (현재)
- [ ] 1~4학년 확장
- [ ] 6학년 확장
- [ ] 학년 선택 UI 추가
- [ ] 정답지 별도 페이지 출력

## 변경 이력

[CHANGELOG.md](CHANGELOG.md) 에서 확인.
