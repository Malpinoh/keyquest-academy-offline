# KeyQuest Academy — Native Windows edition

This is a separate native Windows application track. It does not embed Tauri, WebView2, a browser control, or the existing web frontend.

## Compatibility target

- Windows 7 Service Pack 1
- Windows 8
- Windows 8.1
- AnyCPU build intent, for both 32-bit and 64-bit Windows

The initial WPF project targets .NET Framework 4.6.1 to cover the older Windows versions. The runtime prerequisite and installer strategy must be validated on clean Windows 7 SP1, Windows 8, and Windows 8.1 machines before any release is called compatible.

## Development status

The native WPF shell now includes the imported 21-lesson curriculum, lesson and exercise selection, a live typing practice screen with WPM/accuracy/character feedback, a keyboard and finger-placement reference, and local exercise-completion records saved under the current Windows user profile. A native 60-second Typing Sprint game is now included with countdown, live WPM, accuracy, correct-character scoring, restart, and offline operation. Additional game modes, game-score history, settings, accessibility refinements, backup/export, and clean-machine OS compatibility testing remain outstanding.

## Planned stages

1. Native shell, branding, navigation, and installer/build pipeline.
2. Port the full 21-lesson curriculum and lesson-selection experience.
3. Implement and verify native typing input, scoring, and the keyboard/finger-placement guide.
4. Expand the native Typing Sprint into additional game modes and add game-score history.
5. Expand local progress, settings, accessibility, and data backup.
6. Test on real Windows 7 SP1, Windows 8, and Windows 8.1 systems, including x86 and x64.

The existing Tauri app and the experimental legacy-windows-7-8 branch remain separate and untouched.
