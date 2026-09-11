# Design

## Why a card at all

The built-in alarm panel card renders arm buttons while the panel is
disarmed and a Disarm button otherwise. The tile card's alarm-modes feature
returns early when the selected mode equals the current state
(`if (mode === this._stateObj.state) return;` in
`hui-alarm-modes-card-feature.ts`). Neither can submit a code from a disarmed
panel, and a console lock view sometimes needs exactly that: the ELK panel is
the only thing that validates codes, so the only way to ask "is this the
owner" while the house is disarmed is to send the code to the panel.

## Where the code lives

In a Lit reactive property on the element, between key presses and the
`callService` call, then cleared. The configuration schema rejects a `code`
key outright, the card writes nothing to `localStorage`, and a partial entry
is wiped after `clear_after_ms` of inactivity and on disconnect. The service
call carries the code to Home Assistant over the same authenticated websocket
the rest of the dashboard uses; from there the integration forwards it to the
panel and Home Assistant does not persist it.

## Action mapping

| `action` | alarm_control_panel action |
| --- | --- |
| disarm | alarm_disarm |
| arm_home | alarm_arm_home |
| arm_away | alarm_arm_away |
| arm_night | alarm_arm_night |
| arm_vacation | alarm_arm_vacation |

The card does not inspect `code_format` or `code_arm_required`; it always
sends `code`. An integration that does not want one ignores it.

## Feedback

"Sent to the panel" means the action call returned without raising. A wrong
code is usually reported by the integration as a raised error (shown in red)
or by the panel simply not changing state; the card does not pretend to know
which, because it cannot.
