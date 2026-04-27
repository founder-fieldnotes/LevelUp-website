# Image Specs

Use these as the permanent media-slot rules for the site. The key idea is:

- every panel has a slot type
- every asset is exported for that slot
- the HTML declares the intended fit mode

Do not drop raw source files into a panel and hope CSS fixes it.

## Slot types

### `cover`

Use for:

- photos
- collages
- editorial portraits
- video loops where edge cropping is acceptable

Markup:

- `data-media-fit="cover"`

Export rules:

- target artboard: `2200 x 1600 px`
- ratio: `11:8`
- keep the subject centered
- assume the outer `8%` may crop on smaller screens

### `contain`

Use for:

- diagrams
- maps
- frameworks
- tables
- illustrations that must stay fully visible

Markup:

- `data-media-fit="contain"`

Export rules:

- target artboard: `2200 x 1600 px`
- ratio: `11:8`
- trim dead whitespace before export
- keep outer padding tight: roughly `4%` to `6%`
- never leave large blank canvas around the content

### `contain-tight`

Use for:

- homepage diagrams
- system maps
- dense frameworks that should fill as much of the panel as possible without cropping

Markup:

- `data-media-fit="contain-tight"`

Export rules:

- target artboard: `2200 x 1600 px`
- ratio: `11:8`
- trim dead whitespace aggressively before export
- keep outer padding very small: roughly `2%` to `4%`
- this is the right mode when the asset must remain fully visible but still feel large in the frame

## Default sizes by section

### Split hero panels

- export size: `2200 x 1600 px`
- default mode:
  - photos/video stills: `cover`
  - diagrams/frameworks: `contain` or `contain-tight`

### Homepage paired visuals

- export size: `2200 x 1600 px`
- default mode:
  - photo/collage: `cover`
  - animated systems model / framework art: `contain-tight`

### Cards and thumbnails

- export size: `1600 x 1200 px`
- ratio: `4:3`
- default mode: `cover`

### Video masters

- export size: `1920 x 1080 px`
- ratio: `16:9`
- when used inside framed website panels, also prepare:
  - a poster image at `2200 x 1600`
  - or a panel-specific export if full visibility matters

## Never again rules

- Never use a diagram with large built-in white margins.
- Never use different artboard ratios for assets that share the same panel type.
- Never rely on filename detection alone when adding new media.
- Always set the intended fit in the markup:
  - `cover`
  - `contain`
  - `contain-tight`

## Quick rule of thumb

- If cropping is okay: `cover`
- If nothing can be cropped: `contain`
- If nothing can be cropped and it still needs to feel big: `contain-tight`
