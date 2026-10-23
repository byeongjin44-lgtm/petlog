import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DateInput from "@/app/components/DateInput";
import ProfileImageInput from "./ProfileImageInput";

type EditPetPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPetPage({
  params,
}: EditPetPageProps) {
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

  // DB에는 path만 저장하고,
  // 화면에 표시할 때만 실제 URL 생성
  const currentImageUrl =
    pet.profile_image_path
      ? supabase.storage
          .from("pet-images")
          .getPublicUrl(
            pet.profile_image_path
          ).data.publicUrl
      : null;

  async function updatePet(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // 수정 직전 DB 상태 다시 조회
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

    const name =
      formData
        .get("name")
        ?.toString()
        .trim();

    const species =
      formData
        .get("species")
        ?.toString();

    const breed =
      formData
        .get("breed")
        ?.toString()
        .trim() || null;

    const gender =
      formData
        .get("gender")
        ?.toString() || null;

    const neuteredValue =
      formData
        .get("neutered")
        ?.toString();

    const neutered =
      neuteredValue === "true"
        ? true
        : neuteredValue === "false"
          ? false
          : null;

    const birthDate =
      formData
        .get("birth_date")
        ?.toString() || null;

    const weightValue =
      formData
        .get("weight")
        ?.toString();

    const weight =
      weightValue
        ? Number(weightValue)
        : null;

    if (!name || !species) {
      console.error(
        "이름과 종류는 필수입니다."
      );
      return;
    }

    const image =
      formData.get("profile_image");

    let profileImagePath =
      currentPet.profile_image_path;

    let newImagePath: string | null = null;

    // 새 이미지를 선택한 경우
    if (
      image instanceof File &&
      image.size > 0
    ) {
      const extension =
        image.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const filePath =
        `${user.id}/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("pet-images")
          .upload(filePath, image, {
            contentType:
              image.type || undefined,
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "새 이미지 업로드 실패:",
          uploadError
        );
        return;
      }

      newImagePath = filePath;
      profileImagePath = filePath;
    }

    const { error: updateError } =
      await supabase
        .from("pets")
        .update({
          name,
          species,
          breed,
          gender,
          neutered,
          birth_date: birthDate,
          weight,
          profile_image_path:
            profileImagePath,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

    if (updateError) {
      console.error(
        "반려동물 수정 실패:",
        updateError
      );

      // 새 이미지는 올라갔는데 DB 수정이 실패했다면
      // 새 이미지 파일을 정리
      if (newImagePath) {
        const { error: removeNewError } =
          await supabase.storage
            .from("pet-images")
            .remove([newImagePath]);

        if (removeNewError) {
          console.error(
            "수정 실패 이미지 정리 실패:",
            removeNewError
          );
        }
      }

      return;
    }

    // DB UPDATE까지 성공한 경우에만
    // 이전 이미지 삭제
    if (
      newImagePath &&
      currentPet.profile_image_path &&
      currentPet.profile_image_path !==
        newImagePath
    ) {
      const { error: removeOldError } =
        await supabase.storage
          .from("pet-images")
          .remove([
            currentPet.profile_image_path,
          ]);

      if (removeOldError) {
        console.error(
          "기존 이미지 삭제 실패:",
          removeOldError
        );
      }
    }

    redirect(`/pets/${id}`);
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-md px-6 py-12">
        <Link
          href={`/pets/${pet.id}`}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          ← 상세로 돌아가기
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-zinc-900">
          반려동물 정보 수정
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          반려동물의 정보를 수정해주세요.
        </p>

        <form
          action={updatePet}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="profile_image"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              프로필 사진 변경
            </label>

            <ProfileImageInput
              currentImageUrl={currentImageUrl}
              alt={pet.name}
            />

            <p className="mt-2 text-xs text-zinc-400">
              새 사진을 선택하지 않으면 기존 사진이 유지됩니다.
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              이름
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={pet.name}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label
              htmlFor="species"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              종류
            </label>

            <select
              id="species"
              name="species"
              required
              defaultValue={pet.species}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-zinc-400"
            >
              <option value="dog">
                강아지
              </option>

              <option value="cat">
                고양이
              </option>

              <option value="other">
                기타
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="breed"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              품종
            </label>

            <input
              id="breed"
              name="breed"
              type="text"
              defaultValue={pet.breed ?? ""}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              성별
            </label>

            <select
              id="gender"
              name="gender"
              defaultValue={pet.gender ?? ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-zinc-400"
            >
              <option value="">
                선택해주세요
              </option>

              <option value="male">
                수컷
              </option>

              <option value="female">
                암컷
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="neutered"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              중성화 여부
            </label>

            <select
              id="neutered"
              name="neutered"
              defaultValue={
                pet.neutered === true
                  ? "true"
                  : pet.neutered === false
                    ? "false"
                    : ""
              }
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-zinc-400"
            >
              <option value="">
                선택해주세요
              </option>

              <option value="true">
                중성화 완료
              </option>

              <option value="false">
                중성화 안 함
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="birth_date"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              생년월일
            </label>

            <DateInput
              id="birth_date"
              name="birth_date"
              defaultValue={
                pet.birth_date ?? ""
              }
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label
              htmlFor="weight"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              현재 체중 (kg)
            </label>

            <input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              min="0"
              defaultValue={
                pet.weight ?? ""
              }
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            수정 완료
          </button>
        </form>
      </section>
    </main>
  );
}