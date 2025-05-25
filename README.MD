````markdown
# Google-Form-Bot

Automate any Google Form in seconds.  
This script uses **Puppeteer** (Chrome + Node 22.14.0) to open a form, pick random answers, and hit **Submit** as many times as you need.

---

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the bot](#running-the-bot)
6. [Extending to other forms](#extending-to-other-forms)
7. [Troubleshooting](#troubleshooting)
8. [Ethical & legal notice](#ethical--legal-notice)

---

## Features
| Capability | Details |
|------------|---------|
| **Multiple submissions** | Controlled by `SUBMISSIONS`. |
| **Random answer pool**   | Answers are drawn from developer-defined arrays. |
| **Headless / GUI toggle**| One flag (`HEADLESS`) switches between CI mode and visual debugging. |
| **Human-like timing**    | `SLOWMO_MS` plus jitter helps bypass anti-bot heuristics. |
| **Language-agnostic submit** | Button found via XPath rather than fragile CSS classes. |
| **Single-file footprint**| All logic lives inside **`bot.js`**. |

---

## Prerequisites
| Tool | Version |
|------|---------|
| **Node.js** | **22.14.0** (or newer) |
| **npm** | ships with Node |
| **Google Chrome / Chromium** | Bundled automatically by Puppeteer |

Install dependencies:

```bash
npm install puppeteer
````

---

## Installation

```bash
git clone https://github.com/<your-org>/google-form-bot.git
cd google-form-bot
npm install
```

No global packages required—everything runs locally.

---

## Configuration

Open **`bot.js`** and review the constants at the top:

```js
const FORM_URL    = 'https://docs.google.com/forms/d/e/<id>/viewform';
const SUBMISSIONS = 50;      // total posts
const HEADLESS    = true;    // false = watch each run
const SLOWMO_MS   = 0;       // 100-200 ms helpful for debugging
```

### Answer pools

`OPTIONS` holds one key per question; each array contains the **exact visible text** (`aria-label`) for that option:

```js
const OPTIONS = {
  age:     ['20-30', '30-40', '40-55'],
  gender:  ['Female', 'Male'],
  // …
};
```

Add or remove keys as the form changes—no extra code needed.

### Submit-button selector

`bot.js` locates the submit button with this line:

```js
const SUBMIT_XPATH = '//span[normalize-space()="Enviar"]/ancestor::div[@role="button"]';
```

* Change **`Enviar`** if the form is in another language

  * Spanish form → `"Enviar"`
  * English form → `"Submit"`

Only the visible word inside the `<span>` must match; no other selector tweaks are necessary.

---

## Running the bot

```bash
node bot.js
```

Console output looks like:

```
✔️  Submission #1 completed { age: '30-40', gender: 'Female', … }
✔️  Submission #2 completed { age: '20-30', gender: 'Male',   … }
```

Set `HEADLESS = false` to watch every step in a real browser window.

---

## Extending to other forms

1. Duplicate **`bot.js`** and update `FORM_URL`.
2. Replace the arrays in `OPTIONS` with the new `aria-label` strings.
3. If the button text differs (e.g., “Submit”), update `SUBMIT_XPATH`.
4. Run—done!

---

## Troubleshooting

| Symptom                               | Fix                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Error: No node found for selector …` | The visible text in `OPTIONS` no longer matches. Inspect the element, copy its exact label, update the array. |
| Repeated HTTP 429 / throttling        | Lower `SUBMISSIONS` or add `await delay(1000)` between loops.                                                 |
| Script exits immediately              | Ensure you’re on **Node 22.14.0+** (`node -v`).                                                               |

---

## Ethical & legal notice

Google’s Terms of Service prohibit spam and unauthorized automation. **Run this bot only on forms you own or with explicit permission from the owner.**
The authors are **not responsible** for misuse or account sanctions.

---

Happy automating! 🚀

```
```
