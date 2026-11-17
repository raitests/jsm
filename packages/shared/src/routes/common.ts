import { z } from "zod";
import { PUBLIC_KEY_PATTERN } from "../constants";

export const uuidSchema = z.uuid();

/** Path params for routes with a single `:id`. */
export const idParamsSchema = z.object({ id: uuidSchema });
export type IdParams = z.infer<typeof idParamsSchema>;

/** A project's public widget key (`pk_...`). */
export const publicKeySchema = z
  .string()
  .regex(PUBLIC_KEY_PATTERN, "Invalid public key");

/** Response of every DELETE route. */
export interface DeleteResponse {
  id: string;
}
