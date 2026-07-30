# Key Staffing + GitPress

This directory contains the WordPress-ready version of the Key Staffing site for
[GitPress](https://github.com/westcoselabs/Gitpress) 1.2.5, verified against
upstream commit `24cd03f46770c65433bd28de679696f81fabd462`.

The original root HTML files remain as the standalone reference site. WordPress
uses the files in `gitpress/pages/` as page bodies and the files in
`gitpress/partials/` as the shared site header and footer.

## Required WordPress page slugs

Create or rename the WordPress pages so their permalinks match this table.
The root-relative links and GitPress active-navigation logic depend on these
slugs.

| WordPress page | Slug | GitPress source |
| --- | --- | --- |
| Home | site front page | `gitpress/pages/home.html` |
| Employers | `employers` | `gitpress/pages/employers.html` |
| Services | `services` | `gitpress/pages/services.html` |
| Staffing Guide | `staffing-guide` | `gitpress/pages/staffing-guide.html` |
| Job Seekers | `job-seekers` | `gitpress/pages/job-seekers.html` |
| About KSC | `about` | `gitpress/pages/about.html` |

In **Settings > Reading**, set **Home** as the static homepage.

## GitPress settings

Install and activate GitPress, then open **WordPress Admin > GitPress**.
The repository is public, so a GitHub token is optional. A cache TTL of `3600`
seconds is a practical starting point when the push webhook is enabled.

Use this for **GitPress Managed Header Shortcode**:

```text
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/partials/header.html" branch="main" format="html" updated_meta="false"]
```

Use this for **GitPress Managed Footer Shortcode**:

```text
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/partials/footer.html" branch="main" format="html" updated_meta="false"]
```

The managed header imports the Google fonts and the canonical root
`styles.css` through jsDelivr. This is necessary because GitPress strips
`<link>` tags and does not turn a separate CSS file into a stylesheet.
When `styles.css` changes, update the `?v=` value in
`gitpress/partials/header.html` so browsers and the CDN fetch the new version.

## Attach each page

Edit each WordPress page and use its **GitPress Shortcode** metabox.

Choose:

- **Render Mode:** GitPress Managed
- **Shortcode:** the matching value below

```text
Home
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/home.html" branch="main" format="html" updated_meta="false"]

Employers
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/employers.html" branch="main" format="html" updated_meta="false"]

Services
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/services.html" branch="main" format="html" updated_meta="false"]

Staffing Guide
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/staffing-guide.html" branch="main" format="html" updated_meta="false"]

Job Seekers
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/job-seekers.html" branch="main" format="html" updated_meta="false"]

About KSC
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/about.html" branch="main" format="html" updated_meta="false"]
```

## SEO fields

GitPress removes a remote document's `<head>`, `<title>`, and `<meta>` tags.
Set these values on the WordPress pages (or in the site's SEO plugin):

| Page | SEO title | Meta description |
| --- | --- | --- |
| Home | Key Staffing \| Workforce Success Starts Here | Choose the Key Staffing experience built for employers or candidates. Workforce strategy, staffing, recruiting, and direct access to industrial and logistics opportunities. |
| Employers | Key Staffing Employers \| Stabilize Your Workforce | Workforce strategy and staffing solutions for industrial, manufacturing, logistics, and healthcare employers who want more than resumes. |
| Services | Key Staffing Services \| Strategy, Staffing, Recruiting, and HR Support | Detailed Key Staffing service offerings, pricing clarity, and the no-BS explanation of what your staffing investment actually covers. |
| Staffing Guide | How Staffing Actually Works \| Key Staffing | A direct guide to why staffing feels broken, how bill rates actually work, and what employers can do to build a better hiring system. |
| Job Seekers | Key Staffing Job Seekers \| Find the Right Opportunity | Explore the candidate experience at Key Staffing and connect to jobs in industrial, logistics, manufacturing, healthcare, and operations environments. |
| About KSC | About KSC \| Key Staffing & Consulting | Learn about Key Staffing & Consulting, its mission, values, branch locations, impact, leadership team, and what makes KSC different. |

## Important runtime behavior

- GitPress deliberately removes remote `<script>` tags. The WordPress pages do
  not load the root `script.js`.
- Navigation remains interactive because GitPress Managed mode supplies the
  mobile-menu and active-link script for the IDs used in `header.html`.
- Contact buttons use normal links to the branch section instead of relying on
  the old JavaScript modal.
- Metrics render their final values immediately. Scroll-reveal content is made
  visible in GitPress mode, so no important content depends on JavaScript.
- Cookie consent should be handled by the WordPress site's consent/privacy
  plugin if tracking is added. The old localStorage-only notice is not loaded.
- Images use absolute jsDelivr URLs because relative repo asset paths would
  resolve against the WordPress page URL and break.
- The CSS and image CDN URLs require this repository to remain public. If the
  repository becomes private, move those assets into the WordPress media/theme
  layer and replace the CDN URLs; the GitPress token only authenticates the
  server-side HTML fetch.

## Cache invalidation

For immediate HTML updates, configure the GitHub push webhook shown in
**WordPress Admin > GitPress** and use the same webhook secret on both sides.
GitPress will invalidate only the changed cached paths. The imported CSS uses
its separate `?v=` cache token as described above.
