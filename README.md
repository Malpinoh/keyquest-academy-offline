# KeyQuest Academy Offline

The local-first desktop edition of KeyQuest Academy. The project is being packaged for Linux as a Debian installer (`.deb`) and an AppImage.

## What the desktop app is designed to do

- Run lessons, typing tests, games and learning guides without an internet connection.
- Save practice progress locally on the device.
- Bundle its interface and assets in the desktop application.
- Avoid website hosting, cloud accounts, advertising, analytics and remote fonts.
- Preserve the KeyQuest learning content and classroom-inspired design.

## Linux downloads

When a build completes, open the repository's **Actions** tab, select the latest **Build Linux installers** run, and download the `keyquest-linux-installers` artifact. It contains the `.deb` and `.AppImage` packages.

A tagged release (for example, `v1.0.0`) will also publish the installer files on the repository's Releases page.

### Install the Debian package

1. Download the `.deb` file.
2. Open your Downloads folder.
3. Double-click the installer.
4. Open it with Linux Mint's Software Manager or package installer.
5. Select **Install**.

No Terminal commands are required for the normal installation flow. Linux Mint may ask for your administrator password to install software.

### Run the AppImage

1. Download the `.AppImage` file.
2. Right-click it and open **Properties**.
3. Under **Permissions**, enable **Allow executing file as program**.
4. Double-click the file to launch KeyQuest Academy.

The AppImage is portable; it does not install a menu entry automatically.

## Development

Requirements: Bun, Rust, and the Linux system libraries required by Tauri 2.

```sh
bun install
bun run dev
```

Run the native desktop shell during development:

```sh
bun run dev:desktop
```

Build the desktop bundles locally:

```sh
bun run build
bun run tauri build --bundles deb,appimage
```

The GitHub Actions workflow builds Linux installers automatically when changes are pushed to `main`, and can also be run manually from the Actions tab.

## Project separation

This repository is the offline desktop edition. The online KeyQuest Academy website remains in the separate `keyquest-academy` repository.
