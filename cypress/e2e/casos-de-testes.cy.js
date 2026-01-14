/// <reference types="cypress" />

/**
 * CASOS DE TESTE - DIVER SOS FRONT
 * 4 casos principais cobrindo todos os requisitos
 */

it('CT-01: Validar criação de conta com validações de nome e senha (RF-03, RN-01, RN-02, RNF-01, RNF-02)', () => {
  // Teste: Rejeita nome com menos de 3 caracteres (RN-01)
  cy.visit('/cadastro');
  cy.get('input[name="nome"]').type('Jo');
  cy.get('input[name="email"]').type('teste@example.com');
  cy.get('input[name="senha"]').type('ValidPassword@123');
  cy.get('input[name="confirmarSenha"]').type('ValidPassword@123');
  cy.get('button[type="submit"]').click();
  cy.contains(/O nome deve ter mais que 3 caracteres/i).should('be.visible');
  
  // Teste: Rejeita senha fraca (RN-02)
  cy.get('input[name="nome"]').clear().type('João Silva');
  cy.get('input[name="senha"]').clear().type('abc123');
  cy.get('input[name="confirmarSenha"]').clear().type('abc123');
  cy.get('button[type="submit"]').click();
  cy.contains(/A senha não atende aos requisitos mínimos/i).should('be.visible');
  
  // Teste: Cadastro com sucesso exibe feedback positivo (RNF-01)
  const testEmail = `user${Date.now()}@diver-sos-test.com`;
  cy.get('input[name="nome"]').clear().type('João Silva Teste');
  cy.get('input[name="email"]').clear().type(testEmail);
  cy.get('input[name="senha"]').clear().type('Senha@Segura123');
  cy.get('input[name="confirmarSenha"]').clear().type('Senha@Segura123');
  cy.get('button[type="submit"]').click();
  cy.contains(/Cadastro realizado!/i, { timeout: 10000 }).should('be.visible');
  
  // Verificar que formulário é simples (RNF-02)
  cy.visit('/cadastro');
  cy.get('input').should('have.length.lte', 5);
});

it('CT-02: Editar perfil e gerenciar favoritos (RF-04, RF-05, RN-05, RNF-01)', () => {
  // Login com usuário válido
  cy.visit('/login');
  cy.get('input[name="email"]').type(Cypress.env('testUserEmail') || 'teste@example.com');
  cy.get('input[name="senha"]').type(Cypress.env('testUserPassword') || 'Senha@123');
  cy.get('button[type="submit"]').click();
  
  // Aguardar feedback de sucesso do login
  cy.contains(/Bem-vindo|Login realizado/i, { timeout: 10000 }).should('be.visible');
  cy.url().should('not.include', '/login');
  
  // Teste edição de perfil (RF-04, RNF-01)
  cy.visit('/perfil/editar', { timeout: 10000 });
  cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible');
  cy.get('input[name="phone"]').scrollIntoView().should('be.visible').clear().type('11987654321');
  cy.get('button[type="submit"]').scrollIntoView().should('be.visible').click();
  
  // Aguardar feedback de sucesso
  cy.contains(/Perfil atualizado|atualizado|sucesso/i, { timeout: 10000 }).should('be.visible');
  
  // Teste salvamento de vaga nos favoritos (RF-05, RNF-01)
  cy.visit('/vagas', { timeout: 10000 });
  
  // Aguardar que o loading desapareça e as vagas sejam carregadas
  cy.get('[data-testid="job-card"]', { timeout: 15000 }).should('exist').first().should('be.visible');
  
  // Obter o botão de favorito e verificar estado inicial
  cy.get('[data-testid="job-card"]').first().within(() => {
    cy.get('[data-testid="save-button"]').as('saveBtn');
  });
  
  // Obter estado inicial
  cy.get('@saveBtn').invoke('attr', 'aria-pressed').then((initialState) => {
    // Se não estiver salvo, salvar agora
    if (initialState === 'false') {
      cy.get('@saveBtn').click();
      // Aguardar mais tempo para a API processar
      cy.wait(2000);
      // Verificar que o estado mudou para salvo
      cy.get('@saveBtn').should('have.attr', 'aria-pressed', 'true', { timeout: 5000 });
    }
  });
  
  // Verificar que a vaga aparece na página de favoritos
  cy.visit('/favoritos');
  cy.get('[data-testid="favorited-job"], [data-testid="job-card"]', { timeout: 10000 }).should('exist').and('have.length.greaterThan', 0);
});

it('CT-03: Responsividade em desktop e mobile (RNF-03, RNF-02)', () => {
  // Desktop
  cy.viewport(1280, 720);
  cy.visit('/cadastro');
  cy.get('input[name="nome"]').should('be.visible');
  cy.get('input[name="email"]').should('be.visible');
  cy.get('input[name="senha"]').should('be.visible');
  cy.get('button[type="submit"]').should('be.visible');
  
  // Mobile - usar preset válido do Cypress
  cy.viewport('iphone-x');
  cy.visit('/cadastro');
  cy.get('input[name="nome"]').should('be.visible');
  cy.get('button[type="submit"]').scrollIntoView().should('be.visible');
  
  // Verificar que formulário é simples em mobile (RNF-02)
  cy.get('input, textarea, select').should('have.length.lte', 5);
});

it('CT-04: Controle administrativo e interface responsiva (RNF-05, RNF-03)', () => {
  // Tentar acessar /admin sem autenticação (RNF-05)
  cy.visit('/admin', { failOnStatusCode: false });
  
  // Deve redirecionar ou mostrar erro
  cy.url().should('satisfy', (url) => {
    return !url.includes('/admin') || url.includes('login');
  });
  
  // Verificar responsividade da interface em diferentes tamanhos (RNF-03)
  // Desktop
  cy.viewport(1920, 1080);
  cy.visit('/');
  cy.get('nav').should('be.visible');
  cy.get('main, [role="main"]').should('be.visible');
  
  // Tablet
  cy.viewport('ipad-2');
  cy.visit('/vagas');
  cy.get('nav').should('exist');
  cy.get('main, [role="main"]').should('be.visible');
  
  // Mobile
  cy.viewport('iphone-x');
  cy.visit('/grupos');
  cy.get('nav').should('exist');
  cy.get('main, [role="main"]').should('be.visible');
});
