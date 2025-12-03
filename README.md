# Sistema de Cupons de Desconto - NoSQL

Este projeto consiste em uma API REST de alta performance para gerenciamento de cupons de desconto, projetada para suportar alta demanda (como Black Friday). A arquitetura utiliza **Node.js** com **Amazon DynamoDB**, focando em escalabilidade horizontal e baixa latência.

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como atividade avaliativa para a disciplina de **Banco de Dados** do curso de **Análise e Desenvolvimento de Sistemas**.

**Objetivo Principal:**
Desenvolver uma aplicação que solucione um problema real utilizando um banco de dados **NoSQL (Chave-Valor)**, demonstrando domínio sobre:
- Modelagem de dados não-relacional (Single Table Design).
- Manipulação de dados semiestruturados (JSON).
- Persistência e Consistência em sistemas distribuídos.
- Automação de ambiente com Docker.

---

## 🛠 Tecnologias Utilizadas

- **Node.js** (Runtime Javascript)
- **Express** (Framework Web)
- **AWS DynamoDB** (Banco de Dados NoSQL Chave-Valor)
- **AWS SDK v3** (Integração com o banco)
- **Docker** (Containerização do DynamoDB Local)

## ✨ Funcionalidades

- **CRUD Completo de Cupons:** Criação, Leitura, Atualização e Remoção.
- **Validação de Unicidade:** Garante que códigos de cupom não sejam duplicados.
- **Busca Filtrada:** Listagem de cupons por status (ex: `active`, `paused`).
- **TTL (Time To Live):** Expiração automática de cupons vencidos gerenciada pelo próprio banco.
- **Ambiente Automatizado:** Scripts de *Spin-up* e *Teardown* para gerenciamento do Docker.
- **Persistência de Dados:** Scripts de Dump (Backup JSON) e Restore.

## 📂 Estrutura do Projeto (MVC)

O projeto segue o padrão de arquitetura Model-View-Controller para separação de responsabilidades:

```text
sistema-cupons/
├── scripts/               # Automação (Docker, Seed, Dump)
├── src/
│   ├── config/            # Configuração do cliente DynamoDB
│   ├── controllers/       # Lógica de controle das requisições HTTP
│   ├── infra/             # Infraestrutura como código (Criação de Tabelas)
│   ├── models/            # Lógica de acesso ao dados (DynamoDB Commands)
│   ├── routes/            # Definição das rotas da API
│   └── server.js          # Entrypoint da aplicação
└── ...
