import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeletePetButton from "./DeletePetButton";

type PetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PetDetailPage({
  params,
}: PetDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: pet, error } = await supabase
    .from("pets")
    .select(
      "id, name, species, breed, gender, neutered, birth_date, weight, profile_image_path"
    )
    .eq("id", id)
    .single();

  if (error || !pet) {
    notFound();
  }

  const imageUrl =
    pet.profile_image_path
      ? supabase.storage
          .from("pet-images")
          .getPublicUrl(
            pet.profile_image_path
          ).data.publicUrl
      : null;

  const speciesText =
    pet.species === "dog"
      ? "강아지"
      : pet.species === "cat"
        ? "고양이"
        : "기타";

  const genderText =
    pet.gender === "male"
      ? "수컷"
      : pet.gender === "female"
        ? "암컷"
        : "미등록";

  async function deletePet() {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // RLS를 통과한 본인의 pet만 조회 가능
    const {
      data: currentPet,
      error: currentPetError,
    } = await supabase
      .from("pets")
      .select("id, profile_image_path")
      .eq("id", id)
      .single();

    if (currentPetError || !currentPet) {
      notFound();
    }

    // DB 데이터를 먼저 삭제
    const { error: deleteError } =
      await supabase
        .from("pets")
        .delete()
        .eq("id", id);

    if (deleteError) {
      console.error(
        "반려동물 삭제 실패:",
        deleteError
      );
      return;
    }

    // DB 삭제가 성공한 후 Storage 이미지 정리
    if (currentPet.profile_image_path) {
      const { error: removeError } =
        await supabase.storage
          .from("pet-images")
          .remove([
            currentPet.profile_image_path,
          ]);

      if (removeError) {
        console.error(
          "프로필 이미지 삭제 실패:",
          removeError
        );
      }
    }

    redirect("/pets");
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-xl px-6 py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/pets"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
          >
            ← 내 반려동물
          </Link>

          <Link
            href={`/pets/${pet.id}/edit`}
            className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            정보 수정
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={pet.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-zinc-100 text-zinc-400">
              등록된 사진 없음
            </div>
          )}

          <div className="p-6">
            <h1 className="text-3xl font-bold text-zinc-900">
              {pet.name}
            </h1>

            <p className="mt-2 text-zinc-500">
              {speciesText}
              {pet.breed
                ? ` · ${pet.breed}`
                : ""}
            </p>

            <div className="mt-8 space-y-4 border-t border-zinc-100 pt-6">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">
                  성별
                </span>

                <span className="text-sm font-medium text-zinc-900">
                  {genderText}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">
                  중성화
                </span>

                <span className="text-sm font-medium text-zinc-900">
                  {pet.neutered === null
                    ? "미등록"
                    : pet.neutered
                      ? "완료"
                      : "안 함"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">
                  생년월일
                </span>

                <span className="text-sm font-medium text-zinc-900">
                  {pet.birth_date ?? "미등록"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">
                  현재 체중
                </span>

                <span className="text-sm font-medium text-zinc-900">
                  {pet.weight !== null
                    ? `${pet.weight} kg`
                    : "미등록"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DeletePetButton
            deleteAction={deletePet}
          />
        </div>
      </section>
    </main>
  );
}