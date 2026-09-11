# Operations

## Gate

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and the
committed `dist/keypad-card.js` must equal a fresh build (`git diff
--exit-code -- dist`). Node 22 in WSL on the workstation; the same jobs run in
`validate.yaml`.

## Release path

`VERSION` is the single shipped version field (CalVer `YYYY.MM.DD.N`,
America/Chicago). A merge to `main` runs `release.yml`, which rebuilds,
refuses drift, tags `v<VERSION>`, and attaches `dist/keypad-card.js`.
`prepare-release.yml` then opens the next bump PR through the release GitHub
App; it needs the repository variable `RELEASE_AUTOMATION_CLIENT_ID` and the
secret `RELEASE_AUTOMATION_PRIVATE_KEY`.

## Branch protection

Applied after the first green run on `main`: `Lint, typecheck, test, build`,
`Committed dist matches a fresh build`, `CodeQL`, `npm audit`; strict,
enforce admins, conversation resolution, no force push, no deletion.
