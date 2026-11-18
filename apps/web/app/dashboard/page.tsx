import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { APP_NAME } from "@askwell/shared";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";

export const metadata: Metadata = { title: `Projects · ${APP_NAME}` };

export default async function ProjectsPage() {
  await auth.protect();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-fg">Projects</h1>
        <Button variant="primary" disabled title="Coming in Phase 2">
          New project
        </Button>
      </div>

      <EmptyState
        title="No projects yet"
        description="Create a project to get started. Project creation is coming in Phase 2."
      />
    </div>
  );
}
