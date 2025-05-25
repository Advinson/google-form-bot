/**
 * Google-Forms Bot
 * ----------------
 * Automates multiple submissions to a single Google Form using Puppeteer.
 *
 * 1.  Configuration constants (URL, # of submissions, “headless” mode, etc.) appear at the top so that
 *     future maintainers can tweak behaviour without touching the core logic.
 * 2.  Each question is answered by clicking the <div role="radio"> that matches its visible `aria-label`.
 *     The labels are stored in `OPTIONS`; any new question can be supported by adding a key with its
 *     possible choices.
 * 3.  Answers are chosen **randomly** for every run, giving a natural distribution across submissions.
 * 4.  The submit button is located via a robust XPath expression that is independent of language and
 *     DOM changes. A short scroll to the bottom guarantees the button is rendered before we click it.
 *
 * Tested with: Node 18+, Puppeteer 21+, Google Forms (May 2025 layout).
 *
 * Author: Advinson Aleman — Last update 2025-05-25
 */

'use strict';
import puppeteer from 'puppeteer';


/* ---------- BASIC CONFIGURATION ---------- */
const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScXETMEwR1VjvGTBUo3-WaOcS1-M2duYhLaQ1Kem_2vo5TG8w/viewform';

const SUBMISSIONS = 2;
const HEADLESS = false;
const SLOWMO_MS = 120;


/* ---------- OPTION BANK (aria-labels) ----------
 *  If the form owner changes any text, update the matching entry below.
 *  Keys are arbitrary and used only for clarity; values are the exact labels on screen.
 */
const OPTIONS = {
    edad: ['20-30', '30-40', '40-55'],
    genero: ['Femenino', 'Masculino'],
    trabajo: ['En oficina', 'Remoto', 'Negocio propio'],
    almuerzo: ['Llevo almuerzo', 'Compro', 'A veces compro'],
    saludable: ['1', '2', '3', '4', '5'],
    personalizar: ['Poco importante', 'Algo importante', 'Muy importante'],
    formato: ['Pedir día a día',
        'Plan semanal (de lunes a viernes)',
        'Suscripción mensual'],
    tiempo: ['Media hora', 'Una hora', 'Hora y media'],
    precio: ['250-400', '400-650']
};


/* ---------- HELPERS ---------- */
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const delay = ms => new Promise(r => setTimeout(r, ms));


/* ---------- MAIN FLOW ---------- */
(async () => {
    const browser = await puppeteer.launch({
        headless: HEADLESS,
        args: ['--no-sandbox'],
        slowMo: SLOWMO_MS
    });

    for (let i = 1; i <= SUBMISSIONS; i++) {
        const page = await browser.newPage();
        // 1) Load the Google Form
        try {
            await page.goto(FORM_URL, { waitUntil: 'networkidle2' });

            // 2) Generate a random answer sheet for this iteration
            const answers = {
                edad: rand(OPTIONS.edad),
                genero: rand(OPTIONS.genero),
                trabajo: rand(OPTIONS.trabajo),
                almuerzo: rand(OPTIONS.almuerzo),
                saludable: rand(OPTIONS.saludable),
                personalizar: rand(OPTIONS.personalizar),
                formato: rand(OPTIONS.formato),
                tiempo: rand(OPTIONS.tiempo),
                precio: rand(OPTIONS.precio)
            };

            // 3) Click each radio based on its aria-label            
            for (const label of Object.values(answers)) {
                await page.waitForSelector(`div[role="radio"][aria-label="${label}"]`, { visible: true });
                await page.click(`div[role="radio"][aria-label="${label}"]`);
                await delay(120 + Math.random() * 200);
            }


            // 4) Scroll to bottom to ensure the submit button is rendered
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));   // scroll

            // 5) Locate and click the “Submit” button (language-agnostic)
            const SUBMIT_XPATH = '//span[normalize-space()="Enviar"]/ancestor::div[@role="button"]';
            await page.waitForXPath(SUBMIT_XPATH, { visible: true });
            const [submitBtn] = await page.$x(SUBMIT_XPATH);
            await submitBtn.click();


            // 6) Wait for the confirmation page
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log(`✔️  Envío ${i} completado:`, answers);
            
        } catch (err) {
            console.error(`❌  Error en envío ${i}:`, err.message);
        } finally {
            await page.close();
        }
    }
    await browser.close();
})();
