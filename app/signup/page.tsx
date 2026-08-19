"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (!email || !password || !passwordConfirm || !nickname) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    alert("회원가입이 완료되었습니다.");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <a
              href="/"
              className="text-3xl font-bold tracking-tight text-zinc-900"
            >
              petLog
            </a>

            <p className="mt-3 text-sm text-zinc-500">
              반려동물과 함께하는 일상을 기록해보세요.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                이메일
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="이메일을 입력해주세요"
                className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                비밀번호
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호를 입력해주세요"
                className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                비밀번호 확인
              </label>

              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                닉네임
              </label>

              <input
                id="nickname"
                name="nickname"
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="닉네임을 입력해주세요"
                className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-12 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            이미 계정이 있으신가요?{" "}
            <a
              href="/login"
              className="font-semibold text-zinc-900 hover:underline"
            >
              로그인
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}