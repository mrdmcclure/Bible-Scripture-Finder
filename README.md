<div align="center">
<img width="1200" height="475" alt="GHBanner" src="scripture_finder_landing_page.png" />
</div>

# Scripture Finder

This is a simple, Gemini 3.0 powered app where you can type in any topic and it outputs 5-6 bible verses relevant to it.  In each verse displayed as a result, it gives a 1 sentence summary of how it is relevant to your  search criteria, lists from which translation it came from, and enables you to copy it.  If you want results from only one translation (such as NIV), you can add "NIV only" to the search.  Results will look like this:

<div align="center">
<img width="1200" height="475" alt="GHBanner" src=scripture_finder_search_screenshot.png" />
</div>


## Run Locally

**Prerequisites:**  Node.js, a Gemini API key

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

You will need a valid Gemini API key to run this app, which you can generate from Google AI Studio.

