// Bloquea servicios externos (Google Sheets, WhatsApp) para que las pruebas sean deterministas.
export async function offline(page) {
  await page.route(/script\.google\.com|wa\.me|calendar\.google|graph\.facebook|api\.resend/, (r) => r.abort());
}
export function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/net::|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  return errors;
}
