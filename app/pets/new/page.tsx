import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DateInput from "@/app/components/DateInput";

export default async function NewPetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function createPet(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const name = formData.get("name")?.toString().trim();
    const species = formData.get("species")?.toString();
    const breed = formData.get("breed")?.toString().trim() || null;
    const gender = formData.get("gender")?.toString() || null;

    const neuteredValue = formData.get("neutered")?.toString();

    const neutered =
      neuteredValue === "true"
        ? true
        : neuteredValue === "false"
          ? false
          : null;

    const birthDate =
      formData.get("birth_date")?.toString() || null;

    const weightValue =
      formData.get("weight")?.toString();

    const weight =
      weightValue ? Number(weightValue) : null;

    const image = formData.get("profile_image");

    if (!name || !species) {
      console.error("이름과 종류는 필수입니다.");
      return;
    }

    let profileImagePath: string | null = null;

    if (image instanceof File && image.size > 0) {
      const extension =
        image.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const filePath =
        `${user.id}/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("pet-images")
          .upload(filePath, image, {
            contentType: image.type || undefined,
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "프로필 이미지 업로드 실패:",
          uploadError
        );
        return;
      }

      profileImagePath = filePath;
    }

    const { error: insertError } = await supabase
      .from("pets")
      .insert({
        user_id: user.id,
        name,
        species,
        breed,
        gender,
        neutered,
        birth_date: birthDate,
        weight,
        profile_image_path: profileImagePath,
      });

    if (insertError) {
      console.error(
        "반려동물 등록 실패:",
        insertError
      );

      // DB 등록에 실패했다면 방금 업로드한 이미지 정리
      if (profileImagePath) {
        const { error: removeError } =
          await supabase.storage
            .from("pet-images")
            .remove([profileImagePath]);

        if (removeError) {
          console.error(
            "등록 실패 이미지 정리 실패:",
            removeError
          );
        }
      }

      return;
    }

    redirect("/pets");
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-md px-6 py-12">
        <Link
          href="/pets"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          ← 내 반려동물
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-zinc-900">
          반려동물 등록
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          함께하는 반려동물의 정보를 등록해주세요.
        </p>

        <form
          action={createPet}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="profile_image"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              프로필 사진
            </label>

            <input
              id="profile_image"
              name="profile_image"
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm"
            />
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
              placeholder="반려동물 이름"
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
              defaultValue=""
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-zinc-400"
            >
              <option value="" disabled>
                선택해주세요
              </option>
              <option value="dog">강아지</option>
              <option value="cat">고양이</option>
              <option value="other">기타</option>
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
              placeholder="예: 말티즈"
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
              defaultValue=""
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-zinc-400"
            >
              <option value="">선택해주세요</option>
              <option value="male">수컷</option>
              <option value="female">암컷</option>
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
              defaultValue=""
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-zinc-400"
            >
              <option value="">선택해주세요</option>
              <option value="true">중성화 완료</option>
              <option value="false">중성화 안 함</option>
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
              placeholder="예: 4.5"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            등록하기
          </button>
        </form>
      </section>
    </main>
  );
}