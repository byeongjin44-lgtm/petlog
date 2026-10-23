"use client";

import { MouseEvent } from "react";

type DateInputProps = {
  id: string;
  name: string;
  defaultValue?: string;
  className?: string;
};

// 입력칸 어디를 클릭해도 달력이 열리도록 하는 날짜 입력
// showPicker()를 지원하지 않는 브라우저에서는 기본 date input으로 동작한다.
export default function DateInput({
  id,
  name,
  defaultValue,
  className,
}: DateInputProps) {
  function handleClick(
    event: MouseEvent<HTMLInputElement>
  ) {
    const input = event.currentTarget;

    if (!("showPicker" in input)) {
      return;
    }

    try {
      input.showPicker();
    } catch {
      // 이미 열려 있거나 브라우저가 허용하지 않는 경우 기본 동작 유지
    }
  }

  return (
    <input
      id={id}
      name={name}
      type="date"
      defaultValue={defaultValue}
      onClick={handleClick}
      className={className}
    />
  );
}
