/**
 * keypad-card: a numeric keypad that submits a code to one
 * alarm_control_panel action. Unlike the built-in alarm panel card it always
 * offers Submit, including while the panel is disarmed, which is what a
 * console lock view needs when the panel itself validates the code.
 *
 * The code exists only in this element's memory between key presses and the
 * service call. It is never written to an entity, an attribute, or storage.
 */

import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { parseConfig, SERVICE_FOR_ACTION } from "./config";
import { MatrixRain } from "./matrix-rain";
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
  private rains: MatrixRain[] = [];
  private resizeObserver: ResizeObserver | null = null;

  static override styles = css`
    :host {
      display: block;
      --kp-fg: var(--primary-text-color, inherit);
      --kp-key-bg: var(--secondary-background-color, #eee);
      --kp-submit-bg: var(--primary-color, #03a9f4);
      --kp-submit-fg: var(--text-primary-color, #fff);
      --kp-font: inherit;
      --kp-glow: none;
    }
    ha-card {
      padding: 16px;
      container-type: inline-size;
      color: var(--kp-fg);
      font-family: var(--kp-font);
      position: relative;
      overflow: hidden;
    }
    ha-card.phosphor {
      background: #020803;
      --kp-fg: #33ff66;
      --kp-key-bg: #062a10;
      --kp-submit-bg: #0b5a22;
      --kp-submit-fg: #b6ffc9;
      --kp-font: "VT323", "Share Tech Mono", "IBM Plex Mono", "Courier New", monospace;
      --kp-glow: 0 0 6px rgba(51, 255, 102, 0.75), 0 0 14px rgba(51, 255, 102, 0.35);
      text-shadow: var(--kp-glow);
    }
    ha-card.phosphor::after {
      /* scanlines */
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0px,
        rgba(0, 0, 0, 0) 2px,
        rgba(0, 0, 0, 0.18) 3px
      );
    }
    .body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      grid-template-areas: "left keypad right";
      align-items: center;
      gap: 16px;
    }
    .body.portrait {
      grid-template-columns: 1fr;
      grid-template-areas: "left" "keypad" "right";
    }
    @container (max-width: 559px) {
      .body.auto {
        grid-template-columns: 1fr;
        grid-template-areas: "left" "keypad" "right";
      }
    }
    .side {
      position: relative;
      min-width: 0;
      min-height: calc(var(--kp-key) * 3);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
      text-align: center;
    }
    .side.left {
      grid-area: left;
    }
    .side.right {
      grid-area: right;
    }
    canvas.rain {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.35;
      z-index: 0;
      pointer-events: none;
    }
    .side > :not(canvas) {
      position: relative;
      z-index: 1;
    }
    .title {
      font-size: calc(var(--kp-key) * 0.24);
      font-weight: 500;
      line-height: 1.15;
    }
    .display {
      font-family: var(--kp-font);
      font-size: calc(var(--kp-key) * 0.55);
      letter-spacing: 0.3em;
      min-height: 1.4em;
    }
    .caption,
    .notice {
      font-size: calc(var(--kp-key) * 0.18);
      line-height: 1.2;
    }
    .grid {
      grid-area: keypad;
      display: grid;
      grid-template-columns: repeat(3, var(--kp-key));
      gap: calc(var(--kp-key) * 0.16);
      justify-content: center;
      position: relative;
      z-index: 1;
    }
    button {
      font: inherit;
      font-family: var(--kp-font);
      font-size: calc(var(--kp-key) * 0.42);
      width: var(--kp-key);
      height: var(--kp-key);
      border-radius: 50%;
      border: none;
      background: var(--kp-key-bg);
      color: var(--kp-fg);
      cursor: pointer;
      touch-action: manipulation;
      text-shadow: var(--kp-glow);
    }
    ha-card.phosphor button {
      border: 1px solid rgba(51, 255, 102, 0.45);
      box-shadow: inset 0 0 10px rgba(51, 255, 102, 0.15);
    }
    button:active {
      filter: brightness(1.3);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button.submit {
      grid-column: 1 / -1;
      width: auto;
      height: calc(var(--kp-key) * 0.7);
      font-size: calc(var(--kp-key) * 0.3);
      border-radius: calc(var(--kp-key) * 0.35);
      background: var(--kp-submit-bg);
      color: var(--kp-submit-fg);
    }
    .notice.error {
      color: var(--error-color, #ff5c5c);
    }
    ha-card.phosphor .notice.error {
      color: #ffb347;
    }
    .notice.ok {
      color: var(--success-color, #0a7c3c);
    }
    ha-card.phosphor .notice.ok {
      color: #b6ffc9;
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

  override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.rains.forEach((r) => r.resize()));
    this.resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopClearTimer();
    this.stopRain();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.code = "";
  }

  override updated(changed: PropertyValues): void {
    if (changed.has("config") || changed.has("errors")) {
      this.stopRain();
      if (this.config?.matrix && this.errors.length === 0) {
        const canvases = this.renderRoot.querySelectorAll<HTMLCanvasElement>("canvas.rain");
        const size = Math.max(12, Math.round(this.config.key_size * 0.16));
        this.rains = Array.from(canvases, (c) => new MatrixRain(c, "#33ff66", size, 12));
        this.rains.forEach((r) => r.start());
      }
    }
  }

  private stopRain(): void {
    this.rains.forEach((r) => r.stop());
    this.rains = [];
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
    const rain = config.matrix ? html`<canvas class="rain"></canvas>` : nothing;
    const cursor = config.theme === "phosphor" ? "_" : "";
    return html`<ha-card class=${config.theme} style="--kp-key: ${config.key_size}px">
      <div class="body ${config.layout}">
        <div class="side left">
          ${rain}
          ${config.title ? html`<div class="title">${config.title}</div>` : nothing}
          <div class="display" aria-label="code entry">
            ${"•".repeat(this.code.length)}${cursor}
          </div>
        </div>
        <div class="grid">
          ${KEYS.map(
            (key) => html`<button
              type="button"
              ?disabled=${missing || this.busy}
              aria-label=${key}
              @click=${() => this.press(key)}
            >
              ${key === "clear" ? "C" : key === "back" ? "⌫" : key}
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
        <div class="side right">
          ${rain}
          ${config.caption ? html`<div class="caption">${config.caption}</div>` : nothing}
          ${missing
            ? html`<div class="notice error">${config.entity} is not available</div>`
            : nothing}
          ${this.notice
            ? html`<div class="notice ${this.notice.kind}">${this.notice.text}</div>`
            : nothing}
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
