# Image Specs

Use these as the default export targets for new website visuals so panels fill cleanly without custom overrides.

## Split hero media

- Target size: `2200 x 1600 px`
- Aspect ratio: `11:8` or close to `4:3`
- Safe area: keep critical faces, text, and diagram labels inside the center `80%`
- Default behavior in the site: `cover`

## Homepage feature visuals

- Target size: `2200 x 1400 px`
- Aspect ratio: `11:7`
- Safe area: center-weighted composition with at least `8%` margin on all sides
- Default behavior in the site: `cover`

## Cards and thumbnails

- Target size: `1600 x 1200 px`
- Aspect ratio: `4:3`
- Safe area: avoid placing important content tight to edges
- Default behavior in the site: `cover`

## Videos

- Target size: `1920 x 1080 px`
- Aspect ratio: `16:9`
- Keep the main subject centered since panel crops can tighten at smaller breakpoints

## Diagrams and sketches

- Preferred size: `2400 x 1600 px`
- Background: solid or transparent with generous outer padding
- If the full diagram must remain visible, mark that panel with a dedicated diagram class so it uses `contain`

## Rule of thumb

- Use `cover` for photos, collages, and cinematic visuals
- Use `contain` only for diagrams, maps, or illustrations that cannot be cropped
