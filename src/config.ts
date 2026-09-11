/**
 * Configuration normalization. Every problem is collected and shown together;
 * a card with a configuration error never calls a service.
 */

import type { KeypadAction, KeypadCardConfig, KeypadLayout } from "./types";

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
]);

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
    },
  };
}
