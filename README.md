# Keypad Card

![GitHub Release](https://img.shields.io/github/v/release/trooperthorn/ha_card_keypad?style=for-the-badge)
![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)

A numeric keypad for Home Assistant dashboards that submits a code to one
`alarm_control_panel` action and always offers Submit. The built-in alarm
panel card hides Disarm while the panel is already disarmed, which leaves a
console lock view with digits and no way to send them; this card exists for
that case. The panel validates the code. The card holds the typed digits only
in the element's memory between presses and the action call, never in an
entity, an attribute, browser storage, or the configuration.

## Configuration

```yaml
type: custom:keypad-card
entity: alarm_control_panel.elk_m1_area_1
action: disarm            # disarm (default), arm_home, arm_away, arm_night, arm_vacation
title: Enter a code to unlock this console
submit_label: Unlock      # default Submit
min_length: 4             # default 4, 1 to 16
max_length: 8             # default 8, 1 to 16
clear_after_ms: 30000     # partial code is wiped after this idle time; 0 disables
key_size: 96              # key diameter in px, 48 to 200; everything else scales with it
layout: auto              # auto (side by side when the card is 560 px or wider), portrait, landscape
```

Any other option is a configuration error, including `code`: the card refuses
to carry a code in YAML by design.

## What it does and does not enforce

| Aspect | Status |
| --- | --- |
| Code validation | done by the integration and the panel behind `entity`; the card only forwards the digits |
| Feedback | "Sent to the panel" when the action call returned, or the error text the integration raised; whether the code was right shows up as the panel's state change or the integration's own event |
| Code at rest | none; an idle partial entry is cleared after `clear_after_ms` and on removal from the page |
| Access control | none beyond Home Assistant's; anyone who can see the card can press its keys |

Behaviour that depends on the integration: with `trooperthorn/ha_int_elkm1`,
`alarm_disarm` is sent to the panel even when the area is already disarmed,
so the panel reports which user's code was entered and the integration fires
`elkm1.user_code_entered`. Other integrations may ignore a disarm on a
disarmed panel; verify with yours.

## Installation

Add `https://github.com/trooperthorn/ha_card_keypad` to HACS as a custom
repository of type Dashboard, download it, and HACS registers the resource.
Manual: copy `dist/keypad-card.js` to `www/` and add it as a module resource.

## Development

```bash
npm ci
npm run lint && npm run typecheck && npm test && npm run build
```

`dist/keypad-card.js` is committed; CI fails when it drifts from a fresh
build. Releases are CalVer (`VERSION`), cut by the merge to `main`; see
docs/README.md.
