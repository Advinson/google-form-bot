'use strict';
import puppeteer from 'puppeteer';

const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScXETMEwR1VjvGTBUo3-WaOcS1-M2duYhLaQ1Kem_2vo5TG8w/viewform';

const SUBMISSIONS = 2;
const HEADLESS = false;        // false para depurar con la ventana abierta
const SLOWMO_MS = 120;           // ponga 100-200 ms si quiere ver cada acción
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


const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const delay = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    const browser = await puppeteer.launch({
        headless: HEADLESS,
        args: ['--no-sandbox'],
        slowMo: SLOWMO_MS
    });

    for (let i = 1; i <= SUBMISSIONS; i++) {
        const page = await browser.newPage();
        try {
            await page.goto(FORM_URL, { waitUntil: 'networkidle2' });

            const answers = {                       // respuestas aleatorias
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

            /* ---------- click en cada radio ---------- */
            for (const label of Object.values(answers)) {
                await page.waitForSelector(`div[role="radio"][aria-label="${label}"]`, { visible: true });
                await page.click(`div[role="radio"][aria-label="${label}"]`);
                await delay(120 + Math.random() * 200);
            }


            /* ---------- enviar ---------- */
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));   // scroll
            const SUBMIT_XPATH = '//span[normalize-space()="Enviar"]/ancestor::div[@role="button"]';
            await page.waitForXPath(SUBMIT_XPATH, { visible: true });
            const [submitBtn] = await page.$x(SUBMIT_XPATH);
            await submitBtn.click();

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
