import type { z } from "zod";
import type { Conversation, ConversationSummary, Message } from "../domain";
import { idParamsSchema } from "./common";

/** GET /api/projects/:id/conversations (newest first) */
export const listConversationsParamsSchema = idParamsSchema;
export type ListConversationsRequest = z.infer<typeof listConversationsParamsSchema>;
export interface ListConversationsResponse {
  conversations: ConversationSummary[];
}

/** GET /api/conversations/:id (full thread, oldest message first) */
export const getConversationParamsSchema = idParamsSchema;
export type GetConversationRequest = z.infer<typeof getConversationParamsSchema>;
export interface GetConversationResponse {
  conversation: Conversation;
  messages: Message[];
}
