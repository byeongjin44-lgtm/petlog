"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-700"
    >
      로그아웃
    </button>
  );
}