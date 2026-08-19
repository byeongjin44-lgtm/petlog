export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-12">
          <p className="mb-4 text-sm font-medium tracking-[0.3em] text-zinc-400">
            PET + LOG
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            petLog
          </h1>

          <p className="mt-6 text-xl font-medium text-zinc-700">
            우리 아이의 모든 순간을 기록하세요.
          </p>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            사진부터 병원기록, 건강기록까지
            <br />
            반려동물의 소중한 일상을 한 곳에.
          </p>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <a
            href="/login"
            className="flex h-12 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            로그인
          </a>

          <a
            href="/signup"
            className="flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            회원가입
          </a>
        </div>
      </section>
    </main>
  );
}