````markdown

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

Happy automating! 🚀

---
