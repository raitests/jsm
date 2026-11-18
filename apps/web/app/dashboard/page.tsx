import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { APP_NAME } from "@askwell/shared";

export default async function DashboardPage() {
  await auth.protect();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">{APP_NAME} Dashboard</h1>
      <SignOutButton>
        <button className="rounded bg-black px-4 py-2 text-white hover:bg-neutral-800">
          Sign out
        </button>
      </SignOutButton>
    </main>
  );
}
