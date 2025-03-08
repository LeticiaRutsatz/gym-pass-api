# App

GymPass style app.

## RFs (Requisitos funcionais)

- [ x ] Deve ser possível se cadastrar;
- [ x ] Deve ser possível se autenticar;
- [ x ] Deve ser possível o usuário obter o seu histórico de check-ins;
- [ ] Deve ser possível o usuário buscar academias próximas;
- [ ] Deve ser possível o usuário buscar academias pelo nome;
- [ x ] Deve ser possível o usuário realizar check-in em uma academia;
- [ ] Deve ser possível validar o check-in de um usuário;
- [ x ] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [ x ] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ x ] O usuário não pode fazer 2 check-ins no mesmo dia;
- [ x ] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após ser criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [ x ] A senha do usuário precisa estar criptografada;
- [ x ] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ x ] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);

"start:dev": "tsx watch src/server.ts",
"start:build": "tsup src --out-dir build" //pega code de src e converte para JS e joga resutado para pasta de build
"start": "node build/server.js" //inicia o servidor para produção
"test": "vitest run", //testa
"test:watch": "vitest", //testa e fica olhando alterações
"test:coverage": "vitest run --coverage" //verifica % de testes realizados (abrindo index.html da pasta covarage podemos ver vizualmente)

docker compose up -d //criar docker
docker start api-solid-pg //inicia o docker
docker stop api-solid-pg //para o docker