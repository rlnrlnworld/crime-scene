# 🔍 크라임씬

> SQL로 사건 로그를 파헤쳐 범인을 지목하는 **브라우저 추리 게임**입니다.
> Postgres가 브라우저 안에서 돌아가므로 서버 없이 쿼리를 직접 실행하며 풉니다.

🔗 **플레이:** https://crimescene-six.vercel.app
🗓 **기간:** 2026.08.27 – 08.31
👤 **역할:** 1인 개발 (사건 시나리오 · 데이터 설계 · UI/UX · 프론트)

---

## 🧭 한눈에 보기

| 구분 | 내용 |
| --- | --- |
| **무엇을** | 사건 파일을 열면 교통카드 태그 · CCTV · 진술 같은 테이블이 주어지고, SQL을 짜서 범인을 찾는 게임 |
| **왜** | SQL 학습을 "문제 풀이"가 아니라 "추리"로 바꿔보고 싶었음. JOIN · 시간창 필터 · GROUP BY를 사건 해결 수단으로 쓰게 됨 |
| **핵심 포인트** | 난이도 ★3 이상은 범인이 진술에서 **알리바이를 위증**함. 진술만 믿으면 오답, 로그와 대조해야 반박 가능 |

---

## 🗂 사건

| 사건 | 난이도 | 핵심 기술 |
| --- | --- | --- |
| 카페 Noir 살인사건 | ★ | 단일 JOIN, 진술은 모두 참 |
| 아뜰리에 도난 | ★★ | 다중 JOIN, 시간창 필터, 후보 여럿 |
| 지하철 실종 | ★★★ | 교통카드 태그 · CCTV 로그로 **위증 반박**, 미행 패턴 추적 |

---

## ✨ 주요 기능

**🖥 데스크톱 메타포 UI**
- 사건 파일 = 데스크톱 아이콘. 드래그로 배치, 위치 저장 여부는 설정에서 선택
- 사건 창 이동 · 최소화 · 종료. 손그림 테두리 + 하드 섀도우의 와이어프레임 톤

**🧪 SQL 콘솔**
- Monaco 에디터, `Cmd/Ctrl + Enter`로 실행
- 결과 테이블 + 실행 시간 표시, 스키마 패널에서 테이블 · 컬럼 · 설명 확인
- 사건별 시작 쿼리 제공

**🕵️ 추리 도구**
- 힌트 3단계 순차 공개 (뒤로 갈수록 구체화)
- 사건 수첩: 메모를 남기며 추리
- 용의자 피커: 아바타 그리드에서 범인 선택, 사건에 따라 시각 · 방법 등 추가 답안 필드
- 정답 시 해결 스토리 오버레이, 오답 시 재도전. 해결 기록 · 초기화

**📊 분석**
- Vercel Web Analytics 커스텀 이벤트: `case_opened` · `case_solved` · `case_wrong` · `hint_revealed` · `notebook_note_added` · `case_reset`

---

## 🧩 기술적 결정

| 결정 | 이유 |
| --- | --- |
| **PGlite(Postgres WASM)로 브라우저 안에서 DB 실행** | 서버 · 인증 · 요금 없이 진짜 Postgres 문법(`DATE`, `TIME`, 윈도우 함수 등)을 쓸 수 있음. 학습 게임엔 "진짜 DB와 같은 에러 메시지"가 중요했음 |
| 사건 열 때마다 **public 스키마 전체 DROP 후 재시드** | 사건 간 테이블 이름이 겹쳐도 격리됨. 사용자가 `DROP TABLE`을 해도 다시 열면 복구 |
| **사건 = 하나의 TS 파일** (`src/cases/<slug>.ts`) | 시나리오 · 시드 SQL · 스키마 설명 · 힌트 · 정답이 한 곳에 있어 사건 추가가 파일 하나로 끝남. 타입(`Case`)이 누락 필드를 잡아줌 |
| 정답 검증은 **클라이언트에서** | 토이 프로젝트 범위. 정답이 번들에 포함되는 건 알고 선택한 트레이드오프 |
| 진행 상태는 **localStorage** | 해결 기록 · 힌트 공개 상태 · 수첩 · 아이콘 위치 · 설정. 로그인 없이 바로 플레이 |

---

## 🛠 기술 스택

| 영역 | 선택 |
| --- | --- |
| 프론트 | React 19 · TypeScript · Vite 8 · Tailwind v4 |
| DB | `@electric-sql/pglite` (Postgres in WASM) |
| 에디터 | `@monaco-editor/react` |
| 기타 | react-markdown (스토리 렌더링) · lucide-react · Vercel Analytics · oxlint |
| 폰트 | Balsamiq Sans · JetBrains Mono |
| 배포 | Vercel |

---

## 📂 구조

```
src/
  cases/
    types.ts             Case · CaseSchema · SolutionField · PersonProfile
    index.ts             사건 등록 (여기 넣어야 데스크톱에 뜸)
    cafe-murder.ts · atelier-theft.ts · metro.ts
  components/
    Desktop.tsx          아이콘 그리드, 드래그 배치
    CaseWindow.tsx       사건 창 (이동 · 최소화 · 종료)
    CaseView.tsx         스토리 · 스키마 · 콘솔 · 답안 레이아웃
    SqlEditor.tsx        Monaco 래퍼
    ConsoleResultSplit.tsx · ResultTable.tsx
    HintsModal · NotebookModal · SuspectPickerModal · SolvedOverlay · SettingsModal · HelpModal
  lib/
    db.ts                PGlite 싱글턴, resetDb, runQuery
    history.ts · notes.ts · settings.ts · desktop-layout.ts   localStorage
public/avatars/          용의자 아바타 svg
```

---

## 🚀 실행

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint      # oxlint
```

Node 22 (`.nvmrc`).

---

## 📄 라이선스

[MIT](./LICENSE)
