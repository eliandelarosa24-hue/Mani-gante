import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { offline } from "./helpers.mjs";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
async function audit(page, include) {
  const builder = new AxeBuilder({ page }).withTags(TAGS);
  if (include) builder.include(include);
  const { violations } = await builder.analyze();
  const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact));
  if (serious.length) console.log(JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) })), null, 1));
  return serious;
}

test.beforeEach(async ({ page }) => { await offline(page); await page.emulateMedia({ reducedMotion: "reduce" }); });

for (const theme of ["light", "dark"]) {
  test(`portada sin violaciones graves de WCAG 2.2 AA (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("mg-theme", JSON.stringify(t)), theme);
    await page.goto("/");
    await page.waitForTimeout(800);
    expect(await audit(page)).toEqual([]);
  });
}

test("vista rápida accesible", async ({ page }) => {
  await page.goto("/");
  await page.locator('#grid [data-quick="maracuya"]').click();
  expect(await audit(page, "#quick")).toEqual([]);
});

test("boleta abierta accesible y con foco atrapado", async ({ page }) => {
  await page.goto("/");
  await page.locator('#grid [data-inc="coco"]').click();
  await page.evaluate(() => window.MG.openCart());
  expect(await audit(page, "#cart")).toEqual([]);
  for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.getElementById("cart").contains(document.activeElement))).toBe(true);
});

for (const path of ["/oficio.html", "/sabor/maracuya", "/admin.html", "/404.html"]) {
  test(`página ${path} sin violaciones graves`, async ({ page }) => {
    await page.goto(path);
    expect(await audit(page)).toEqual([]);
  });
}

test("se puede usar la tienda solo con teclado", async ({ page }) => {
  await page.goto("/");
  await page.locator('#grid [data-inc="maracuya"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#cartCount")).toHaveText("1");
  await page.locator('#grid [data-quick="coco"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#quick")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#quick")).not.toBeVisible();
});
