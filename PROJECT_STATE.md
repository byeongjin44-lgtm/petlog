# petLog 프로젝트 상태

> 마지막 갱신: 2026-10-23 (반려동물 섹터 마무리)

## 현재 개발 상태

완료 섹터:

1. 프로젝트 초기 설정
2. Supabase 연결
3. 인증 섹터 (회원가입 / 로그인 / 세션 유지 / 로그아웃 / 접근 보호) — Google 로그인 제외
4. 반려동물 섹터 (CRUD + 프로필 이미지 관리)

다음 작업:

1. **STEP 1-B: 서버 오류 표시, 입력값 검증, 이미지 업로드 보안 및 세션 갱신 검증**
2. 병원·건강 기록 섹터 개발

---

## 1. 프로젝트 개요

프로젝트명: petLog
목적: 반려동물의 일상과 각종 기록을 관리하는 앱

현재 개발 단계: 초기 개발
개발 방식: 1인 개발 + AI 활용

---

## 2. 개발 원칙

- 사용자는 PHP/jQuery 개발 경험이 있음
- Next.js/React는 학습하면서 개발
- 핵심 구조와 기본 기능은 직접 구현하며 학습
- Claude Code는 프로젝트의 기본 구조와 핵심 흐름을 직접 만든 이후 필요한 작업에 활용
- 기능을 한 화면 단위가 아니라 섹터/기능 단위로 개발
- 의미 있는 기능 단위가 완성되면 Git commit + push
- 각 단계에서 왜 이렇게 구현하는지 설명하면서 진행
- 기존 PHP 방식과 Next.js/React 방식의 차이를 비교해서 설명
- 개발 과정에서 임의로 큰 구조를 변경하지 않음
- 기능 구현 전에 현재 프로젝트 구조와 기존 결정을 우선 확인

---

## 3. 기술 스택

- Next.js 16.3.1 (App Router, Server Components, Server Actions)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (Auth, Postgres + RLS, Storage) — `@supabase/ssr`, `@supabase/supabase-js`
- Git / GitHub
- Claude Code

---

## 4. 현재 Git 상태

GitHub 저장소:
https://github.com/byeongjin44-lgtm/petlog

브랜치: main
원격 저장소: origin → https://github.com/byeongjin44-lgtm/petlog.git

주요 커밋:

- baf58fb — chore: initial commit
- 4c2cb84 — feat: petLog 메인 페이지 구현
- 7d4a48a — feat: 로그인 페이지 구현
- 652d580 — feat: petLog Project_STATE 설정
- 6cf5105 — feat: 로그인관련 db연결 및 신세계탐방
- 6761e48 — feat: 로그인 세션 유지 및 서버 인증 처리
- f72859e — feat: 로그인 상태에 따른 페이지 접근 보호
- d7d70c7 — feat: 반려동물 CRUD 및 프로필 이미지 관리 구현
- (이 문서를 포함한 커밋) — feat: complete pet profile management and UX improvements

---

## 5. 현재 프로젝트 구조

```
app/
├── globals.css
├── layout.tsx
├── page.tsx                      # 메인 (로그인 상태 표시, 로그아웃)
├── components/
│   ├── LogoutButton.tsx          # 로그아웃 (Client)
│   └── DateInput.tsx             # 클릭 시 달력이 열리는 날짜 입력 (Client)
├── login/
│   └── page.tsx
├── signup/
│   └── page.tsx
└── pets/
    ├── page.tsx                  # 목록
    ├── new/
    │   └── page.tsx              # 등록 (Server Action)
    └── [id]/
        ├── page.tsx              # 상세 + 삭제 (Server Action)
        ├── DeletePetButton.tsx   # 삭제 확인창 (Client)
        └── edit/
            ├── page.tsx          # 수정 (Server Action)
            └── ProfileImageInput.tsx  # 사진 선택 미리보기 (Client)
lib/
└── supabase/
    ├── client.ts                 # 브라우저용 Supabase Client
    └── server.ts                 # 서버용 Supabase Client (cookie 기반)
docs/
└── database/
    └── pets_baseline_reference.sql   # 참고용 스키마 문서 (실행 금지)
```

---

## 6. 현재 구현 상태

### 초기 환경
- [x] Next.js 프로젝트 생성
- [x] Git 초기화
- [x] GitHub 연결
- [x] main 브랜치 설정
- [x] 첫 commit / push

### 메인 섹터
- [x] petLog 메인 화면
- [x] metadata 변경
- [x] 한국어 설정
- [x] 로그인 페이지 이동
- [x] 회원가입 페이지 이동

### 인증 섹터
- [x] 로그인 화면 UI
- [x] 회원가입 화면 UI
- [x] Supabase 프로젝트 연결
- [x] 회원가입 기능
- [x] 로그인 기능
- [x] 서버 측 Supabase Client 구성
- [x] 로그인 사용자 서버 측 확인
- [x] 세션 유지
- [x] 새로고침 후 로그인 상태 유지 확인
- [x] 로그아웃
- [x] 로그인 상태에 따른 페이지 접근 보호
- [ ] Google 로그인 실제 연동 (버튼 UI만 존재)

### 반려동물 섹터
- [x] pets 테이블 생성
- [x] 사용자별 RLS 적용 (RLS 활성화 및 정책 4종 존재 확인)
- [x] 로그인 사용자별 반려동물 목록
- [x] 반려동물 등록
- [x] 반려동물 상세
- [x] 반려동물 수정
- [x] 반려동물 삭제 (삭제 확인창)
- [x] 등록 시 중성화 여부(neutered) 저장 누락 수정
- [x] 프로필 이미지 업로드
- [x] 프로필 이미지 교체 (DB 수정 성공 후 이전 파일 삭제)
- [x] 등록/수정 실패 시 새로 업로드한 이미지 정리
- [x] 반려동물 삭제 시 Storage 이미지 삭제
- [x] Storage 사용자별 폴더 구조 적용 (`{user_id}/{uuid}.{ext}`)
- [x] 이미지 DB 저장 방식 URL → Storage object path 전환 (`profile_image_path`)
- [x] 생년월일 입력칸 전체 클릭 시 달력 열림 (`showPicker()`)
- [x] 프로필 사진 변경 시 저장 전 미리보기 / 선택 취소

### 앨범 섹터
- [ ] 사진 업로드
- [ ] 사진 목록
- [ ] 사진 상세
- [ ] 사진 삭제

### 병원/건강기록 섹터
- [ ] 병원 기록
- [ ] 진료 기록
- [ ] 예방접종 기록
- [ ] 건강 관련 기록

---

## 7. 검증 기록

### 브라우저 실사용 테스트 (2026-10-23, localhost:3000, 사용자 확인 통과)
- 로그인 및 세션 유지
- 기존 반려동물 목록·상세 표시
- 신규 반려동물 등록 (이미지 포함, 중성화 여부 저장)
- 프로필 이미지 업로드 / 교체 / 저장 전 미리보기 / 선택 취소
- 정보 수정 (사진 미선택 시 기존 사진 유지)
- 삭제 확인창과 삭제 처리 (테스트 전용 데이터로만 수행)
- 다른 사용자 계정에서 접근 차단
- 등록/수정 화면 생년월일 달력 열림

### 정적 검사
- `npm run lint` (오류 0, `<img>` 사용 경고 3), `npx tsc --noEmit`, `npm run build` 통과

### Supabase 실제 DB 상태 (사용자 SQL Editor 확인)
- `pets.profile_image_path` 존재, `profile_image` 컬럼 없음
- pets RLS 활성화, 사용자별 SELECT/INSERT/UPDATE/DELETE 정책 4종 존재
- `pet-images` Storage 정책 4종 존재
- `pet-images` 버킷 Public, 파일 크기·MIME 제한 미설정
- 기존 URL 방식 데이터 0건 (데이터 변환 불필요)

### 미검증 / 미완료
- pets 컬럼 타입·기본값·제약조건, RLS·Storage 정책의 실제 정의와 참고 문서의 일치 여부
- Supabase CLI 기반 정식 baseline 및 migration history 구축
- 액세스 토큰 만료(약 1시간) 이후 세션 갱신 동작

---

## 8. 다음 작업

### STEP 1-B: 서버 오류 표시, 입력값 검증, 이미지 업로드 보안 및 세션 갱신 검증
1. Server Action 실패 시 화면에 오류 표시 (`useActionState`, 개발 중 `error.message` 노출)
2. 목록 조회 실패와 "등록된 반려동물 없음" 구분, 상세/수정의 일반 오류와 404 구분
3. 서버 측 입력값 검증 (species·gender 허용값, weight 숫자/음수, 필수값)
4. 이미지 업로드 보안 (MIME·확장자·용량 검증, 버킷 크기/MIME 제한 검토)
5. 세션 갱신 검증 및 `proxy.ts` 도입 여부 결정
6. 이미지 고아 파일 처리 방안 검토

### 이후: 병원·건강 기록 섹터
1. hospital_records 데이터 모델 설계
2. pets 관계 및 삭제 정책(FK cascade / soft delete) 결정
3. 향후 places 연동 구조 고려
4. RLS 설계
5. 병원 기록 등록 / 목록 / 상세 / 수정 / 삭제
6. 다음 진료 예정일
7. 향후 알림 기능 연결
8. 병원 첨부자료 구조

### 기타 미완료
- Google 로그인 실제 연동
- 프로필 이미지만 단독 삭제
- 메인 ↔ 반려동물 화면 간 네비게이션
- Supabase CLI 기반 migration history 구축

---

## 9. 장기 아키텍처 방향

petLog는 초기 반려동물 기록 기능에서 시작하지만 다음 기능까지 확장 가능한 플랫폼 구조를 목표로 한다.

### 개인 반려동물 관리
- 반려동물 프로필
- 병원/진료 기록
- 예방접종/건강 기록
- 미용 기록
- 사진 앨범
- 일정 및 알림

### 커뮤니티
- 자유게시판
- 병원 관련 게시판
- 반려동물 동반 장소 후기
- 여행 후기
- 댓글 및 반응

### 장소 데이터
- 동물병원
- 반려동물 동반 음식점/카페
- 반려동물 동반 숙박시설
- 반려동물 동반 관광지
- 기타 반려동물 관련 장소

장소 데이터는 장기적으로 공통 places 계층을 중심으로 관리한다.

### 데이터 확보

서비스 운영자가 모든 장소 데이터를 직접 입력하는 구조에 의존하지 않는다.

향후 다음 데이터 유입 경로를 고려한다.

- 공공데이터
- 공식/허용된 외부 API
- 이용이 허용된 외부 데이터 수집
- 사용자 직접 등록
- 사용자 게시글 및 후기
- 업체 직접 등록
- AI를 이용한 게시글 정보 추출

수집 데이터는 원본 → 정규화 → 검증 → 서비스 데이터 반영 단계를 구분한다.

사용자 게시글이나 AI 추출 결과는 검증 없이 공식 장소 데이터를 직접 변경하지 않는다.

### GPS 및 여행 기능

places의 위치 데이터를 기반으로 향후 다음 기능을 지원할 수 있도록 한다.

- 현재 위치 주변 장소 검색
- 거리 기반 검색
- 지역별 반려동물 동반 장소 조회
- 반려동물 조건 기반 장소 필터
- 여행지/음식점/숙소 조합
- 지역별 반려동물 동반 여행 경로 추천

### 핵심 데이터 관계

```
auth.users
→ pets
→ 각종 개인 기록

users / pets
→ posts / reviews
→ places

외부 데이터
→ 수집/정규화/검증
→ places

places
→ GPS 검색
→ 추천
→ 여행 경로
```

---

## 10. 중요한 Next.js 학습 내용

### App Router

URL과 페이지 구조는 app 디렉터리를 기준으로 한다.

- app/page.tsx → /
- app/login/page.tsx → /login
- app/signup/page.tsx → /signup
- app/pets/[id]/page.tsx → /pets/{id} (동적 라우트, `params`는 Promise)

page.tsx는 해당 경로의 페이지 역할을 한다.

layout.tsx는 여러 페이지에서 공유되는 공통 레이아웃 역할을 한다.

일반적인 .tsx 파일은 재사용 가능한 React 컴포넌트로 사용할 수 있다.

### Server / Client Component
- 페이지는 기본적으로 Server Component로 두고, 브라우저 동작(클릭, 미리보기 등)이 필요한 부분만 작은 Client Component(`"use client"`)로 분리한다.
- 함수를 `<form action>`으로 사용할 때는 `encType`, `method`를 지정하지 않는다. (React가 파일 포함 FormData를 자동 전송)

---

## 11. PHP 개발자 관점

사용자는 PHP 개발 경험이 있기 때문에 Next.js/React의 개념을 설명할 때 PHP와 비교해서 설명한다.

단, PHP include와 React Component는 완전히 동일한 개념이 아니므로 개념 이해를 위한 비교로만 사용한다.

---

## 12. Git 사용 규칙

기능 개발이 완료되고 정상 작동을 확인하면 관련 파일만 명시적으로 스테이징하여 commit / push 한다.

```
git add <관련 파일>
git commit -m "type: 기능 설명"
git push
```

기능 단위로 commit한다. 화면 하나를 만들 때마다 무조건 commit하지 않는다.

예:
- 메인 섹터 완료 → commit
- 인증 섹터 완료 → commit
- 반려동물 섹터 완료 → commit
- 앨범 섹터 완료 → commit

큰 기능 변경이나 위험한 작업의 경우 필요하면 중간 commit을 추가한다.

PROJECT_STATE.md는 기능 섹터가 완료된 시점에 업데이트하며, 해당 섹터의 코드 변경사항과 함께 하나의 commit으로 관리한다.
기능 개발이 완료되기 전에는 PROJECT_STATE.md만 별도로 commit하지 않는다.

---

## 13. 개발 진행 방법

1. 현재 프로젝트 상태 확인
2. 이번 섹터의 목표 확인
3. 필요한 구조 설명
4. 코드 구현
5. 브라우저에서 테스트
6. 오류 수정
7. 섹터 완료
8. PROJECT_STATE.md 업데이트 (GitHub에서 읽은 후 수정사항만 업데이트)
9. 필요한 경우 DEVELOPMENT_RULES.md 업데이트
10. Git commit
11. Git push

---

## 14. 대화 연속성 규칙

다른 채팅에서 petLog 개발을 이어갈 경우 이 파일을 먼저 확인한다.

새로운 작업을 시작하기 전에:
- 현재 구현 상태
- 현재 진행 중인 섹터
- 완료된 기능
- Git 상태
- 중요한 결정사항
- 다음 작업

을 확인한다.

기존 결정과 충돌하는 새로운 제안을 할 경우 먼저 기존 결정사항을 확인하고 사용자에게 설명한다.
