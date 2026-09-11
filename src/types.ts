/** The subset of the Home Assistant frontend object the card relies on. */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ): Promise<unknown>;
}

/** Actions the card can submit a code to. Each maps to one alarm_control_panel action. */
export type KeypadAction =
  | "disarm"
  | "arm_home"
  | "arm_away"
  | "arm_night"
  | "arm_vacation";

export interface KeypadCardConfig {
  type: string;
  entity: string;
  action: KeypadAction;
  title?: string;
  submit_label: string;
  min_length: number;
  max_length: number;
  clear_after_ms: number;
  key_size: number;
  layout: KeypadLayout;
  theme: KeypadTheme;
  matrix: boolean;
  caption?: string;
  fill: boolean;
  left_heading?: string;
  left_text?: string;
  left_icon: KeypadIcon;
  right_heading?: string;
  right_entity?: string;
}

/** Built-in emblems drawn inline; none hides the emblem. */
export type KeypadIcon = "none" | "shield-lock";

/** plain follows the Home Assistant theme; phosphor is green on black with a terminal face. */
export type KeypadTheme = "plain" | "phosphor";

/** auto switches to side-by-side when the card is at least 560 px wide. */
export type KeypadLayout = "auto" | "portrait" | "landscape";

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}
