export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Guitar Chords
        </h1>
        <p className="text-xl text-zinc-400">
          Cast &amp; Control
        </p>
        <p className="max-w-md text-zinc-500">
          Display chords on your TV and control from your phone.
        </p>
      </main>
    </div>
  );
}
