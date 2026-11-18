"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "../../components/ui/ErrorState";

export function AccountInitError({ message }: { message: string }) {
  const router = useRouter();
  return <ErrorState message={message} onRetry={() => router.refresh()} />;
}
