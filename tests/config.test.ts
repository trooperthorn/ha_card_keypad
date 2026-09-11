import { describe, expect, it } from "vitest";
import { parseConfig, SERVICE_FOR_ACTION } from "../src/config";

describe("parseConfig", () => {
  it("applies defaults for a minimal configuration", () => {
    const result = parseConfig({ type: "custom:keypad-card", entity: "alarm_control_panel.a" });
    expect(result.errors).toEqual([]);
    expect(result.config).toMatchObject({
      entity: "alarm_control_panel.a",
      action: "disarm",
      submit_label: "Submit",
      min_length: 4,
      max_length: 8,
      clear_after_ms: 30000,
      key_size: 96,
      layout: "auto",
      theme: "plain",
      matrix: false,
      fill: false,
      left_icon: "none",
    });
  });

  it("validates the side panel options", () => {
    expect(parseConfig({ entity: "alarm_control_panel.a", fill: 1 }).errors).toContain(
      "fill must be true or false",
    );
    expect(parseConfig({ entity: "alarm_control_panel.a", left_icon: "skull" }).errors).toContain(
      "left_icon must be none or shield-lock",
    );
    expect(parseConfig({ entity: "alarm_control_panel.a", right_entity: "nope" }).errors).toContain(
      "right_entity must be an entity id",
    );
    expect(
      parseConfig({
        entity: "alarm_control_panel.a",
        fill: true,
        left_icon: "shield-lock",
        left_heading: "Security Threat",
        left_text: "Threat Detected",
        right_entity: "input_boolean.t",
      }).config,
    ).toMatchObject({ fill: true, left_icon: "shield-lock", right_entity: "input_boolean.t" });
  });

  it("validates theme, matrix, and caption", () => {
    expect(parseConfig({ entity: "alarm_control_panel.a", theme: "amber" }).errors).toContain(
      "theme must be plain or phosphor",
    );
    expect(parseConfig({ entity: "alarm_control_panel.a", matrix: "yes" }).errors).toContain(
      "matrix must be true or false",
    );
    expect(
      parseConfig({ entity: "alarm_control_panel.a", theme: "phosphor", matrix: true, caption: "hi" }).config,
    ).toMatchObject({ theme: "phosphor", matrix: true, caption: "hi" });
  });

  it("validates key_size and layout", () => {
    expect(parseConfig({ entity: "alarm_control_panel.a", key_size: 20 }).errors).toContain(
      "key_size must be an integer from 48 to 200",
    );
    expect(parseConfig({ entity: "alarm_control_panel.a", layout: "wide" }).errors).toContain(
      "layout must be auto, portrait, or landscape",
    );
    expect(
      parseConfig({ entity: "alarm_control_panel.a", key_size: 140, layout: "landscape" }).config,
    ).toMatchObject({ key_size: 140, layout: "landscape" });
  });

  it("rejects a non-alarm entity, an unknown action, and unknown keys together", () => {
    const result = parseConfig({ entity: "light.x", action: "open", code: "1234" });
    expect(result.config).toBeUndefined();
    expect(result.errors).toEqual([
      "unknown option: code",
      "entity must be an alarm_control_panel entity id",
      "action must be one of disarm, arm_home, arm_away, arm_night, arm_vacation",
    ]);
  });

  it("rejects lengths that cannot work", () => {
    const result = parseConfig({ entity: "alarm_control_panel.a", min_length: 6, max_length: 4 });
    expect(result.errors).toContain("min_length cannot exceed max_length");
    const bad = parseConfig({ entity: "alarm_control_panel.a", clear_after_ms: -1 });
    expect(bad.errors).toContain("clear_after_ms must be an integer from 0 to 600000");
  });

  it("maps every action to an alarm_control_panel action name", () => {
    expect(SERVICE_FOR_ACTION).toEqual({
      disarm: "alarm_disarm",
      arm_home: "alarm_arm_home",
      arm_away: "alarm_arm_away",
      arm_night: "alarm_arm_night",
      arm_vacation: "alarm_arm_vacation",
    });
  });

  it("never accepts a code in configuration", () => {
    const result = parseConfig({ entity: "alarm_control_panel.a", code: "0000" });
    expect(result.errors).toEqual(["unknown option: code"]);
  });
});
