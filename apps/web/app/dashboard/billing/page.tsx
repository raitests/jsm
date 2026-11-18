import type { Metadata } from "next";
import { APP_NAME } from "@askwell/shared";
import { EmptyState } from "../../../components/ui/EmptyState";

export const metadata: Metadata = { title: `Billing · ${APP_NAME}` };

export default function BillingPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-fg">Billing</h1>
      </div>

      <EmptyState
        title="Billing coming soon"
        description="Subscription management will be available in a future phase."
      />
    </div>
  );
}
