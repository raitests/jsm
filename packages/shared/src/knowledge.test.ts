import { describe, expect, it } from "vitest";
import {
  ALLOWED_KNOWLEDGE_MIME_TYPES,
  MAX_KNOWLEDGE_FILE_BYTES,
  isAllowedKnowledgeFileSize,
  knowledgeFileTypeFromName,
  knowledgeUploadUrlBodySchema,
  pasteKnowledgeBodySchema,
} from "./index";

describe("knowledge file limits", () => {
  it("max file size is 10 MB", () => {
    expect(MAX_KNOWLEDGE_FILE_BYTES).toBe(10 * 1024 * 1024);
  });

  it("accepts a file at exactly the limit", () => {
    const r = knowledgeUploadUrlBodySchema.safeParse({ fileName: "a.pdf", sizeBytes: MAX_KNOWLEDGE_FILE_BYTES });
    expect(r.success).toBe(true);
    expect(isAllowedKnowledgeFileSize(MAX_KNOWLEDGE_FILE_BYTES)).toBe(true);
  });

  it("refuses a file one byte over, empty, or fractional", () => {
    for (const sizeBytes of [MAX_KNOWLEDGE_FILE_BYTES + 1, 0, -1, 1.5]) {
      expect(knowledgeUploadUrlBodySchema.safeParse({ fileName: "a.pdf", sizeBytes }).success).toBe(false);
      expect(isAllowedKnowledgeFileSize(sizeBytes)).toBe(false);
    }
  });

  it.each([
    ["guide.pdf", "pdf"],
    ["README.MD", "md"],
    ["notes.txt", "txt"],
  ])("accepts %s as %s", (fileName, type) => {
    expect(knowledgeFileTypeFromName(fileName)).toBe(type);
    expect(knowledgeUploadUrlBodySchema.safeParse({ fileName, sizeBytes: 10 }).success).toBe(true);
  });

  it.each(["photo.png", "doc.docx", "script.pdf.exe", ".pdf", "pdf", "notes"])("refuses %s", (fileName) => {
    expect(knowledgeFileTypeFromName(fileName)).toBeNull();
    expect(knowledgeUploadUrlBodySchema.safeParse({ fileName, sizeBytes: 10 }).success).toBe(false);
  });

  it("lists the bucket MIME types", () => {
    expect([...ALLOWED_KNOWLEDGE_MIME_TYPES].sort()).toEqual(["application/pdf", "text/markdown", "text/plain"]);
  });
});

describe("paste knowledge input", () => {
  it("needs a title and content", () => {
    expect(pasteKnowledgeBodySchema.safeParse({ title: "FAQ", content: "Hours: 9–5" }).success).toBe(true);
    expect(pasteKnowledgeBodySchema.safeParse({ title: "", content: "x" }).success).toBe(false);
    expect(pasteKnowledgeBodySchema.safeParse({ title: "FAQ", content: " " }).success).toBe(false);
  });
});
