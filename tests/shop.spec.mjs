import { test, expect } from "@playwright/test";
import { offline, collectErrors } from "./helpers.mjs";

test.beforeEach(async ({ page }) => { await offline(page); await page.emulateMedia({ reducedMotion: "reduce" }); });

test("la portada carga sin errores y muestra el catálogo completo", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await expect(page.locator("#heroTitle")).toBeVisible();
  await expect(page.locator("#grid .card")).toHaveCount(28);
  await expect(page.locator("#gridJp .card")).toHaveCount(5);
  await expect(page.locator(".hero-card")).not.toHaveClass(/is-loading/);
  expect(errors).toEqual([]);
});

test("agregar al carrito persiste al recargar y arma el mensaje de WhatsApp", async ({ page }) => {
  await page.goto("/");
  await page.locator('#grid [data-inc="maracuya"]').click();
  await page.locator('#grid [data-inc="maracuya"]').click();
  await expect(page.locator("#cartCount")).toHaveText("2");
  await page.reload();
  await expect(page.locator("#cartCount")).toHaveText("2");
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator("#nav")).not.toHaveClass(/hide/);
  await page.locator("#cartOpen").or(page.locator("#dockCart")).filter({ visible: true }).first().click();
  await expect(page.locator("#cart")).toHaveClass(/open/);
  const href = await page.locator("#cartWa").getAttribute("href");
  expect(decodeURIComponent(href)).toContain("Maracuyá x2");
});

test("vista rápida: formato, cantidad y agregar", async ({ page }) => {
  await page.goto("/");
  await page.locator('#grid [data-quick="pistacho"]').click();
  await expect(page.locator("#quick")).toBeVisible();
  await page.locator('#qvFormats [data-format="doypack"]').click();
  await page.locator("#qvPlus").click();
  await expect(page.locator("#qvPrice")).toHaveText("$3.000");
  await expect(page.locator("#qvAllergen")).toContainText("maní");
  await page.locator("#qvAdd").click();
  await expect(page.locator("#cartCount")).toHaveText("2");
});

test("sabor agotado ofrece 'Avísame' y registra la alerta", async ({ page }) => {
  await page.goto("/");
  await page.locator('#grid [data-alert="pasa-el-ron"]').click();
  await page.locator('#alertForm [name=contact]').fill("+56912345678");
  await page.locator('#alertForm button[type=submit]').click();
  await expect(page.locator("#alertDlg")).not.toBeVisible();
  await expect(page.locator("#toast")).toContainText("Pasa el Ron");
});

test("test de sabor (4 preguntas) agrega 3 recomendaciones y guarda el resultado", async ({ page }) => {
  await page.goto("/");
  await page.locator(".finder[data-open-quiz]").click();
  for (const v of ["frutal", "suave", "bajon", "clasico"]) await page.locator(`.quiz-opt[data-v="${v}"]`).click();
  await expect(page.locator(".quiz-pick")).toHaveCount(3);
  await page.locator("#quizAdd").click();
  await expect(page.locator("#cartCount")).toHaveText("3");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mg-quiz")).picks.length)).toBe(3);
});

test("arma tu caja: sorpréndeme llena los 6 espacios y la agrega", async ({ page }) => {
  await page.goto("/#caja");
  await page.locator("#boxShuffle").click();
  await expect(page.locator("#boxCount")).toHaveText("6 / 6");
  await page.locator("#boxAdd").click();
  await expect(page.locator("#cartCount")).toHaveText("6");
});

test("reserva completa: valida, crea el código y queda en Mis pedidos", async ({ page, context }) => {
  context.on("page", (p) => p.close());
  await page.goto("/");
  await page.locator('#grid [data-inc="coco"]').click();
  await page.locator("#reservar").scrollIntoViewIfNeeded();
  await page.locator("#rfSubmit").click();
  await expect(page.locator("#rfErrors")).toContainText("nombre");
  await page.locator("#rfName").fill("Test");
  await page.locator("#rfSubmit").click();
  await expect(page.locator(".rc-success code")).toHaveText(/^MG-[A-Z0-9]{4}$/);
  await expect(page.locator('a[download$=".ics"]')).toHaveCount(1);
  const orders = await page.evaluate(() => JSON.parse(localStorage.getItem("mg-history-v1")));
  expect(orders[0].type).toBe("reserva");
});

test("carrito compartido por URL se recupera", async ({ page }) => {
  await page.goto("/?pedido=maracuya.2,coco.1&f=doypack");
  await expect(page.locator("#cartCount")).toHaveText("3");
  expect(page.url()).not.toContain("pedido=");
});

test("ficha de sabor indexable con schema Product", async ({ page }) => {
  await page.goto("/sabor/maracuya");
  await expect(page.locator("h1")).toHaveText("Maracuyá");
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(ld)["@type"]).toBe("Product");
});

test("la puerta: solo en la primera visita, accesible y se abre", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("#door")).toBeVisible();
  await expect(page.locator("#doorEnter")).toBeFocused();
  await expect(page.locator("main")).toHaveJSProperty("inert", true);
  await page.locator("#doorEnter").click();
  await expect(page.locator("html")).not.toHaveClass(/door-on/, { timeout: 4000 });
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
  await page.reload();
  await expect(page.locator("#door")).toBeHidden();
});

test("identidad: fichas con alias, la Bolsa en vivo y eslogan", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#heroTitle")).toContainText("gánster");
  await expect(page.locator('#grid .card[data-id="maracuya"] .card-alias')).toHaveText("alias «La Chinola»");
  await expect(page.locator("#marqueeTrack .tk.down").first()).toBeAttached();
  await page.locator("#search").fill("jeque");
  await expect(page.locator("#grid .card")).toHaveCount(1);
});

test("v4.3: búsqueda que perdona, sugerencias y sinónimos", async ({ page }) => {
  await page.goto("/");
  await page.locator("#search").fill("maracuya");
  await expect(page.locator('#grid .card[data-id="maracuya"]')).toBeVisible();
  await page.locator("#search").fill("fresa");
  await expect(page.locator('#grid .card[data-id="frutilla"]')).toBeVisible();
  await page.locator("#search").fill("pistaco");
  await expect(page.locator('#grid .card[data-id="pistacho"]')).toBeVisible();
  await page.locator("#search").fill("zzzzqqq");
  await expect(page.locator("#empty")).toBeVisible();
});

test("v4.3: la ruleta elige un sabor disponible y lo agrega", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-open-ruleta]").click();
  await expect(page.locator("#ruleta")).toBeVisible();
  await expect(page.locator("#ruletaResult")).toHaveClass(/show/);
  await page.locator("#ruletaAdd").click();
  await expect(page.locator("#cartCount")).toHaveText("1");
});

test("v4.3: vista rápida pasa al siguiente sabor y el reloj en vivo aparece", async ({ page }) => {
  await page.goto("/");
  await page.locator('#grid [data-quick="maracuya"]').click();
  await expect(page.locator("#qvName")).toHaveText("Maracuyá");
  await page.locator("#qvNext").click();
  await expect(page.locator("#qvName")).not.toHaveText("Maracuyá");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#qvName")).toHaveText("Maracuyá");
  await page.keyboard.press("Escape");
  await expect(page.locator("#heroCountdown")).toBeVisible();
});

test("v4.3: 'lo de siempre' repite el último pedido", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("mg-history-v1", JSON.stringify([{ id: "P-1", type: "pedido", items: [{ id: "coco", name: "Coco", qty: 2 }], format: "celofan", createdAt: new Date().toISOString() }])));
  await page.goto("/");
  await page.locator("#heroAgain button").click();
  await expect(page.locator("#cartCount")).toHaveText("2");
});

test("v4.4: la casa habla en plural, sin rayita y con el recorrido", async ({ page }) => {
  await page.goto("/");
  // Fuera de los datos bancarios, ningún texto visible nombra a una persona
  const text = await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll(".pay-card, script").forEach((n) => n.remove()); return c.innerText; });
  expect(text).not.toMatch(/Jorge|el Jefe/);
  const before = await page.locator(".section .eyebrow").first().evaluate((el) => getComputedStyle(el, "::before").content);
  expect(["none", "normal"]).toContain(before);
  await expect(page.locator("#reserveJourney li")).toHaveCount(4);
  await expect(page.locator(".ch-numeral").first()).toBeAttached();
});

test("v4.4: bienvenida con el nombre y ceremonia al cerrar el trato", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("mg-name", JSON.stringify("Chiqui")));
  await page.goto("/?nodoor=1");
  await expect(page.locator("#heroHello")).toContainText("Chiqui");
  await page.evaluate(() => dispatchEvent(new CustomEvent("mg:order")));
  await expect(page.locator(".ceremony")).toContainText("Trato hecho");
  await expect(page.locator("#reserveJourney li.done")).toHaveCount(4);
});

test("v4.4.2: con animaciones, las tarjetas de pago y la invitación se ven", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?nodoor=1");
  await page.locator(".pay-grid").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const ops = await page.locator(".pay-card").evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).opacity)));
  expect(ops.length).toBeGreaterThan(0);
  expect(Math.min(...ops)).toBeGreaterThan(.95);
  await page.locator(".ticket").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(Number(await page.locator(".ticket").evaluate((e) => getComputedStyle(e).opacity))).toBeGreaterThan(.95);
});
