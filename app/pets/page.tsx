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

  return (
    <main className="min-h-screen bg-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-zinc-900">
          내 반려동물
        </h1>

        <p className="mt-4 text-zinc-500">
          로그인 사용자만 접근할 수 있는 페이지입니다.
        </p>

        <p className="mt-2 text-sm text-zinc-400">
          {user.email}
        </p>
      </section>
    </main>
  );
}