/** The product name. Every surface reads it from here; never hardcode it. */
export const APP_NAME = "Askwell";

/** Prefix of every project's public widget key (`pk_` + random). */
export const PUBLIC_KEY_PREFIX = "pk_";

/** Public key format: the prefix followed by 16–64 URL-safe characters. */
export const PUBLIC_KEY_PATTERN = /^pk_[A-Za-z0-9_-]{16,64}$/;

/** Longest visitor message the chat accepts, in characters. */
export const MAX_MESSAGE_CHARS = 1000;

/** Largest knowledge file accepted (10 MB). The Storage bucket enforces the same. */
export const MAX_KNOWLEDGE_FILE_BYTES = 10 * 1024 * 1024;

/** Longest project name, in characters. */
export const MAX_PROJECT_NAME_CHARS = 100;

/** Longest knowledge source title, in characters. */
export const MAX_KNOWLEDGE_TITLE_CHARS = 200;

/** Longest pasted knowledge text, in characters. */
export const MAX_PASTED_TEXT_CHARS = 200_000;

/** Longest uploaded file name, in characters. */
export const MAX_FILE_NAME_CHARS = 255;
// end of constants
