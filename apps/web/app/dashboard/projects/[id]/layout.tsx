import type { Metadata } from "next";
import { APP_NAME } from "@askwell/shared";
import { Tabs } from "../../../../components/ui/Tabs";
import type { TabItem } from "../../../../components/ui/Tabs";

export const metadata: Metadata = { title: `Project · ${APP_NAME}` };

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tabs: TabItem[] = [
    { label: "Knowledge", href: `/dashboard/projects/${id}/knowledge` },
    { label: "Install", href: `/dashboard/projects/${id}/install` },
    { label: "Customize", href: `/dashboard/projects/${id}/customize` },
    { label: "Conversations", href: `/dashboard/projects/${id}/conversations` },
    { label: "Usage", href: `/dashboard/projects/${id}/usage` },
  ];

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs text-fg-muted">Project</p>
        <h1 className="text-xl font-semibold text-fg">{id}</h1>
      </div>
      <Tabs tabs={tabs} />
      <div className="pt-6">{children}</div>
    </div>
  );
}
