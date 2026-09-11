/**
 * Configuration normalization. Every problem is collected and shown together;
 * a card with a configuration error never calls a service.
 */

import type {
  KeypadAction,
  KeypadCardConfig,
  KeypadIcon,
  KeypadLayout,
  KeypadTheme,
} from "./types";

const ACTIONS: ReadonlySet<string> = new Set([
  "disarm",
  "arm_home",
  "arm_away",
  "arm_night",
  "arm_vacation",
]);

const KNOWN_KEYS = new Set([
  "type",
  "entity",
  "action",
  "title",
  "submit_label",
  "min_length",
  "max_length",
  "clear_after_ms",
  "key_size",
  "layout",
  "theme",
  "matrix",
  "caption",
  "fill",
  "left_heading",
  "left_text",
  "left_icon",
  "right_heading",
  "right_entity",
]);

const ICONS: ReadonlySet<string> = new Set(["none", "shield-lock"]);

const THEMES: ReadonlySet<string> = new Set(["plain", "phosphor"]);

const LAYOUTS: ReadonlySet<string> = new Set(["auto", "portrait", "landscape"]);

export interface ParseResult {
  config?: KeypadCardConfig;
  errors: string[];
}

export const SERVICE_FOR_ACTION: Record<KeypadAction, string> = {
  disarm: "alarm_disarm",
  arm_home: "alarm_arm_home",
  arm_away: "alarm_arm_away",
  arm_night: "alarm_arm_night",
  arm_vacation: "alarm_arm_vacation",
};

function intInRange(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
  name: string,
  errors: string[],
): number {
  if (value === undefined) return fallback;
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    errors.push(`${name} must be an integer from ${min} to ${max}`);
    return fallback;
  }
  return value;
}

export function parseConfig(raw: unknown): ParseResult {
  const errors: string[] = [];
  if (typeof raw !== "object" || raw === null) {
    return { errors: ["configuration must be a mapping"] };
  }
  const input = raw as Record<string, unknown>;
  for (const key of Object.keys(input)) {
    if (!KNOWN_KEYS.has(key)) errors.push(`unknown option: ${key}`);
  }

  const entity = input.entity;
  if (typeof entity !== "string" || !entity.startsWith("alarm_control_panel.")) {
    errors.push("entity must be an alarm_control_panel entity id");
  }

  const action = input.action ?? "disarm";
  if (typeof action !== "string" || !ACTIONS.has(action)) {
    errors.push("action must be one of disarm, arm_home, arm_away, arm_night, arm_vacation");
  }

  const title = input.title;
  if (title !== undefined && typeof title !== "string") errors.push("title must be a string");
  const submitLabel = input.submit_label ?? "Submit";
  if (typeof submitLabel !== "string" || submitLabel.length === 0) {
    errors.push("submit_label must be a non-empty string");
  }

  const minLength = intInRange(input.min_length, 4, 1, 16, "min_length", errors);
  const maxLength = intInRange(input.max_length, 8, 1, 16, "max_length", errors);
  if (minLength > maxLength) errors.push("min_length cannot exceed max_length");
  const clearAfter = intInRange(input.clear_after_ms, 30000, 0, 600000, "clear_after_ms", errors);
  const keySize = intInRange(input.key_size, 96, 48, 200, "key_size", errors);
  const layout = input.layout ?? "auto";
  if (typeof layout !== "string" || !LAYOUTS.has(layout)) {
    errors.push("layout must be auto, portrait, or landscape");
  }
  const theme = input.theme ?? "plain";
  if (typeof theme !== "string" || !THEMES.has(theme)) {
    errors.push("theme must be plain or phosphor");
  }
  const matrix = input.matrix ?? false;
  if (typeof matrix !== "boolean") errors.push("matrix must be true or false");
  const caption = input.caption;
  if (caption !== undefined && typeof caption !== "string") errors.push("caption must be a string");
  const fill = input.fill ?? false;
  if (typeof fill !== "boolean") errors.push("fill must be true or false");
  const leftIcon = input.left_icon ?? "none";
  if (typeof leftIcon !== "string" || !ICONS.has(leftIcon)) {
    errors.push("left_icon must be none or shield-lock");
  }
  for (const name of ["left_heading", "left_text", "right_heading"] as const) {
    if (input[name] !== undefined && typeof input[name] !== "string") errors.push(`${name} must be a string`);
  }
  const rightEntity = input.right_entity;
  if (rightEntity !== undefined && (typeof rightEntity !== "string" || !rightEntity.includes("."))) {
    errors.push("right_entity must be an entity id");
  }

  if (errors.length > 0) return { errors };
  return {
    errors,
    config: {
      type: String(input.type ?? "custom:keypad-card"),
      entity: entity as string,
      action: action as KeypadAction,
      title: title as string | undefined,
      submit_label: submitLabel as string,
      min_length: minLength,
      max_length: maxLength,
      clear_after_ms: clearAfter,
      key_size: keySize,
      layout: layout as KeypadLayout,
      theme: theme as KeypadTheme,
      matrix: matrix as boolean,
      caption: caption as string | undefined,
      fill: fill as boolean,
      left_heading: input.left_heading as string | undefined,
      left_text: input.left_text as string | undefined,
      left_icon: leftIcon as KeypadIcon,
      right_heading: input.right_heading as string | undefined,
      right_entity: rightEntity as string | undefined,
    },
  };
}
