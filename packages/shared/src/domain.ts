import { z } from "zod";

/** Row shapes the API returns. Fields are camelCase; timestamps are ISO 8601 strings. */

export interface Project {
  id: string;
  name: string;
  publicKey: string;
  /** Messages counted in the current period. */
  messagesUsed: number;
  periodStart: string;
  createdAt: string;
}

export const KNOWLEDGE_SOURCE_TYPES = ["text", "pdf", "md", "txt"] as const;
export const knowledgeSourceTypeSchema = z.enum(KNOWLEDGE_SOURCE_TYPES);
export type KnowledgeSourceType = z.infer<typeof knowledgeSourceTypeSchema>;

/** `uploading` is shown to owners as processing. */
export const KNOWLEDGE_SOURCE_STATUSES = ["uploading", "processing", "ready", "failed"] as const;
export const knowledgeSourceStatusSchema = z.enum(KNOWLEDGE_SOURCE_STATUSES);
export type KnowledgeSourceStatus = z.infer<typeof knowledgeSourceStatusSchema>;

export interface KnowledgeSource {
  id: string;
  projectId: string;
  title: string;
  type: KnowledgeSourceType;
  status: KnowledgeSourceStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  visitorId: string;
  createdAt: string;
}

/** A conversation as listed: newest first, with a preview and count. */
export interface ConversationSummary extends Conversation {
  /** Start of the first visitor message, or null if none yet. */
  firstMessagePreview: string | null;
  messageCount: number;
}

export const MESSAGE_ROLES = ["visitor", "bot"] as const;
export const messageRoleSchema = z.enum(MESSAGE_ROLES);
export type MessageRole = z.infer<typeof messageRoleSchema>;

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  /** Plain text. Render as text, never HTML. */
  body: string;
  createdAt: string;
}
