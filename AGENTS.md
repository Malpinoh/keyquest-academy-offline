<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Practice features store data only through the guarded local-progress module; this preserves Phase 1 privacy and storage-failure recovery.
- Typing inputs use the shared append/backspace scoring helper; physical and mobile input must produce consistent accuracy.
- Lesson selection uses validated optional router search state and a keyed lesson view; navigation resets exercises without hydration-dependent browser reads.
- Session completion is guarded and based on wall-clock elapsed time; retries and delayed callbacks must not duplicate saved results.
