import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/ui/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      testUserEmail: process.env.VITE_TEST_USER_EMAIL,
      testUserPassword: process.env.VITE_TEST_USER_PASSWORD,
      testAdminEmail: process.env.VITE_TEST_ADMIN_EMAIL,
      testAdminPassword: process.env.VITE_TEST_ADMIN_PASSWORD,
    },
  },
});
