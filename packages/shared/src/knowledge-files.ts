import { MAX_KNOWLEDGE_FILE_BYTES } from "./constants";

export const KNOWLEDGE_FILE_TYPES = ["pdf", "md", "txt"] as const;
export type KnowledgeFileType = (typeof KNOWLEDGE_FILE_TYPES)[number];

/** File extension (lowercase, with dot) for each allowed file type. */
export const KNOWLEDGE_FILE_EXTENSIONS: Readonly<Record<KnowledgeFileType, string>> = Object.freeze({
  pdf: ".pdf",
  md: ".md",
  txt: ".txt",
});

/** MIME type the server uploads each file type with. */
export const KNOWLEDGE_FILE_MIME_TYPES: Readonly<Record<KnowledgeFileType, string>> = Object.freeze({
  pdf: "application/pdf",
  md: "text/markdown",
  txt: "text/plain",
});

/** MIME types the knowledge Storage bucket allows. */
export const ALLOWED_KNOWLEDGE_MIME_TYPES: readonly string[] = Object.freeze(
  KNOWLEDGE_FILE_TYPES.map((t) => KNOWLEDGE_FILE_MIME_TYPES[t]),
);

/** The allowed file type for a file name, by extension (case-insensitive), or null. */
export function knowledgeFileTypeFromName(fileName: string): KnowledgeFileType | null {
  const lower = fileName.trim().toLowerCase();
  for (const type of KNOWLEDGE_FILE_TYPES) {
    const ext = KNOWLEDGE_FILE_EXTENSIONS[type];
    if (lower.length > ext.length && lower.endsWith(ext)) return type;
  }
  return null;
}

/** Whether a size in bytes is a non-empty file within the limit. */
export function isAllowedKnowledgeFileSize(sizeBytes: number): boolean {
  return Number.isInteger(sizeBytes) && sizeBytes > 0 && sizeBytes <= MAX_KNOWLEDGE_FILE_BYTES;
}
