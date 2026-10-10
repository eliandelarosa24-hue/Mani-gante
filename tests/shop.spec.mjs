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
  await page.locator(".finder").click();
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
