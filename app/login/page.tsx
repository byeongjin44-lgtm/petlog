export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <a
              href="/"
              className="text-3xl font-bold tracking-tight text-zinc-900"
            >
              petLog
            </a>

            <p className="mt-3 text-sm text-zinc-500">
              반려동물의 소중한 일상을 기록하세요.
            </p>
          </div>

          <form className="space-y-4">
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
                placeholder="비밀번호를 입력해주세요"
                className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              로그인
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-400">또는</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <button
            type="button"
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Google로 로그인
          </button>

          <p className="mt-8 text-center text-sm text-zinc-500">
            아직 계정이 없으신가요?{" "}
            <a
              href="/signup"
              className="font-semibold text-zinc-900 hover:underline"
            >
              회원가입
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}