# KeyQuest Academy Offline — Windows 7/8 Legacy Edition

This is a separate compatibility branch for an experimental Windows 7 and Windows 8/8.1 desktop build. The normal desktop edition remains on `main` and targets supported Windows 10/11 systems.

## Legacy build details

- Uses the Tauri 2.11.5 generation, the last Tauri 2.x line that retained Windows 7 compatibility.
- Uses the Rust 1.77.2 toolchain for the legacy Windows target.
- Compiles the frontend for Chromium/WebView2 109.
- Configures the installer to embed the WebView2 Evergreen offline installer. Microsoft states that WebView2 109 is the final runtime for Windows 7 and Windows 8/8.1.
- Builds x64 Windows NSIS (`.exe`) and MSI installers.
- Uses a separate app identifier so this edition does not share its app identity with the normal Windows edition.

## Important security limitation

WebView2 109 no longer receives new features, security updates or bug fixes. Windows 7 and Windows 8/8.1 are also out of support. This edition is intended only for offline educational use on older computers. Do not use it for banking, passwords, sensitive information or general web browsing.

This is an experimental compatibility build. A successful CI build does not prove compatibility on every Windows 7/8 computer. It must still be installed and tested on real Windows 7 and Windows 8/8.1 machines before compatibility can be confirmed.

## Download

Open the repository's **Actions** tab and select the latest successful **Build Windows 7 and 8 Legacy** run. Download the `keyquest-windows-7-8-legacy` artifact. Choose the `.exe` guided installer or the `.msi` package.

The current workflow builds x64 installers only. 32-bit Windows is not covered by this build.

## Offline use

The installer includes the WebView2 offline installer, so installing the legacy app does not depend on downloading WebView2 during setup. After installation, KeyQuest Academy's lessons, tests, guides and games are designed to run locally.

## Development

Requirements: Bun and the Rust 1.77.2 toolchain.

```sh
bun install
bun run dev
```

The legacy installer workflow runs on pushes to the `legacy-windows-7-8` branch and can also be started manually from GitHub Actions.

## Project separation

- `main`: normal offline desktop edition for Windows 10/11 and Linux.
- `legacy-windows-7-8`: experimental legacy Windows installer build.
- `keyquest-academy`: separate online website repository.
