# Mxli's Personal Page

A small Jekyll-powered GitHub Pages site for my personal notes, engineering write-ups,
research-adjacent thoughts, and the occasional interactive experiment.

The site is built on the [Contrast theme](https://github.com/niklasbuschmann/contrast)
by [Niklas Buschmann](https://github.com/niklasbuschmann). Local changes live in
this repository so the page can stay lightweight, personal, and easy to tweak.

## At A Glance

- **Framework:** Jekyll, served by GitHub Pages.
- **Theme base:** Contrast by Niklas Buschmann.
- **Main content buckets:** Notes, Engineering, Research, About me, Legal Note.
- **Post organization:** Category folders under `_posts/`.
- **Math support:** Vendored KaTeX assets in `assets/katex/`.
- **Icons:** Vendored Font Awesome sprite/data in `assets/fontawesome/` and
  `_data/font-awesome/`.

## Current Structure

```text
.
|-- _config.yml              # Site title, navigation, social links, plugins, layout flags
|-- index.html               # Home page; currently renders the full post archive
|-- notes.md                 # Notes landing page, filtered to notes posts
|-- engineering.md           # Engineering landing page, filtered to engineering posts
|-- research.md              # Research landing page, filtered to research posts
|-- about_me.md              # Personal intro and theme credit
|-- legal.md                 # Legal note / imprint-style page
|-- archive.html             # General archive page
|-- 404.html                 # Not-found page
|-- _posts/
|   |-- notes/               # Shorter notes and loose thoughts
|   |-- engineering/         # Build notes, tools, projects, implementation write-ups
|   `-- research/            # Paper notes, methods, and structured research thoughts
|-- _layouts/
|   |-- default.html         # Site shell: head, header, navigation, footer
|   |-- page.html            # Generic page layout
|   `-- post.html            # Blog post wrapper
|-- _includes/
|   |-- archive.html         # Archive list component, with optional category filtering
|   |-- home.html            # Excerpt-based home listing when enabled
|   |-- menu.html            # Navigation renderer
|   |-- meta.html            # Post metadata renderer
|   |-- sidebar.html         # Optional sidebar navigation
|   |-- legal_footer.html    # Footer legal text/link area
|   `-- embed.html           # Small embed helper
|-- _sass/                   # Core theme Sass partials
|-- assets/
|   |-- css/                 # Sass/CSS entry points and custom styles
|   |-- js/                  # Custom browser scripts, including the two-drawer search widget
|   |-- fonts/               # Local PT Sans files and license
|   |-- fontawesome/         # Icon sprite
|   |-- katex/               # Local KaTeX distribution
|   `-- *.png                # Image assets used by posts/pages
|-- thought_archive/         # Personal archive material kept outside the main Jekyll post flow
|-- Gemfile                  # Jekyll and plugin dependencies
`-- UNLICENSE.txt            # Repository license text
```

## Editing Notes For Future Me

- Change site-level metadata, navigation, external links, and layout switches in
  `_config.yml`.
- Add a new post as Markdown under the matching `_posts/<category>/` folder using
  Jekyll's `YYYY-MM-DD-title.md` naming convention.
- Add a new top-level page by creating a Markdown or HTML file with front matter,
  then add it to `navigation` in `_config.yml` if it should appear in the menu.
- The section pages use `_includes/archive.html` with a category filter. If a post
  does not show up where expected, check its folder/category and front matter.
- Use `mathjax: true` in page/post front matter when KaTeX rendering is needed.
- Custom interactive behavior belongs in `assets/js/`; custom presentation belongs
  in `assets/css/` or the Sass partials under `_sass/`.

## Local Development

The current portfolio has dedicated `/projects/` and `/papers/` pages. Maintain
the local working checklist in `BACKLOG.md` (gitignored and excluded from the generated site).
Run `node scripts/check-two-drawer.cjs` to verify the interactive search model.

### Search indexing

Production canonical URLs use `https://mxli417.github.io`. The build generates
`/sitemap.xml` and `/robots.txt`; `/blog/` is the explicit blog route.
After deployment, submit the sitemap in Google Search Console and inspect the
homepage and individual post URLs. Google does not guarantee indexing.
On 2026-09-30, the live site returned HTTP 200 but still served January content;
its homepage had no `noindex` directive and `/robots.txt` returned 404. A missing
robots file does not prohibit crawling. Search Console is needed to distinguish
discovery, crawl, canonicalization, and indexing issues.

See [Google's indexing guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

Install dependencies:

```sh
bundle install
```

Serve locally:

```sh
bundle exec jekyll serve
```

Then open the local URL printed by Jekyll, usually `http://127.0.0.1:4000/`.

## Deployment readiness

Before publishing, run:

```sh
node scripts/check-two-drawer.cjs
bundle exec jekyll build --safe
bundle exec jekyll doctor
```

Use `JEKYLL_ENV=production` for the final build (in PowerShell:
`$env:JEKYLL_ENV = "production"`). The generated site is in `_site/`.
`BACKLOG.md` and `thought_archive/` are excluded from the build and ignored by Git;
do not force-add them. Build output and local caches are ignored too.

This repository has no custom deployment workflow. Retain the existing GitHub
Pages publishing source in repository Settings → Pages when publishing the
reviewed changes. Check the Pages build/deployment result after pushing and verify
`/papers/`, `/projects/`, `/research/`, `/blog/`, `/sitemap.xml`, and `/robots.txt`.
The source changes alone do not deploy the site.

## Change History

- **2022-05-29:** Repository initialized.
- **2026-06:** Site refreshed into a categorized personal page with Notes,
  Engineering, Research, About me, and Legal Note sections.
