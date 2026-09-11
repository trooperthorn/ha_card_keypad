# Decisions

## 2026-09-11: a new card rather than a fork of the alarm panel card

Rejected: forking `hui-alarm-panel-card` to add a Submit button while
disarmed. The built-in card is tied to the frontend's own build and the
`setProtectedAlarmControlPanelMode` helper, which also skips same-mode
requests. Chosen: a small standalone card with one job, so the behaviour is
explicit and testable without tracking frontend internals.

## 2026-09-11: no `code` option, ever

The configuration parser rejects `code` as an unknown key and the test suite
asserts it. A wall tablet dashboard is readable by anyone at the tablet; a
code in YAML would be a code in a screenshot.

## 2026-09-11: idle wipe of a partial entry

Someone types three digits and walks away; the next person sees three dots.
`clear_after_ms` (default 30 s) wipes the partial entry, and disconnecting
the element wipes it too.
