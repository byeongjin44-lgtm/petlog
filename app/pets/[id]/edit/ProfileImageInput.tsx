"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type ProfileImageInputProps = {
  currentImageUrl: string | null;
  alt: string;
};

// 새 사진을 선택하면 저장 전에 미리보기만 보여준다.
// 실제 업로드와 DB 수정은 "수정 완료" 시 Server Action에서 처리한다.
export default function ProfileImageInput({
  currentImageUrl,
  alt,
}: ProfileImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  // 미리보기 URL이 바뀌거나 화면을 벗어나면 메모리 해제
  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // 수정 실패 등으로 form이 reset되면 기존 사진으로 복원
  useEffect(() => {
    const form = inputRef.current?.form;

    if (!form) {
      return;
    }

    function handleReset() {
      setPreviewUrl(null);
    }

    form.addEventListener("reset", handleReset);

    return () =>
      form.removeEventListener("reset", handleReset);
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    setPreviewUrl(
      file ? URL.createObjectURL(file) : null
    );
  }

  function handleCancel() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setPreviewUrl(null);
  }

  const displayUrl = previewUrl ?? currentImageUrl;

  return (
    <>
      {displayUrl ? (
        <img
          src={displayUrl}
          alt={alt}
          className="mb-3 h-32 w-32 rounded-2xl object-cover"
        />
      ) : (
        <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-2xl bg-zinc-100 text-xs text-zinc-400">
          등록된 사진 없음
        </div>
      )}

      {previewUrl && (
        <div className="mb-3 flex items-center gap-3">
          <p className="text-xs font-medium text-amber-600">
            저장 전 미리보기입니다. 수정 완료를 눌러야 반영됩니다.
          </p>

          <button
            type="button"
            onClick={handleCancel}
            className="shrink-0 text-xs font-semibold text-zinc-500 underline hover:text-zinc-900"
          >
            선택 취소
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        id="profile_image"
        name="profile_image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm"
      />
    </>
  );
}
