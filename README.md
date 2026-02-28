<h1 align="center">diver.sos - Front-end</h1>

<p align="center">
  <img width="286.56" height="229.92" alt="Group 4" src="https://github.com/user-attachments/assets/3bccd4c7-386d-401e-b7fb-2b422c53b3c2" />
</p>

<p align="center">
  Uma plataforma para reunir informações sobre oportunidades e grupos para a comunidade LGBTQIAPN+.
</p>

---

## 🧠 Sobre o projeto

>A plataforma diver.sos busca reunir informações, links e notícias acerca de oportunidades de emprego e grupos de apoio voltados à comunidade LGBTQIAPN+, criando um espaço onde pessoas dessa comunidade possam encontrar oportunidades em locais que respeitem sua identidade e espaços onde possam requisitar apoio em diferentes aspectos.
>
>Para avaliar os problemas envolvendo esses pontos, foi feita uma pesquisa por meio de questionário com as pessoas dessa comunidade, evidenciando situações de preconceito ainda existentes no ambiente de trabalho, além de desinformação acerca de grupos que pudessem ajudar essas pessoas a lidarem com esse tipo de situação.
>
>Foi idealizada por João Henrique Viana, pesquisador e atual professor da disciplina de Pesquisa de Marketing da Universidade de Fortaleza (UNIFOR), e desenvolvida pela equipe Atemporal para a disciplina de Projeto Integrado I, do curso de Sistemas e Mídias Digitais, da Universidade Federal do Ceará (UFC).

---

## 🚀 Funcionalidades

- Listagem e filtro de conteúdos (Vagas, Grupos, Favoritos)
- Autenticação de Usuários para acessar determinados conteúdos (Grupos, Favoritos, Dashboard Admin)
- Cadastro de conteúdo da plataforma (Dashboard Admin)

---

<h3 align="center">Tecnologias utilizadas</h3>

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="45"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" alt="Vite" width="45"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" width="45"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cypressio/cypressio-original.svg" alt="Cypress" width="45"/>
</p>

---

## 📷 Telas do sistema

<p align="center">
  <p align="center">
    <img width="315" height="668" alt="image" src="https://github.com/user-attachments/assets/d37a85cc-85c1-4742-a72c-20630c3eb28a" />
    <img width="311" height="667" alt="image" src="https://github.com/user-attachments/assets/5a6491af-e881-43be-87ec-8ff7556ad76b" />
    <img width="315" height="670" alt="image" src="https://github.com/user-attachments/assets/b2117df3-67b9-4566-a753-32a9b3c49ca0" />    
  </p>
  <p align="center">
    <a href="https://www.figma.com/design/2cVwlEEl5TVMABxATLSRng/Prot%C3%B3tipo-de-alta---Aplica%C3%A7%C3%B5es-Definidas?t=CLuosYoWqg1x0l2d-1" target="_blank">
    <img src="https://img.shields.io/badge/Ver%20no%20Figma-0ACF83?style=for-the-badge&logo=figma&logoColor=white" alt="Ver projeto no Figma"/>
  </a>
  </p>

</p>

---

## ⚙️ Instalação e configuração do ambiente

### 📋 Pré-requisitos
- **Node.js** (versão LTS recomendada)
- **npm** ou **yarn**

---

### 📦 Instalação

Clone o repositório e instale as dependências:

    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    npm install

---

### 🔐 Configuração das variáveis de ambiente

O projeto utiliza variáveis de ambiente para configuração do funcionamento da aplicação.

1. Duplique o arquivo `.env.example` na raiz do projeto e renomeie para `.env`:

    cp .env.example .env

2. Configure os campos do arquivo `.env` conforme o ambiente de desenvolvimento:

    ## Link para o formulário de denúncias 
    VITE_ANON_REPORT_URL=

    ## Usuário comum para testes
    VITE_TEST_USER_EMAIL=
    VITE_TEST_USER_PASSWORD=

    ## Usuário admin para testes
    VITE_TEST_ADMIN_EMAIL=
    VITE_TEST_ADMIN_PASSWORD=

    # Url do back-end
    VITE_API_URL=

> ⚠️ As credenciais acima são utilizadas **exclusivamente para testes em ambiente de desenvolvimento**.  
> Nenhuma informação sensível deve ser versionada no repositório.

> ℹ️ **Observação:**  
> Como o projeto utiliza **Vite**, todas as variáveis de ambiente expostas ao frontend devem obrigatoriamente iniciar com o prefixo `VITE_`.

---

### ▶️ Execução do projeto

Após concluir a configuração do ambiente, execute:

    npm run dev

A aplicação estará disponível em:

    http://localhost:5173

## 🔗 Repositório do Back-end

[![Back-end](https://img.shields.io/badge/Back--end-Repositório-blue?style=for-the-badge&logo=github)](https://github.com/andrido/diver.sos)
