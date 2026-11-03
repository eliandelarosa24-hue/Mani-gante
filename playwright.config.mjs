// Pruebas end-to-end de los flujos críticos + auditoría de accesibilidad (axe).
// Ejecuta: npm test   (levanta tests/serve.mjs con ADMIN_TOKEN de prueba)
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:8799", trace: "retain-on-failure" },
  webServer: {
    command: "node tests/serve.mjs . 8799",
    url: "http://localhost:8799/",
    reuseExistingServer: false,
    env: { ADMIN_TOKEN: "test-admin-token-123", STOCK_WEBHOOK_SECRET: "test-hook", SMARTSTOCK_FEED_SECRET: "test-feed-secret" },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
