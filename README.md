# The-Written-Soul
Bilingual short stories in English & اردو by Abdullah Ilyas: a quiet, elegant reading website for tales of love, loss and memory. Plain HTML/CSS/JS.

# ✦ The Written Soul

**Bilingual short stories in English and اردو, written by Abdullah Ilyas.**

A quiet, elegant reading website for original fiction about love, loss, memory and the things we never say. Built with plain HTML, CSS and JavaScript, with no frameworks, no build step and no database.

## Features
- 10 original short stories, each readable in **English** and **اردو** (Nastaliq script, right-to-left)
- Night mode by default, with a light mode toggle that remembers the visitor's choice
- Search by title or feeling, plus category filters that build themselves from the stories
- Slide-in reading panel with adjustable text size, previous / next story, and shareable links (`index.html#story=the-last-train`)
- Fully responsive: phone, tablet and desktop
- Adding a story means editing one file (`stories.js`)

## Stories
Almost, But Never · A Stranger's Book · If We Had One More Day · The Last Train · Letters Never Sent · The Man in the Mirror · Where the Storm Ends · All in My Head · The Weight of Two Years · The Last Train from Platform Zero. And many more to come.

## Project structure
```
index.html   page layout
style.css    colours, fonts and layout (theme colours at the top)
script.js    search, filters and reader (rarely needs editing)
stories.js   all story content
README.md    this file
```

## Run locally
Download or clone the repository and open `index.html` in any browser. No installation is needed. An internet connection is only used to load the Google Fonts.

## Publish with GitHub Pages
1. Upload the **contents** of this folder (not the zip) to the root of your repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After about a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

It also works on Netlify or Vercel: leave the build command empty and set the publish directory to `.`

## How to add a new story (3 steps)
1. Open `stories.js` and scroll to the bottom, to the line `ADD NEW STORIES BELOW THIS LINE`.
2. Put a **comma** after the closing `}` of the last story, then paste the template below *above* that marker line and fill it in.
3. Save and refresh the page. The card, filter button, story count and reader appear automatically.

### Template (copy this)
```js
,
{
  "id": "my-new-story",
  "title": "My New Story",
  "urduTitle": "میری نئی کہانی",
  "category": "Emotional",
  "genre": "Drama · Hope",
  "readingTime": "5 min",
  "quote": "One memorable line from the story.",
  "urduQuote": "کہانی کی ایک یادگار سطر۔",
  "cover": "dusk",
  "symbol": "✦",
  "english": [
    "First paragraph.",
    "Second paragraph.",
    "\"A line of dialogue,\" she said."
  ],
  "urdu": [
    "پہلا پیراگراف۔",
    "دوسرا پیراگراف۔"
  ]
}
```

### Field guide
- `id`: unique, lowercase, hyphens, no spaces (never reuse one).
- `title` / `urduTitle`: titles. `urduTitle` is optional.
- `category`: any word you like. A **new** category gets its own filter button automatically.
- `genre`: short tagline on the card, e.g. `Romance · Regret`.
- `readingTime`: e.g. `6 min`.
- `quote` / `urduQuote`: the line shown on the card and above the story.
- `cover`: `dusk`, `ink`, `sky`, `rail`, `rose`, `mirror`, `storm`, `mist`, `ember`, `night` or `default`.
- `symbol`: the big symbol or text on the card cover (e.g. `✉`, `∞`, `07:15`).
- `english` / `urdu`: the story, **one quoted line per paragraph**, separated by commas. Each line becomes its own paragraph, so your layout is kept.
  - Use `*single stars*` for *italics* and `**double stars**` for **bold**.
  - Inside a paragraph, write a double quote as `\"` (or use curly quotes “ ”).
- English-only story? Delete the `"urdu"` and `"urduTitle"` lines. The Urdu button hides itself.

### Common mistakes
- A missing comma between two stories makes the site go blank.
- A missing comma between paragraphs.
- A plain `"` inside a paragraph without the `\`.

## Customising
- Colours and fonts: top of `style.css`.
- Author name: search for "Abdullah Ilyas" in `index.html`.

## Copyright
All stories and text are original work © Abdullah Ilyas. All rights reserved. Please do not copy or republish the stories without permission.
