// Import helpers for reuse across tests
import './helpers';

// Cypress configuration for all tests
beforeEach(() => {
  // Clear localStorage before each test to ensure clean state
  cy.clearLocalStorage();
});

// Optional: Add custom commands if needed
// Cypress.Commands.add('login', (email, password) => {
//   cy.visit('/login');
//   cy.get('input[name="email"]').type(email);
//   cy.get('input[name="senha"]').type(password);
//   cy.get('button[type="submit"]').click();
//   cy.url().should('include', '/vagas');
// });
