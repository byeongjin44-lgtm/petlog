-- ============================================================
-- petLog pets baseline (참고용 문서 — 실행 금지)
-- ============================================================
-- ⚠ 이 파일은 migration이 아니다. 어떤 DB에도 실행하지 않는다.
--   (SQL Editor 실행, supabase db push / db reset / migration repair 대상 아님)
--
-- 이 파일은 기존 Supabase Dashboard에서 이미 생성된 pets 구조를
-- Git에서 참고할 수 있도록 기록한 초안이다.
-- 운영 DB에 실행하면 "relation already exists" 오류가 발생한다.
--
-- 검증 상태 (2026-10-23, 사용자 SQL Editor 확인 기준)
--   [확인됨]
--   - pets.profile_image_path 컬럼 존재, profile_image 컬럼 없음
--   - pets RLS 활성화
--   - pets 사용자별 SELECT/INSERT/UPDATE/DELETE 정책 4종 존재
--   - pet-images Storage 정책 4종 존재
--   - pet-images 버킷 Public, 파일 크기/MIME 제한 미설정
--   [실제 DB와 대조하지 않음]
--   - 아래 컬럼들의 데이터 타입, 기본값, NOT NULL, FK(on delete cascade)
--   - 아래 정책 이름 및 조건식(using / with check)
--   - Storage 정책의 실제 정의 (아래에는 주석으로만 기록)
--
-- 정식 baseline 및 migration history는 추후 Supabase CLI로
-- 실제 DB에서 추출하여 supabase/migrations에 구축한다. (미완료)
-- ============================================================

create table public.pets (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null,
  species text not null,
  breed text,
  gender text,
  neutered boolean,
  birth_date date,
  weight numeric,
  profile_image_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pets enable row level security;

-- ------------------------------------------------------------
-- pets RLS 기본 정책
-- ------------------------------------------------------------

create policy "Users can view own pets"
on public.pets
for select
using (auth.uid() = user_id);

create policy "Users can insert own pets"
on public.pets
for insert
with check (auth.uid() = user_id);

create policy "Users can update own pets"
on public.pets
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own pets"
on public.pets
for delete
using (auth.uid() = user_id);


-- ============================================================
-- pet-images Storage 구조
-- ============================================================
--
-- bucket:
--   pet-images
--
-- object path:
--   {auth.uid()}/{random-uuid}.{extension}
--
-- example:
--   11111111-1111-1111-1111-111111111111/
--   aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg
--
-- pets.profile_image_path에는 전체 public URL이 아닌
-- bucket 내부 object path만 저장한다.
--
-- 화면 출력 시:
-- supabase.storage
--   .from("pet-images")
--   .getPublicUrl(profile_image_path)
--
-- Storage 정책은 사용자 UUID 폴더를 기준으로
-- 본인의 파일만 업로드/수정/삭제할 수 있도록 구성한다.
-- ============================================================