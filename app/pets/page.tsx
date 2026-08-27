import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PetsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: pets, error } = await supabase
    .from("pets")
    .select("id, name, species, breed, profile_image")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("반려동물 목록 조회 실패:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              내 반려동물
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              등록한 반려동물을 확인하고 관리할 수 있어요.
            </p>
          </div>

          <Link
            href="/pets/new"
            className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            반려동물 등록
          </Link>
        </div>

        {!pets || pets.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-zinc-200 px-6 py-12 text-center">
            <p className="text-zinc-600">
              아직 등록된 반려동물이 없습니다.
            </p>

            <Link
              href="/pets/new"
              className="mt-4 inline-block text-sm font-semibold text-zinc-900 underline"
            >
              첫 반려동물 등록하기
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
              >
                <Link
                key={pet.id}
                href={`/pets/${pet.id}`}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-md"
                >                    

                {pet.profile_image ? (
                  <img
                    src={pet.profile_image}
                    alt={pet.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400">
                    등록된 사진 없음
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-xl font-bold text-zinc-900">
                    {pet.name}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    {pet.species === "dog"
                      ? "강아지"
                      : pet.species === "cat"
                      ? "고양이"
                      : "기타"}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                  </p>
                </div>
                </Link>
              </div>
              
            ))}
          </div>
        )}
      </section>
    </main>
  );
}