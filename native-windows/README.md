# KeyQuest Academy — Native Windows edition

This is a separate native Windows application track. It does not embed Tauri, WebView2, a browser control, or the existing web frontend.

## Compatibility target

- Windows 7 Service Pack 1
- Windows 8
- Windows 8.1
- AnyCPU build intent, for both 32-bit and 64-bit Windows

The initial WPF project targets .NET Framework 4.6.1 to cover the older Windows versions. The runtime prerequisite and installer strategy must be validated on clean Windows 7 SP1, Windows 8, and Windows 8.1 machines before any release is called compatible.

## Development status

The first commit establishes the native WPF application shell and a forest-and-cream home screen. Navigation currently demonstrates the planned sections; lessons, typing engine, games, progress persistence, and the complete curriculum are not yet implemented in this native project.

## Planned stages

1. Native shell, branding, navigation, and installer/build pipeline.
2. Port the full 21-lesson curriculum and lesson-selection experience.
3. Implement native typing input, scoring, keyboard/finger guide, and tests.
4. Rebuild the typing games using native WPF controls and drawing.
5. Add local progress, settings, accessibility, and data backup.
6. Test on real Windows 7 SP1, Windows 8, and Windows 8.1 systems, including x86 and x64.

The existing Tauri app and the experimental legacy-windows-7-8 branch remain separate and untouched.
