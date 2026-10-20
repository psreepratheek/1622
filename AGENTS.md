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

## Project rules
- All personal copy, photo paths, password and flags live in `src/data/content.ts`; components only read from it (so the owner can edit content without touching code).
- The story is a single route (`/`) driven by a step state machine in `src/components/birthday/BirthdayApp.tsx`; each screen is its own component in that folder (one screen visible at a time, with AnimatePresence transitions).
- Anything random or window-dependent (particles, counters, media queries) renders only after mount to avoid SSR hydration mismatches.
