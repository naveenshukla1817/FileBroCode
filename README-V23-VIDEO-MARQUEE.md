# FileBroCode v23 — Video-Reference Marquee

This version replaces the previous orbital/circular treatment with a video-reference style floating file-logo field across the hero.

## Visual behavior
- File logos enter from varied edges and travel on calm, curved/diagonal trajectories.
- Each logo grows slightly as it passes through the hero and fades before its invisible loop reset.
- Multiple trajectories and staggered negative delays keep the field continuously populated.
- No orbit rings, no individual logo cards, no central FileBro logo, and no React frame-by-frame state updates.
- The hero copy remains above the marquee so the animation acts as a background visual layer.
- Reduced-motion users get a static, low-distraction hero field.

## Changed files
- `components/FileOrbit.tsx`
- `app/globals.css`

The rest of the application remains untouched by the marquee implementation.
