# Abdul Vajid K | Portfolio (upgraded)

Black and gold animated portfolio. Static front end plus one Vercel serverless function.

## Files
- `index.html`, `home.css`, `home.js`  new home page
- `ai-tools.html`, `ai-script.js`, `ai-styles.css`, `styles.css`  AI tools dashboard (recolored to match)
- `ecommerce/`  Vaji's Store (recolored to match)
- `api/chat.js`  OpenAI chat endpoint used by the floating "vaji's AI" widget

## Deploy (Vercel)
1. Push this folder to GitHub and import it in Vercel.
2. In Project Settings > Environment Variables add `OPENAI_API_KEY`.
3. Redeploy. The chat widget calls `/api/chat`.

Opening `index.html` straight from your disk works for everything except the AI chat.

## Things to edit
- Add LinkedIn / other links in the footer when you have them.
- Replace the VulnScanner "See my GitHub" link with the direct repo URL.
- Add real screenshots or live links for new projects in the `.stack` section of `index.html`.
