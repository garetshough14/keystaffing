# Key Staffing + GitPress

This directory contains the WordPress-ready version of the Key Staffing site for
[GitPress](https://github.com/westcoselabs/Gitpress) 1.2.5, verified against
upstream commit `24cd03f46770c65433bd28de679696f81fabd462`.

The original root HTML files remain as the standalone reference site. WordPress
uses the files in `gitpress/pages/` as page bodies and the files in
`gitpress/partials/` as the shared site header and footer.

## Existing WordPress page mapping

Use the site's existing WordPress pages and permalinks. Do not create the old
`/employers/`, `/staffing-guide/`, `/job-seekers/`, or `/about/` routes. The
managed navigation and active-page styles use the existing live URLs below.

| Existing WordPress page | Existing permalink | GitPress source |
| --- | --- | --- |
| Homepage | `/` | `gitpress/pages/home.html` |
| Request an Employee | `/services/request-an-employee/` | `gitpress/pages/employers.html` |
| Services | `/services/` | `gitpress/pages/services.html` |
| Consulting | `/services/consulting/` | `gitpress/pages/staffing-guide.html` |
| Job Seekers | `/office-and-industrial-jobs-bakersfield-ca/` | `gitpress/pages/job-seekers.html` |
| About Us | `/about-us/` | `gitpress/pages/about.html` |
| Contact Us | `/contact-us/` | `gitpress/pages/contact.html` |

In **Settings > Reading**, keep **Homepage** set as the static homepage.

Keep the existing **Refer a Friend**, **Search Jobs**, and other utility pages
unchanged. They do not need one of this repository's page-body shortcodes.

## GitPress settings

Install and activate GitPress, then open **WordPress Admin > GitPress**.
The repository is public, so a GitHub token is optional. A cache TTL of `3600`
seconds is a practical starting point when the push webhook is enabled.

Keep **Enable safe inner shortcode rendering inside GitHub HTML fragments**
checked. GitPress allowlists the `fluentform` shortcode, and the Contact Us
page uses `[fluentform id="3"]`.

Use this for **GitPress Managed Header Shortcode**:

```text
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/partials/header.html" branch="main" format="html" updated_meta="false"]
```

Use this for **GitPress Managed Footer Shortcode**:

```text
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/partials/footer.html" branch="main" format="html" updated_meta="false"]
```

The managed header contains the complete responsive stylesheet inside its own
`<style>` block. It does not import or link to a separate CSS file. This is
necessary because GitPress strips `<link>` tags and does not turn a separate
CSS file into a stylesheet.

After changing the canonical root `styles.css`, rebuild the inline header:

```powershell
powershell -ExecutionPolicy Bypass -File .\gitpress\build-inline-header.ps1
```

The script replaces the CSS placeholder in
`gitpress/partials/header.template.html` and writes the deployable
`gitpress/partials/header.html`. Commit both `styles.css` and the rebuilt
header.

## Attach each page

Edit each WordPress page and use its **GitPress Shortcode** metabox.

Choose:

- **Render Mode:** GitPress Managed
- **Shortcode:** the matching value below

```text
Homepage (`/`)
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/home.html" branch="main" format="html" updated_meta="false"]

Request an Employee (`/services/request-an-employee/`)
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/employers.html" branch="main" format="html" updated_meta="false"]

Services (`/services/`)
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/services.html" branch="main" format="html" updated_meta="false"]

Consulting (`/services/consulting/`)
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/staffing-guide.html" branch="main" format="html" updated_meta="false"]

Job Seekers (`/office-and-industrial-jobs-bakersfield-ca/`)
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/job-seekers.html" branch="main" format="html" updated_meta="false"]

About Us (`/about-us/`)
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/about.html" branch="main" format="html" updated_meta="false"]

Contact Us (`/contact-us/`)
[divi_github_content owner="garetshough14" repo="keystaffing" path="gitpress/pages/contact.html" branch="main" format="html" updated_meta="false"]
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
| Contact Us | Contact Key Staffing \| Bakersfield and Visalia | Contact Key Staffing for workforce solutions, employment opportunities, consulting support, or help from the Bakersfield and Visalia teams. |

## Important runtime behavior

- GitPress deliberately removes remote `<script>` tags. This repository no
  longer contains or references a JavaScript file.
- Navigation uses native `<details>` and `<summary>` elements, so the desktop
  and mobile menus work without repository JavaScript.
- Contact buttons use normal links instead of relying on the old JavaScript
  modal.
- The Contact Us page renders Fluent Form 3 through GitPress's approved inner
  shortcode feature. Fluent Forms must be active and form ID 3 must exist.
- Metrics render their final values immediately. Scroll-reveal content is made
  visible in GitPress mode, so no important content depends on JavaScript.
- Cookie consent should be handled by the WordPress site's consent/privacy
  plugin if tracking is added. The old localStorage-only notice is not loaded.
- Images use absolute jsDelivr URLs because relative repo asset paths would
  resolve against the WordPress page URL and break.
- The image CDN URLs require this repository to remain public. If the
  repository becomes private, move the images into the WordPress media layer
  and replace the CDN URLs; the GitPress token only authenticates the
  server-side HTML fetch.

## Cache invalidation

For immediate HTML updates, configure the GitHub push webhook shown in
**WordPress Admin > GitPress** and use the same webhook secret on both sides.
GitPress will invalidate only the changed cached paths. Because the CSS is
embedded in `header.html`, stylesheet changes appear after that header path is
rebuilt, pushed, and invalidated.



<!-- https://www.hirekeystaff.com/about-us/ -->
<!-- https://www.hirekeystaff.com/services/ -->
<!-- https://www.hirekeystaff.com/services/consulting/ -->
<!-- https://www.hirekeystaff.com/services/request-an-employee/ -->
<!-- https://www.hirekeystaff.com/office-and-industrial-jobs-bakersfield-ca/refer-a-friend/ -->
