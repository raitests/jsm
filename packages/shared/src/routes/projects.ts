import { z } from "zod";
import { MAX_PROJECT_NAME_CHARS } from "../constants";
import type { Project } from "../domain";
import type { WidgetConfig } from "../widget-config";
import { widgetConfigSchema } from "../widget-config";
import { idParamsSchema, type DeleteResponse } from "./common";

export const projectNameSchema = z.string().trim().min(1).max(MAX_PROJECT_NAME_CHARS);

/** GET /api/projects */
export const listProjectsInputSchema = z.object({});
export type ListProjectsRequest = z.infer<typeof listProjectsInputSchema>;
export interface ListProjectsResponse {
  projects: Project[];
}

/** POST /api/projects (403 plan_limit at the plan's project limit) */
export const createProjectBodySchema = z.object({ name: projectNameSchema });
export type CreateProjectRequest = z.infer<typeof createProjectBodySchema>;
export interface CreateProjectResponse {
  project: Project;
}

/** PATCH /api/projects/:id (rename) */
export const renameProjectParamsSchema = idParamsSchema;
export const renameProjectBodySchema = z.object({ name: projectNameSchema });
export type RenameProjectRequest = z.infer<typeof renameProjectBodySchema>;
export interface RenameProjectResponse {
  project: Project;
}

/** DELETE /api/projects/:id */
export const deleteProjectParamsSchema = idParamsSchema;
export type DeleteProjectRequest = z.infer<typeof deleteProjectParamsSchema>;
export type DeleteProjectResponse = DeleteResponse;

/** PATCH /api/projects/:id/config (402 payment_required on Free). Send only the fields to change. */
export const updateWidgetConfigParamsSchema = idParamsSchema;
export const updateWidgetConfigBodySchema = widgetConfigSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: "Change at least one field" });
export type UpdateWidgetConfigRequest = z.infer<typeof updateWidgetConfigBodySchema>;
export interface UpdateWidgetConfigResponse {
  config: WidgetConfig;
}
