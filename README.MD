````markdown
# Google-Form-Bot

Automate any Google Form in seconds.  
**Google-Form-Bot** uses [Puppeteer](https://pptr.dev/) (Chromium-for-Node) to open a form, choose random answers, and press **Submit** as many times as you like.

---

## ✨ Features

| Capability | Details |
| ---------- | ------- |
| **Multiple submissions** | Controlled by the `SUBMISSIONS` constant. |
| **Random answers** | Each question pulls from a developer-defined pool. |
| **Headless ⇄ GUI toggle** | `HEADLESS` lets you watch the browser while debugging. |
| **Human-like delays** | `SLOWMO_MS` + jitter dodge basic anti-bot heuristics. |
| **Language-agnostic submit** | XPath finds the button regardless of page language. |
| **Single-file footprint** | All logic lives in **`bot.js`**. |

---

## 📋 Prerequisites

| Tool | Version |
|------|---------|
| **Node.js** | **22.14.0** (or newer) |
| **npm** | ships with Node |
| **Chrome / Chromium** | Bundled automatically by Puppeteer |

Install the only runtime dependency:

```bash
npm install puppeteer
````

---

## 📦 Installation

```bash
git clone https://github.com/Advinson/google-form-bot.git
cd google-form-bot
npm install
```

No global packages required—everything runs locally.

---

## ⚙️ Configuration

Open **`bot.js`** and review the constants at the top:

```js
const FORM_URL    = 'https://docs.google.com/forms/d/e/<id>/viewform';
const SUBMISSIONS = 50;   // how many times to post
const HEADLESS    = true; // false = watch the browser window
const SLOWMO_MS   = 0;    // 100-200 ms is handy for debugging
```

### Answer pools

`OPTIONS` holds one key per question; each array contains the **exact visible text** (`aria-label`) of every option:

```js
const OPTIONS = {
  age:     ['20-30', '30-40', '40-55'],
  gender:  ['Female', 'Male'],
  // …
};
```

Add / remove keys as the form evolves—no other code changes needed.

### Submit-button selector

`bot.js` locates the submit button with:

```js
const SUBMIT_XPATH =
  '//span[normalize-space()="Enviar"]/ancestor::div[@role="button"]';
```

> **Change the word inside the XPath** if the form language differs:
> • Spanish → `"Enviar"`
> • English → `"Submit"`

Only the visible word inside the `<span>` must match; no further tweaks are necessary.

---

## ▶️ Running the bot

```bash
node bot.js
```

Typical console output:

```
✔️  Submission #1 completed { age: '30-40', gender: 'Female', … }
✔️  Submission #2 completed { age: '20-30', gender: 'Male',   … }
```

Set `HEADLESS = false` to watch every click in real time.

---

## 🔄 Extending to other forms

1. Copy **`bot.js`** and update `FORM_URL`.
2. Replace the arrays in `OPTIONS` with the new option labels.
3. If the button text changes (e.g., “Submit”), update `SUBMIT_XPATH`.
4. Run—done!

---

## 🛠 Troubleshooting

| Symptom                               | Fix                                                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Error: No node found for selector …` | A label in `OPTIONS` no longer matches the form. Inspect the element, copy its exact text, update the array. |
| HTTP 429 / throttling                 | Lower `SUBMISSIONS` or add `await delay(1000)` between loops.                                                |
| Script exits immediately              | Verify Node ≥ 22.14.0 with `node -v`.                                                                        |

---

