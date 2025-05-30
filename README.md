# GymPass Style App

Um Sistema estilo GymPass que permite aos usuários se cadastrarem, realizar check-ins em academias próximas, gerenciar seu histórico de check-ins e muito mais. Este projeto foi desenvolvido com foco em boas práticas de desenvolvimento, como SOLID, e utiliza tecnologias modernas para garantir escalabilidade e manutenibilidade.

---

## Funcionalidades

### Requisitos Funcionais (RFs)
- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível o usuário obter o seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

### Regras de Negócio (RNs)
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ser criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

### Requisitos Não-Funcionais (RNFs)
- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado.
- Docker (para rodar o PostgreSQL).
- Yarn ou NPM.

### Passos para Execução
