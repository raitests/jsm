import { APP_NAME } from "@askwell/shared";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">{APP_NAME}</h1>
      <p className="text-neutral-500">AI support chat for any website.</p>
    </main>
  );
}
