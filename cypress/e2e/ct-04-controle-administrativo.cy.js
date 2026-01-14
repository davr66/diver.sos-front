/// <reference types="cypress" />

/**
 * CT-04: Controle administrativo e interface responsiva
 * Cobre: RNF-05, RNF-03
 */
describe('CT-04: Controle administrativo', () => {
  it('Bloqueia acesso a /admin sem autenticação', () => {
    cy.visit('/admin', { failOnStatusCode: false });
    cy.url().should('satisfy', (url) => {
      return !url.includes('/admin') || url.includes('login');
    });
  });

  it('Interface responsiva em desktop (1920x1080)', () => {
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.get('nav').should('be.visible');
    cy.get('main, [role="main"]').should('be.visible');
  });

  it('Interface responsiva em tablet (iPad 2)', () => {
    cy.viewport('ipad-2');
    cy.visit('/vagas');
    cy.get('nav').should('exist');
    cy.get('main, [role="main"]').should('be.visible');
  });

  it('Interface responsiva em mobile (iPhone X)', () => {
    cy.viewport('iphone-x');
    cy.visit('/grupos');
    cy.get('nav').should('exist');
    cy.get('main, [role="main"]').should('be.visible');
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
