# Security Policy

## Reporting a vulnerability

Do not open a public issue containing exploit details or private network
information. Use GitHub's private vulnerability-reporting feature for this
repository. If private reporting is unavailable, open a minimal issue asking
the maintainer to establish a private channel; omit technical details.

Include the affected version/commit, prerequisites, impact, a minimal
reproduction, and suggested remediation. Remove entity ids, hostnames, and
any other private installation details from reports and logs.

## Response targets

These are project targets, not an SLA: acknowledge critical/high reports in
three business days, establish severity and containment in seven, and publish
a coordinated fix as soon as safely validated. Lower-severity issues are
prioritized by exploitability and impact.

## Supported version

Only the latest published release and the default branch receive security
fixes.

## Security boundaries

Keypad Card is a dashboard card: frontend code that runs in the browser with
the same access to Home Assistant's websocket API as any other authenticated
dashboard resource. It has no server-side component and cannot escalate the
viewing user's permissions. Its only privileged action is the
`alarm_control_panel` action the viewing user's own account is already
allowed to call. The code typed into it is held in the element's memory
between key presses and that call; the card never stores it. Whether a code
is right is decided by the integration and the panel behind the entity, not
by the card.
