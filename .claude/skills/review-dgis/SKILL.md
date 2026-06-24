---
name: review-dgis
description: Review the DGIS Fortaleza 2026 website before publishing — checks build, pages, content, images, links, and multilingual consistency. Run this before every git push.
---

You are a pre-publish website reviewer for the DGIS Fortaleza 2026 dental surgery course website (Astro + Tailwind, deployed on Vercel). Your job is to catch problems before they go live.

## How to run a full review

Work through every section below in order. Report a final verdict at the end.

---

## 1. Build check

Run the Astro build and confirm it succeeds with zero errors:

```bash
cd "C:/Users/user/Documents/Claude projects/website for DGIS"
npm run build 2>&1
```

If the build fails → **STOP**. Report the exact error. Do not continue.

---

## 2. What changed

Check the last commits and diff to know what to focus on:

```bash
cd "C:/Users/user/Documents/Claude projects/website for DGIS"
git log --oneline -10
git diff HEAD~1 --name-only
```

Read every changed `.astro` file in full.

---

## 3. Page availability check

Start the preview server, then verify every page returns HTTP 200:

```bash
cd "C:/Users/user/Documents/Claude projects/website for DGIS"
npm run preview &
sleep 4
```

Then check each page:

```bash
for path in "/" "/programa" "/horario" "/tecnicas" "/directores" "/sede" "/faq" "/inscripcion" "/descargar" "/landing" \
  "/fortaleza/ciudad" "/fortaleza/culinaria" \
  "/en/" "/en/program" "/en/schedule" "/en/techniques" "/en/faculty" "/en/venue" "/en/faq" "/en/registration" "/en/download" \
  "/en/fortaleza/ciudad" "/en/fortaleza/cuisine" \
  "/fr/" "/fr/programme" "/fr/horaire" "/fr/techniques" "/fr/directeurs" "/fr/lieu" "/fr/faq" "/fr/inscription" "/fr/telecharger" \
  "/fr/fortaleza/ville" "/fr/fortaleza/gastronomie"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321$path")
  echo "$code $path"
done
```

Flag any page that returns anything other than 200.

---

## 4. Image check

Verify every image referenced in the source files actually exists in `public/images/`:

```bash
grep -r "img_" "C:/Users/user/Documents/Claude projects/website for DGIS/src" --include="*.astro" -h | grep -o 'img_[^"'\'']*\.\(jpeg\|png\|jpg\|svg\|webp\)' | sort -u
ls "C:/Users/user/Documents/Claude projects/website for DGIS/public/images/"
```

Report any image referenced in code but missing from the folder.

---

## 5. Content review

Read and review these key pages for quality issues:

- [src/pages/index.astro](src/pages/index.astro) — Spanish homepage
- [src/pages/en/index.astro](src/pages/en/index.astro) — English homepage
- [src/pages/fr/index.astro](src/pages/fr/index.astro) — French homepage
- [src/pages/inscripcion.astro](src/pages/inscripcion.astro) — Registration page

Check for:

- Placeholder text (e.g. "Lorem ipsum", "TODO", "FIXME", "TBD", "XXX", "coming soon")
- Dates or prices that look incorrect (course is Nov 6–13, 2026 in Fortaleza)
- Broken or mismatched WhatsApp links
- HTML tags accidentally visible as text
- Inconsistent course name (should be "DGIS Fortaleza 2026")

---

## 6. Multilingual consistency

Read the Spanish, English, and French versions of the same page and verify:

- All three languages have the same sections
- No section exists in one language but is missing from another
- Navigation links point to the correct language paths (`/`, `/en/`, `/fr/`)

---

## 7. API route check

```bash
curl -s -X POST http://localhost:4321/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","language":"es"}' | head -c 200
```

If it returns a 500 error mentioning the API key → that is expected in local dev (key not set). Any other error is a real problem.

---

## Final verdict

After all checks, report:

```
## DGIS Pre-Publish Review

BUILD:     ✅ / ❌
PAGES:     ✅ all 200 / ❌ N broken
IMAGES:    ✅ all present / ❌ N missing
CONTENT:   ✅ clean / ❌ issues found
LANGUAGES: ✅ consistent / ❌ gaps found

### Issues to fix before publishing:
[list any blockers here]

### Safe to publish: YES / NO
```

If **NO** — list exactly what needs fixing.
If **YES** — confirm with: `git push` is clear to run.
