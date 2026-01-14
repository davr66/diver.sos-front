/// <reference types="cypress" />

/**
 * CT-03: Responsividade em desktop e mobile
 * Cobre: RNF-03, RNF-02
 */
describe('CT-03: Responsividade', () => {
  it('Interface responsiva em desktop (1280x720)', () => {
    cy.viewport(1280, 720);
    cy.visit('/cadastro');
    cy.get('input[name="nome"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="senha"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Interface responsiva em mobile (iPhone X)', () => {
    cy.viewport('iphone-x');
    cy.visit('/cadastro');
    cy.get('input[name="nome"]').should('be.visible');
    cy.get('button[type="submit"]').scrollIntoView().should('be.visible');
  });

  it('Formulário simples em mobile (máximo 5 inputs)', () => {
    cy.viewport('iphone-x');
    cy.visit('/cadastro');
    cy.get('input, textarea, select').should('have.length.lte', 5);
  });

  it('Vagas carregam em desktop', () => {
    cy.viewport(1280, 720);
    cy.visit('/vagas');
    cy.get('[data-testid="job-card"]', { timeout: 15000 }).should('have.length.greaterThan', 0);
  });

  it('Vagas carregam em mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/vagas');
    cy.get('[data-testid="job-card"]', { timeout: 15000 }).should('have.length.greaterThan', 0);
  });
});
