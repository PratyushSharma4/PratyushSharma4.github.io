# Pratyush Sharma - Personal Website

This repository contains the source for my personal website: a richer, more interactive space for my research, writing, achievements, and academic profile.

## What the site now includes

- A redesigned landing page with a stronger narrative, animated hero section, and interactive highlights
- A better structured About section with clearer personal and academic positioning
- Dedicated pages for achievements, research, writing, hobbies, and contact
- Upgraded article pages for mathematical notes and puzzle explanations
- Shared styling and JavaScript for animations, mobile navigation, filters, scroll progress, theme persistence, and optional math rendering
- A configurable visitor alert hook through `site-config.js`

## Main files

- `index.html` - Homepage
- `achievements.html` - Academic and competition highlights
- `research.html` - Research interests, projects, and publication summary
- `blog.html` - Writing overview
- `hobbies.html` - Personal interests and games
- `contact.html` - Contact links and quick access cards
- `answer1.html` and `answer2.html` - Full article pages
- `styles.css` - Shared visual system and layout styling
- `script.js` - Client-side interactivity
- `site-config.js` - Optional visitor alert configuration

## Viewing the website

This website can still be opened directly in a browser as a static site, which makes it easy to deploy to GitHub Pages or replace the previous version without a build step.

## Notes

- If you want visit alerts, connect `visitorAlertWebhook` in `site-config.js` to your own backend or automation flow that sends email.
- Math rendering is only loaded on pages that opt in with `data-has-math="true"`.

## License

© 2026 Pratyush Sharma. All rights reserved.
