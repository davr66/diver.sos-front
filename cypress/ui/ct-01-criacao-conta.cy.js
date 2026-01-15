/// <reference types="cypress" />

/**
 * CT-01: Validar criação de conta com validações de nome e senha
 * Cobre: RF-03, RN-01, RN-02, RNF-01, RNF-02
 */
describe('CT-01: Criação de conta', () => {
  it('Rejeita nome com menos de 3 caracteres', () => {
    cy.visit('/cadastro');
    cy.get('input[name="nome"]').type('Jo');
    cy.get('input[name="email"]').type('teste@example.com');
    cy.get('input[name="senha"]').type('ValidPassword@123');
    cy.get('input[name="confirmarSenha"]').type('ValidPassword@123');
    cy.get('button[type="submit"]').click();
    cy.contains(/O nome deve ter mais que 3 caracteres/i).should('be.visible');
  });

  it('Rejeita senha fraca', () => {
    cy.visit('/cadastro');
    cy.get('input[name="nome"]').type('João Silva');
    cy.get('input[name="email"]').type('teste@example.com');
    cy.get('input[name="senha"]').type('abc123');
    cy.get('input[name="confirmarSenha"]').type('abc123');
    cy.get('button[type="submit"]').click();
    cy.contains(/A senha não atende aos requisitos mínimos/i).should('be.visible');
  });

  it('Cadastro com sucesso exibe feedback positivo', () => {
    const testEmail = `user${Date.now()}@diver-sos-test.com`;
    cy.visit('/cadastro');
    cy.get('input[name="nome"]').type('João Silva Teste');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="senha"]').type('Senha@Segura123');
    cy.get('input[name="confirmarSenha"]').type('Senha@Segura123');
    cy.get('button[type="submit"]').click();
    cy.contains(/Cadastro realizado!/i, { timeout: 10000 }).should('be.visible');
  });

  it('Formulário contém apenas campos essenciais', () => {
    cy.visit('/cadastro');
    cy.get('input').should('have.length.lte', 5);
  });
});
