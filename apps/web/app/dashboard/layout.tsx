import { APP_NAME } from "@askwell/shared";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { ensureAccount } from "../../lib/accounts";
import { ErrorState } from "../../components/ui/ErrorState";
import { Sidebar } from "./Sidebar";

export const metadata: Metadata = {
  title: {
    template: `%s · ${APP_NAME}`,
    default: APP_NAME,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth.protect();

  let initError: string | null = null;
  try {
    await ensureAccount(userId);
  } catch (err) {
    initError = err instanceof Error ? err.message : "Failed to initialize your account.";
  }

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      {/* Offset for the fixed sidebar on sm+ and top padding for mobile hamburger */}
      <div className="sm:pl-56">
        <main className="min-h-screen pt-14 sm:pt-0">
          <div className="p-4 sm:p-6">
            {initError ? <ErrorState message={initError} /> : children}
          </div>
        </main>
      </div>
    </div>
  );
}
