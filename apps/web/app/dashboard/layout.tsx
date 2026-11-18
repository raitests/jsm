import { APP_NAME } from "@askwell/shared";
import type { Metadata } from "next";
import { Sidebar } from "./Sidebar";

export const metadata: Metadata = {
  title: {
    template: `%s · ${APP_NAME}`,
    default: APP_NAME,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      {/* Offset for the fixed sidebar on sm+ and top padding for mobile hamburger */}
      <div className="sm:pl-56">
        <main className="min-h-screen pt-14 sm:pt-0">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
