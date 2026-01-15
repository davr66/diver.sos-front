/// <reference types="cypress" />

/**
 * CT-04: Controle administrativo
 * Cobre: RNF-05
 */
describe('CT-04: Controle administrativo', () => {
  it('Bloqueia acesso a /admin sem autenticação', () => {
    cy.visit('/admin', { failOnStatusCode: false });
    cy.url().should('satisfy', (url) => {
      return !url.includes('/admin') || url.includes('login');
    });
  });

  it('Usuário não-admin não acessa conteúdo administrativo', () => {
    // Fazer login como usuário comum
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('testUserEmail') || 'teste@example.com');
    cy.get('input[name="senha"]').type(Cypress.env('testUserPassword') || 'Senha@123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login', { timeout: 10000 });

    // Tentar acessar admin
    cy.visit('/admin/noticias', { failOnStatusCode: false });
    cy.get('[data-testid="admin-content"]').should('not.exist');
  });
});
