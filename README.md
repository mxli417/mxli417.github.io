# Mxli's Personal Page

A small Jekyll-powered GitHub Pages site for my personal notes, engineering write-ups,
research-adjacent thoughts, and the occasional interactive experiment.

The site is built on the [Contrast theme](https://github.com/niklasbuschmann/contrast)
by [Niklas Buschmann](https://github.com/niklasbuschmann). Local changes live in
this repository so the page can stay lightweight, personal, and easy to tweak.

## At A Glance

- **Framework:** Jekyll, served by GitHub Pages.
- **Theme base:** Contrast by Niklas Buschmann.
- **Main navigation:** Projects, Blog, Research, About me. Papers are collected under Research. Legal is linked in the footer.
- **Post organization:** Category folders under `_posts/`.
- **Math support:** Vendored KaTeX assets in `assets/katex/`.
- **Icons:** Vendored Font Awesome sprite/data in `assets/fontawesome/` and
  `_data/font-awesome/`.

## Current Structure

```text
.
|-- _config.yml              # Site title, navigation, social links, plugins, layout flags
|-- index.html               # Homepage introduction and publication links
|-- projects.md              # Featured articles and interactive examples
|-- papers.md                # Standalone publication URL retained for existing links
|-- blog.md                  # Ordered post archive and project notes at /blog/
|-- notes.md                 # Notes category archive; outside the main navigation
|-- engineering.md           # Engineering category archive; outside the main navigation
|-- research.md              # Research interests, full paper citations, and discussion article
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
|-- scripts/                 # Two-drawer model and widget checks; excluded from the site
|-- robots.txt               # Crawler guidance and sitemap location
|-- sitemap.xml              # Generated page and post URL list
|-- .gitattributes           # LF text policy with binary and Windows-script exceptions
|-- .editorconfig            # Matching editor defaults
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
- Blog lists all posts; Notes and Engineering use `_includes/archive.html` with
  category filters. Projects and Research are curated manually, so publishing a post
  does not automatically feature it there.
- Use `mathjax: true` in page/post front matter when KaTeX rendering is needed.
- Custom interactive behavior belongs in `assets/js/`; custom presentation belongs
  in `assets/css/` or the Sass partials under `_sass/`.

## Local Development

Optional local planning files (`BACKLOG.md` and `thought_archive/`) are gitignored
and excluded from the generated site; they are not part of a fresh clone.
Run `node scripts/check-two-drawer.cjs` to verify the interactive search model.

### Search indexing

Production canonical URLs use `https://mxli417.github.io`. The build generates
`/sitemap.xml` and `/robots.txt`; `/blog/` is the explicit blog route.
After deployment, submit the sitemap in Google Search Console and inspect the
homepage and individual post URLs. Google does not guarantee indexing.
Use Search Console to distinguish discovery, crawl, canonicalization, and indexing
issues; local build checks cannot establish whether Google has indexed a page.

See [Google's indexing guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

The Gemfile pins Jekyll 3.10.0 and the Sass/Markdown renderer versions used by
GitHub Pages branch builds. Validate with these versions, not Jekyll 4: compound
conditions inside `where_exp` are not supported by Jekyll 3.10. Chain separate
filters instead. The local Ruby version and optional Pages plugins may still differ.

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

Publish changes through a pull request from `staging` into `master`. Review the
diff and any configured checks before merging. This repository has no custom
deployment workflow; confirm the publishing branch in Settings → Pages. If it is
`master`, merging the PR triggers the Pages build.

Check the Pages build/deployment result after merging and verify
`/papers/`, `/projects/`, `/research/`, `/blog/`, `/sitemap.xml`, and `/robots.txt`.
Local commits and pushes to a branch other than the configured publishing source
do not publish the site.

## Change History

- **2022-05-29:** Repository initialized.
- **2026-06:** Site refreshed into a categorized personal page with Notes,
  Engineering, Research, About me, and Legal Note sections.

- **2026-09:** Added dedicated Papers and Projects pages, the contextual hate-speech
  discussion, and the interactive optimal-search walkthrough. Simplified navigation
  and the homepage, added indexing metadata, and kept detailed plans private.

Blog pins Welcome, MLflow to Go, and vbot first, followed by remaining posts in
reverse chronological order. Publication citations are shared through
`_includes/papers.md` between Research and the retained `/papers/` page.
