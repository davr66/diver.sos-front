/// <reference types="cypress" />

/**
 * CT-02: Editar perfil e gerenciar favoritos
 * Cobre: RF-04, RF-05, RN-05, RNF-01
 */
describe('CT-02: Edição de perfil e favoritos', () => {
  it('Login com usuário válido', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('testUserEmail') || 'teste@example.com');
    cy.get('input[name="senha"]').type(Cypress.env('testUserPassword') || 'Senha@123');
    cy.get('button[type="submit"]').click();
    cy.contains(/Bem-vindo|Login realizado/i, { timeout: 10000 }).should('be.visible');
    cy.url().should('not.include', '/login', { timeout: 10000 });
  });

  it('Editar perfil com sucesso', () => {
    // Fazer login primeiro
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('testUserEmail') || 'teste@example.com');
    cy.get('input[name="senha"]').type(Cypress.env('testUserPassword') || 'Senha@123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login', { timeout: 10000 });

    // Editar perfil
    cy.visit('/perfil/editar', { timeout: 10000 });
    cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[name="phone"]').scrollIntoView().should('be.visible').clear().type('11987654321');
    cy.get('button[type="submit"]').scrollIntoView().should('be.visible').click();
    cy.contains(/Perfil atualizado|atualizado|sucesso/i, { timeout: 10000 }).should('be.visible');
  });

  it('Salvar vaga nos favoritos', () => {
    // Fazer login
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('testUserEmail') || 'teste@example.com');
    cy.get('input[name="senha"]').type(Cypress.env('testUserPassword') || 'Senha@123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login', { timeout: 10000 });

    // Navegar para vagas
    cy.visit('/vagas', { timeout: 10000 });
    cy.get('[data-testid="job-card"]', { timeout: 15000 }).should('exist').first().should('be.visible');

    // Obter botão de favorito
    cy.get('[data-testid="job-card"]').first().within(() => {
      cy.get('[data-testid="save-button"]').as('saveBtn');
    });

    // Favoritar se não estiver salvo
    cy.get('@saveBtn').invoke('attr', 'aria-pressed').then((initialState) => {
      if (initialState === 'false') {
        cy.get('@saveBtn').click();
        cy.get('@saveBtn').should('have.attr', 'aria-pressed', 'true', { timeout: 10000 });
      }
    });
  });

  it('Verificar vaga na página de favoritos', () => {
    // Fazer login
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('testUserEmail') || 'teste@example.com');
    cy.get('input[name="senha"]').type(Cypress.env('testUserPassword') || 'Senha@123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login', { timeout: 10000 });

    // Verificar favoritos
    cy.visit('/favoritos');
    cy.get('[data-testid="favorited-job"], [data-testid="job-card"]', { timeout: 10000 })
      .should('exist')
      .and('have.length.greaterThan', 0);
  });
});
