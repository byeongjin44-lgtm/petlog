import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  const birthDate = formData.get("birth_date")?.toString() || null;
  const weightValue = formData.get("weight")?.toString();

  const weight = weightValue ? Number(weightValue) : null;

  if (!name || !species) {
    return;
  }

  const image = formData.get("profile_image");

  let profileImage: string | null = null;

  if (image instanceof File && image.size > 0) {
    const extension = image.name.split(".").pop() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("pet-images")
      .upload(filePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("이미지 업로드 실패:", uploadError);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("pet-images")
      .getPublicUrl(filePath);

    profileImage = publicUrl;
  }

  const { error } = await supabase.from("pets").insert({
    user_id: user.id,
    name,
    species,
    breed,
    gender,
    birth_date: birthDate,
    weight,
    profile_image: profileImage,
  });

  if (error) {
    console.error("반려동물 등록 실패:", error);
    return;
  }

  redirect("/pets");
}

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900">
          반려동물 등록
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          소중한 반려동물의 정보를 등록해주세요.
        </p>

        <form action={createPet} className="mt-8 space-y-5">
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
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
              placeholder="예: 초코"
            />
          </div>

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
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
              placeholder="예: 말티즈"
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
              <option value="" disabled>
                선택해주세요
              </option>
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

            <input
              id="birth_date"
              name="birth_date"
              type="date"
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
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
              placeholder="예: 4.5"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            반려동물 등록
          </button>
        </form>
      </section>
    </main>
  );
}