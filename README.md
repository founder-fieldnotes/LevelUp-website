# LevelUp Economy Website

Static institutional website prototype for LevelUp Economy.

## What this is

This is a plain HTML, CSS, and JavaScript site designed to position LevelUp as a holistic economic growth strategist and ecosystem builder rather than a course company.

The current build includes:
- institutional homepage
- about and approach pages
- pillar detail pages
- initiative detail pages
- insights archives and first detail pages
- program detail pages
- LevHub overview
- partnership, funding, and subscription pages

## Structure

Key files and folders:
- `index.html` - homepage
- `styles/site.css` - shared visual system
- `scripts/site.js` - shared navigation and interaction logic
- page folders such as `about/`, `initiatives/`, `insights/`, `programs/`, `levhub/`

## Local preview

Because this is a static site, the easiest local preview is with Python:

```bash
cd "/Users/mitchellrobertson/Documents/My Projects/LevelUp-website"
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/`

## GitHub Pages

This site should work on GitHub Pages as a standard static site because it uses relative links and folder-based `index.html` pages.

Recommended steps:
1. Push this folder to a GitHub repository.
2. In GitHub, enable Pages for the branch you want to publish.
3. Use the repository root as the publishing source.
4. Wait for GitHub Pages to build and publish the site.

## Notes

- Fonts are loaded from Google Fonts, so the deployed site needs normal internet access for those to render.
- No build step is required.
- Forms are currently static placeholders and `mailto:` links.
- A browser QA pass is still recommended before public launch.
