import { z } from "zod";

/** GET /api/posthog-config (PostHog's public project key and host, read at request time) */
export const posthogConfigInputSchema = z.object({});
export type PosthogConfigRequest = z.infer<typeof posthogConfigInputSchema>;
export interface PosthogConfigResponse {
  key: string;
  host: string;
}
