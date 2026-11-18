import { z } from "zod";
import { MAX_MESSAGE_CHARS } from "../constants";
import type { WidgetConfig } from "../widget-config";
import { publicKeySchema, uuidSchema } from "./common";

/** GET /api/widget/config?key=pk_... */
export const widgetConfigQuerySchema = z.object({ key: publicKeySchema });
export type WidgetConfigRequest = z.infer<typeof widgetConfigQuerySchema>;
/** Plan-applied: Free projects get `DEFAULT_WIDGET_CONFIG` (badge shown). */
export interface WidgetConfigResponse {
  config: WidgetConfig;
}

/** POST /api/widget/chat */
export const widgetChatBodySchema = z.object({
  key: publicKeySchema,
  /** Random ID kept in the iframe's localStorage. */
  visitorId: uuidSchema,
  /** Omit on the first message; the server creates the conversation. */
  conversationId: uuidSchema.optional(),
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
});
export type WidgetChatRequest = z.infer<typeof widgetChatBodySchema>;
export interface WidgetChatResponse {
  conversationId: string;
  reply: string;
}
