import { z } from "zod";
import {
  MAX_FILE_NAME_CHARS,
  MAX_KNOWLEDGE_FILE_BYTES,
  MAX_KNOWLEDGE_TITLE_CHARS,
  MAX_PASTED_TEXT_CHARS,
} from "../constants";
import type { KnowledgeSource } from "../domain";
import { knowledgeFileTypeFromName } from "../knowledge-files";
import { idParamsSchema, uuidSchema, type DeleteResponse } from "./common";

export const knowledgeTitleSchema = z.string().trim().min(1).max(MAX_KNOWLEDGE_TITLE_CHARS);

/** POST /api/projects/:id/knowledge (paste text; 403 plan_limit at the source limit) */
export const pasteKnowledgeParamsSchema = idParamsSchema;
export const pasteKnowledgeBodySchema = z.object({
  title: knowledgeTitleSchema,
  content: z.string().trim().min(1).max(MAX_PASTED_TEXT_CHARS),
});
export type PasteKnowledgeRequest = z.infer<typeof pasteKnowledgeBodySchema>;
export interface PasteKnowledgeResponse {
  source: KnowledgeSource;
}

/** POST /api/projects/:id/knowledge/upload-url (reserves an `uploading` source; 403 plan_limit at the limit) */
export const knowledgeUploadUrlParamsSchema = idParamsSchema;
export const knowledgeUploadUrlBodySchema = z.object({
  /** Original file name; its extension must be .pdf, .md or .txt. */
  fileName: z
    .string()
    .trim()
    .min(1)
    .max(MAX_FILE_NAME_CHARS)
    .refine((name) => knowledgeFileTypeFromName(name) !== null, {
      message: "Only PDF, Markdown and TXT files are allowed",
    }),
  /** Declared size in bytes. `finalize` checks the real size. */
  sizeBytes: z.number().int().positive().max(MAX_KNOWLEDGE_FILE_BYTES, {
    message: "File is larger than 10 MB",
  }),
  /** Defaults to the file name without its extension. */
  title: knowledgeTitleSchema.optional(),
});
export type KnowledgeUploadUrlRequest = z.infer<typeof knowledgeUploadUrlBodySchema>;
export interface KnowledgeUploadUrlResponse {
  source: KnowledgeSource;
  /** One-time signed Storage URL. Upload the file to it with PUT. */
  uploadUrl: string;
}

/** POST /api/projects/:id/knowledge/finalize (after the upload; `uploading` → `processing`) */
export const finalizeKnowledgeParamsSchema = idParamsSchema;
export const finalizeKnowledgeBodySchema = z.object({ sourceId: uuidSchema });
export type FinalizeKnowledgeRequest = z.infer<typeof finalizeKnowledgeBodySchema>;
export interface FinalizeKnowledgeResponse {
  source: KnowledgeSource;
}

/** DELETE /api/knowledge/:id (deletes the source, its file and chunks) */
export const deleteKnowledgeParamsSchema = idParamsSchema;
export type DeleteKnowledgeRequest = z.infer<typeof deleteKnowledgeParamsSchema>;
export type DeleteKnowledgeResponse = DeleteResponse;
