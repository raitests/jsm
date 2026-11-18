import { z } from "zod";

export const WIDGET_POSITIONS = ["bottom-right", "bottom-left", "top-right", "top-left"] as const;
export const widgetPositionSchema = z.enum(WIDGET_POSITIONS);
export type WidgetPosition = z.infer<typeof widgetPositionSchema>;

export const WIDGET_ANIMATIONS = ["fade", "slide", "scale"] as const;
export const widgetAnimationSchema = z.enum(WIDGET_ANIMATIONS);
export type WidgetAnimation = z.infer<typeof widgetAnimationSchema>;

export const MAX_WIDGET_LABEL_CHARS = 40;
export const MAX_WIDGET_HEADER_CHARS = 60;

/** `#rrggbb` hex color. */
export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #000000");

export const widgetConfigSchema = z.object({
  buttonColor: hexColorSchema,
  position: widgetPositionSchema,
  label: z.string().trim().min(1).max(MAX_WIDGET_LABEL_CHARS),
  animation: widgetAnimationSchema,
  headerText: z.string().trim().min(1).max(MAX_WIDGET_HEADER_CHARS),
  showBadge: z.boolean(),
});
export type WidgetConfig = z.infer<typeof widgetConfigSchema>;

/** Free defaults. New projects start with these; Free projects always get them. */
export const DEFAULT_WIDGET_CONFIG: Readonly<WidgetConfig> = Object.freeze({
  buttonColor: "#000000",
  position: "bottom-right",
  label: "Chat with us",
  animation: "fade",
  headerText: "How can we help?",
  showBadge: true,
});
