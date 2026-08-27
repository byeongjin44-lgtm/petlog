"use client";

type DeletePetButtonProps = {
  deleteAction: () => Promise<void>;
};

export default function DeletePetButton({
  deleteAction,
}: DeletePetButtonProps) {
  return (
    <form
      action={deleteAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "정말 이 반려동물을 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다."
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="w-full rounded-xl border border-red-200 bg-white py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        반려동물 삭제
      </button>
    </form>
  );
}