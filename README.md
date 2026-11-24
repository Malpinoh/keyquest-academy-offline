# KeyQuest Academy Offline

KeyQuest Academy Offline is the desktop edition of KeyQuest Academy. It is being prepared as a local-first Linux application: lessons, typing practice, games, guides and learner progress should work without an internet connection.

## Project goals

- Preserve the KeyQuest lesson curriculum, learning notes, guides, typing tests and games.
- Keep learner progress on the local device.
- Bundle application assets locally; do not require remote fonts, images, APIs or a hosted website.
- Remove advertising, analytics, cloud accounts and online-only services.
- Package the finished Linux application as a Debian `.deb` first, with AppImage as a later target.

## Development

This repository currently contains the React, TypeScript and TanStack source imported from the online KeyQuest project. The offline conversion is in progress; not every online dependency has been removed yet.

Install dependencies with Bun:

```sh
bun install
bun run dev
```

Build the web frontend:

```sh
bun run build
```

## Offline data

Typing sessions, lesson completion and daily goals are currently stored locally by the progress module. The desktop edition will use local application storage and must not require an account or cloud connection.

## Desktop packaging

The desktop shell will use Tauri 2. Linux packaging will target `.deb` first. The final package must include its frontend assets and must be tested with networking disabled before release.

## Repository separation

This repository is the offline desktop edition. The online KeyQuest Academy website remains in the separate `keyquest-academy` repository.
