/// <reference types="cypress" />

/**
 * Helpers para testes - Login, Logout, Sign Up, etc
 */

export const helperLogin = (email = Cypress.env('testUserEmail'), password = Cypress.env('testUserPassword')) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="senha"]').type(password);
  cy.get('button[type="submit"]').click();

  // Aguarda sucesso (usuário comum vai para /)
  cy.contains(/Bem-vindo|Login realizado/i, { timeout: 10000 }).should('be.visible');
  cy.url().should('not.include', '/login', { timeout: 10000 });
};

export const helperLogout = () => {
  // Abre menu de perfil e clica logout (ajustar seletor conforme estrutura real)
  cy.get('[data-testid="profile-menu"]').click();
  cy.contains('Logout').click();
};

export const helperSignUp = (
  name = 'Test User',
  email = 'testuser@example.com',
  password = 'Password@123'
) => {
  cy.visit('/cadastro');
  cy.get('input[name="nome"]').type(name);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="senha"]').type(password);
  cy.get('input[name="confirmarSenha"]').type(password);
  cy.get('button[type="submit"]').click();

  // Aguarda sucesso (usuário recém-criado vai para /)
  cy.url().should('eq', 'http://localhost:5173/');
};

/**
 * Custom command: Adicionar comando do Cypress para login
 * Uso: cy.loginUser() ou cy.loginUser('email@test.com', 'Senha@123', true)
 */
Cypress.Commands.add('loginUser', (email = 'usuario@example.com', password = 'Senha@123', isAdmin = false) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="senha"]').type(password);
  cy.get('button[type="submit"]').click();
  
  // Aguarda redirecionamento após login
  cy.contains(/Bem-vindo|Login realizado/i, { timeout: 10000 }).should('be.visible');
  cy.url().should('not.include', '/login', { timeout: 10000 });
});

/**
 * Custom command: Tab para navegação por teclado
 * Uso: cy.focused().tab()
 */
Cypress.Commands.add('tab', { prevSubject: 'optional' }, () => {
  cy.get('body').trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});
