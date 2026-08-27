import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 수정할 반려동물 기존 데이터 조회
  const { data: pet, error } = await supabase
    .from("pets")
    .select(
      "id, name, species, breed, gender, neutered, birth_date, weight, profile_image"
    )
    .eq("id", id)
    .single();

  if (error || !pet) {
    notFound();
  }

  async function updatePet(formData: FormData) {
    "use server";

    const supabase = await createClient();

    // Server Action에서도 로그인 사용자 다시 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // 현재 DB의 반려동물 정보 다시 조회
    // 특히 기존 이미지 경로 확인을 위해 필요
    const { data: currentPet, error: currentPetError } = await supabase
      .from("pets")
      .select("id, profile_image")
      .eq("id", id)
      .single();

    if (currentPetError || !currentPet) {
      notFound();
    }

    // 기본 정보
    const name = formData.get("name")?.toString().trim();
    const species = formData.get("species")?.toString();

    const breed =
      formData.get("breed")?.toString().trim() || null;

    const gender =
      formData.get("gender")?.toString() || null;

    // 중성화 여부
    const neuteredValue =
      formData.get("neutered")?.toString();

    const neutered =
      neuteredValue === "true"
        ? true
        : neuteredValue === "false"
        ? false
        : null;

    // 생년월일
    const birthDate =
      formData.get("birth_date")?.toString() || null;

    // 체중
    const weightValue =
      formData.get("weight")?.toString();

    const weight =
      weightValue ? Number(weightValue) : null;

    if (!name || !species) {
      return;
    }

    // 이미지
    const image = formData.get("profile_image");

    // 새 사진을 선택하지 않았다면 기존 URL 유지
    let profileImage = currentPet.profile_image;

    // 새 사진을 선택한 경우
    if (image instanceof File && image.size > 0) {
      const extension =
        image.name.split(".").pop() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      // Storage RLS 정책에 맞춰
      // 첫 번째 폴더명을 user.id로 사용
      const filePath =
        `${user.id}/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("pet-images")
          .upload(filePath, image, {
            contentType: image.type,
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "새 이미지 업로드 실패:",
          uploadError
        );
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("pet-images")
        .getPublicUrl(filePath);

      profileImage = publicUrl;
    }

    // DB 정보 수정
    const { error: updateError } = await supabase
      .from("pets")
      .update({
        name,
        species,
        breed,
        gender,
        neutered,
        birth_date: birthDate,
        weight,
        profile_image: profileImage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error(
        "반려동물 수정 실패:",
        updateError
      );
      return;
    }

    // 새 이미지를 선택했고,
    // 기존 이미지가 있었다면 기존 Storage 파일 삭제
    if (
      image instanceof File &&
      image.size > 0 &&
      currentPet.profile_image
    ) {
      const marker = "/pet-images/";

      const markerIndex =
        currentPet.profile_image.indexOf(marker);

      if (markerIndex !== -1) {
        const oldFilePath =
          currentPet.profile_image.slice(
            markerIndex + marker.length
          );

        const { error: removeError } =
          await supabase.storage
            .from("pet-images")
            .remove([oldFilePath]);

        if (removeError) {
          console.error(
            "기존 이미지 삭제 실패:",
            removeError
          );
        }
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
          {/* 프로필 이미지 */}
          <div>
            <label
              htmlFor="profile_image"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              프로필 사진 변경
            </label>

            {pet.profile_image ? (
              <img
                src={pet.profile_image}
                alt={pet.name}
                className="mb-3 h-32 w-32 rounded-2xl object-cover"
              />
            ) : (
              <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-2xl bg-zinc-100 text-xs text-zinc-400">
                등록된 사진 없음
              </div>
            )}

            <input
              id="profile_image"
              name="profile_image"
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm"
            />

            <p className="mt-2 text-xs text-zinc-400">
              새 사진을 선택하지 않으면 기존 사진이 유지됩니다.
            </p>
          </div>

          {/* 이름 */}
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

          {/* 종류 */}
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

          {/* 품종 */}
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

          {/* 성별 */}
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

          {/* 중성화 */}
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

          {/* 생년월일 */}
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
              defaultValue={pet.birth_date ?? ""}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
            />
          </div>

          {/* 체중 */}
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
              defaultValue={pet.weight ?? ""}
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