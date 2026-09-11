/**
 * keypad-card: a numeric keypad that submits a code to one
 * alarm_control_panel action. Unlike the built-in alarm panel card it always
 * offers Submit, including while the panel is disarmed, which is what a
 * console lock view needs when the panel itself validates the code.
 *
 * The code exists only in this element's memory between key presses and the
 * service call. It is never written to an entity, an attribute, or storage.
 */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { parseConfig, SERVICE_FOR_ACTION } from "./config";
import type { HomeAssistant, KeypadCardConfig } from "./types";

declare const __CARD_VERSION__: string;

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;

class KeypadCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private config?: KeypadCardConfig;
  @state() private errors: string[] = [];
  @state() private code = "";
  @state() private busy = false;
  @state() private notice: { kind: "ok" | "error"; text: string } | null = null;

  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  static override styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
      container-type: inline-size;
    }
    .body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .body.landscape {
      flex-direction: row;
      justify-content: center;
      gap: 32px;
    }
    @container (min-width: 560px) {
      .body.auto {
        flex-direction: row;
        justify-content: center;
        gap: 32px;
      }
    }
    .panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .title {
      font-size: calc(var(--kp-key) * 0.28);
      font-weight: 500;
      text-align: center;
    }
    .display {
      font-family: monospace;
      font-size: calc(var(--kp-key) * 0.5);
      letter-spacing: 0.35em;
      text-align: center;
      min-height: 1.4em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, var(--kp-key));
      gap: calc(var(--kp-key) * 0.16);
      justify-content: center;
    }
    button {
      font: inherit;
      font-size: calc(var(--kp-key) * 0.42);
      width: var(--kp-key);
      height: var(--kp-key);
      border-radius: 50%;
      border: none;
      background: var(--secondary-background-color, #eee);
      color: var(--primary-text-color, inherit);
      cursor: pointer;
      touch-action: manipulation;
    }
    button:active {
      filter: brightness(0.85);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button.submit {
      grid-column: 1 / -1;
      width: auto;
      height: calc(var(--kp-key) * 0.75);
      font-size: calc(var(--kp-key) * 0.3);
      border-radius: calc(var(--kp-key) * 0.375);
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .notice {
      text-align: center;
      font-size: calc(var(--kp-key) * 0.22);
    }
    .notice.error {
      color: var(--error-color, #b00020);
    }
    .notice.ok {
      color: var(--success-color, #0a7c3c);
    }
    .errors {
      color: var(--error-color, #b00020);
      white-space: pre-wrap;
    }
  `;

  setConfig(raw: unknown): void {
    const parsed = parseConfig(raw);
    this.errors = parsed.errors;
    this.config = parsed.config;
    this.code = "";
    this.notice = null;
  }

  getCardSize(): number {
    return 6;
  }

  static getStubConfig(): Record<string, unknown> {
    return { entity: "alarm_control_panel.example", action: "disarm" };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopClearTimer();
    this.code = "";
  }

  private stopClearTimer(): void {
    if (this.clearTimer !== null) {
      clearTimeout(this.clearTimer);
      this.clearTimer = null;
    }
  }

  /** An abandoned partial code must not linger on a wall tablet. */
  private armClearTimer(): void {
    this.stopClearTimer();
    if (!this.config || this.config.clear_after_ms === 0) return;
    this.clearTimer = setTimeout(() => {
      this.code = "";
      this.clearTimer = null;
    }, this.config.clear_after_ms);
  }

  private press(key: (typeof KEYS)[number]): void {
    if (!this.config || this.busy) return;
    this.notice = null;
    if (key === "clear") {
      this.code = "";
    } else if (key === "back") {
      this.code = this.code.slice(0, -1);
    } else if (this.code.length < this.config.max_length) {
      this.code += key;
    }
    this.armClearTimer();
  }

  private async submit(): Promise<void> {
    const config = this.config;
    const hass = this.hass;
    if (!config || !hass || this.busy) return;
    if (this.code.length < config.min_length) {
      this.notice = { kind: "error", text: `Enter at least ${config.min_length} digits` };
      return;
    }
    const code = this.code;
    this.code = "";
    this.stopClearTimer();
    this.busy = true;
    try {
      await hass.callService("alarm_control_panel", SERVICE_FOR_ACTION[config.action], {
        entity_id: config.entity,
        code,
      });
      this.notice = { kind: "ok", text: "Sent to the panel" };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.notice = { kind: "error", text: message || "The panel rejected the request" };
    } finally {
      this.busy = false;
    }
  }

  override render() {
    if (this.errors.length > 0) {
      return html`<ha-card>
        <div class="errors">keypad-card configuration:\n${this.errors.join("\n")}</div>
      </ha-card>`;
    }
    const config = this.config;
    if (!config) return nothing;
    const entity = this.hass?.states[config.entity];
    const missing = entity === undefined;
    return html`<ha-card style="--kp-key: ${config.key_size}px">
      <div class="body ${config.layout}">
        <div class="panel">
          ${config.title ? html`<div class="title">${config.title}</div>` : nothing}
          ${missing
            ? html`<div class="notice error">${config.entity} is not available</div>`
            : nothing}
          <div class="display" aria-label="code entry">${"\u2022".repeat(this.code.length)}</div>
          ${this.notice
            ? html`<div class="notice ${this.notice.kind}">${this.notice.text}</div>`
            : nothing}
        </div>
        <div class="grid">
          ${KEYS.map(
            (key) => html`<button
              type="button"
              ?disabled=${missing || this.busy}
              aria-label=${key}
              @click=${() => this.press(key)}
            >
              ${key === "clear" ? "C" : key === "back" ? "\u232b" : key}
            </button>`,
          )}
          <button
            type="button"
            class="submit"
            ?disabled=${missing || this.busy || this.code.length === 0}
            @click=${() => void this.submit()}
          >
            ${config.submit_label}
          </button>
        </div>
      </div>
    </ha-card>`;
  }
}

if (!customElements.get("keypad-card")) {
  customElements.define("keypad-card", KeypadCard);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "keypad-card")) {
  window.customCards.push({
    type: "keypad-card",
    name: "Keypad Card",
    description: "Numeric keypad that submits a code to an alarm control panel action.",
    preview: false,
  });
}

console.info(`%c keypad-card %c ${__CARD_VERSION__} `, "color: white; background: #03a9f4", "");
