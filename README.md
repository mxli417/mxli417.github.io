# Mxli's Personal Page

A small Jekyll-powered GitHub Pages site for my personal notes, engineering write-ups,
research-adjacent thoughts, and the occasional interactive experiment.

The site vendors [So Simple 3.2.0](https://github.com/mmistakes/so-simple-theme)
by Michael Rose. Theme files live in this repository so GitHub Pages branch builds
do not depend on a remote theme gem. Site-specific styles are kept separate in
`assets/css/site.scss`.

## At A Glance

- **Framework:** Jekyll, served by GitHub Pages.
- **Theme base:** Vendored So Simple 3.2.0 with local presentation overrides.
- **Main navigation:** Projects, Blog, Research, About me. Papers are collected under Research. Legal is linked in the footer.
- **Post organization:** Category folders under `_posts/`.
- **Math support:** Vendored KaTeX assets in `assets/katex/`.
- **Icons:** Vendored Font Awesome sprite/data in `assets/fontawesome/` and
  `_data/font-awesome/`.

## Current Structure

```text
.
|-- _config.yml              # Site title, navigation, social links, plugins, layout flags
|-- index.html               # Profile landing page with expertise, projects, and recent research
|-- projects.md              # Software, interactive tools, and research artifacts
|-- papers.md                # Standalone publication URL retained for existing links
|-- blog.md                  # Reverse-chronological article archive at /blog/
|-- notes.md                 # Notes category archive; outside the main navigation
|-- engineering.md           # Engineering category archive; outside the main navigation
|-- research.md              # Publications and selected research-led writing
|-- about_me.md              # Personal intro, image, and theme credit
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
|   |-- head.html            # Metadata and stylesheet links
|   |-- navigation.html      # Primary navigation
|   |-- masthead.html        # Site title and description
|   |-- footer.html          # Contact, RSS, and legal links
|   `-- read-time.html       # Estimated article reading time
|-- _sass/                   # Vendored So Simple Sass partials
|-- assets/
|   |-- css/                 # Theme, skin, and site-specific Sass entry points
|   |-- js/                  # TOC enhancement and the two-drawer search widget
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
- Blog lists all posts in reverse chronological order; Notes and Engineering use
  `_includes/archive.html` with category filters. Projects collects built software,
  tools, and repositories. Research collects publications and selected research-led
  writing; both are curated manually.
- Use `mathjax: true` in page/post front matter when KaTeX rendering is needed.
- Use `toc: true` on longer posts to generate an on-page table of contents from
  level-two and level-three headings.
- Custom interactive behavior belongs in `assets/js/`; custom presentation belongs
  in `assets/css/` or the Sass partials under `_sass/`.

## Local Development

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
filters instead.

Use Ruby 3.1 locally. The legacy Sass compiler required by the GitHub Pages-compatible
dependency set is not a reliable Ruby 4.0 combination. On Windows, install a Ruby
3.1 RubyInstaller build with MSYS2/DevKit, then confirm that the selected shell uses it:

```powershell
ruby --version
where.exe ruby
```

The first command should report `ruby 3.1.x`; `where.exe` should list that installation
before any Ruby 4 installation. Node.js 18 or later is sufficient for the dependency-free
JavaScript checks.

Install dependencies:

```powershell
gem install bundler -v 2.5.23
bundle _2.5.23_ install
```

Serve locally:

```powershell
bundle _2.5.23_ exec jekyll serve --livereload
```

Then open the local URL printed by Jekyll, usually `http://127.0.0.1:4000/`.
Check the homepage, `/projects/`, `/blog/`, `/research/`, and one long article at
both desktop and mobile widths. Verify keyboard focus, navigation wrapping, the
article table of contents, KaTeX rendering, and the two-drawer controls.

If Ruby 3.1 is not installed, Docker can run the compatible toolchain without
changing the system Ruby. From the repository root in PowerShell:

```powershell
docker run --rm -p 4000:4000 `
  -v "${PWD}:/source:ro" `
  -v mxli417-ruby-gems:/usr/local/bundle `
  ruby:3.1 bash -lc "cp -R /source /tmp/site && cd /tmp/site && rm -f Gemfile.lock && gem install bundler -v 2.5.23 --no-document && bundle _2.5.23_ install && bundle _2.5.23_ exec jekyll serve --host 0.0.0.0 --port 4000"
```

This serves a snapshot at `http://localhost:4000/`; stop it with `Ctrl+C` and rerun
the command after source changes. The named Docker volume caches installed gems.

## Deployment readiness

Before publishing, run:

```sh
node scripts/check-two-drawer.cjs
bundle exec jekyll build --safe
node scripts/check-site.cjs
bundle exec jekyll doctor
```

Use `JEKYLL_ENV=production` for the final build (in PowerShell:
`$env:JEKYLL_ENV = "production"`). The generated site is in `_site/`.
Build output and local caches are ignored; do not force-add them.

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
- **2026-11:** Migrated the locally vendored theme from Contrast to So Simple 3.2.0,
  preserving KaTeX and the interactive search article while adding responsive
  navigation, reading times, and generated article tables of contents.

Publication citations are shared through `_includes/papers.md` between Research
and the retained `/papers/` page.
