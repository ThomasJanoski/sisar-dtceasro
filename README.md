# SISAR - DTCEA-SRO

Sistema de consulta e controle de caixas documentais do DTCEA-SRO. O projeto é dividido em um frontend Angular e uma API Laravel.

## Funcionalidades

- Autenticação pela API e acesso ao painel do sistema.
- Consulta paginada de caixas, com filtros por tipo e ano.
- Cadastro e edição de registros documentais.
- Visualização dos dados cadastrais, prazos, destinação e localização da caixa.
- Avisos informativos para prazos de arquivo corrente e intermediário; nenhuma migração física ou alteração de tipo é executada automaticamente.
- Interface responsiva, mensagens de estado e notificações de operação.

Os valores de `CORRENTE` e `INTERMEDIARIO` podem ser um ano (`2026`) ou um intervalo (`2021-2026`). O sistema compara o ano final com o ano atual. No ano final, informa que o prazo termina naquele ano; depois dele, informa que o prazo foi excedido. Os avisos servem como apoio ao usuário e não substituem a conferência do acervo físico. `DESTFINAL` é apresentado como informação de controle.

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| Frontend | Angular 22, TypeScript, RxJS, CSS próprio e Vitest |
| Backend | PHP 8.3, Laravel 13, Sanctum |
| Banco de dados | SQLite por padrão no `.env.example`; pode ser configurado para MySQL |
| Implantação | Nginx/Laragon conforme o ambiente do servidor |

Não há Tailwind CSS, Angular Material ou ferramenta de testes end-to-end configurada neste repositório.

## Estrutura

```text
backend/   API Laravel, autenticação, modelos e migrations
frontend/  Aplicação Angular, rotas, componentes e estilos
deploy.sh  Script de deploy para o ambiente remoto configurado nele
```

## Pré-requisitos

- PHP 8.3 ou compatível com `backend/composer.json`.
- Composer.
- Node.js e npm compatíveis com a versão do Angular CLI instalada pelo projeto.
- Um banco de dados configurado no backend.

## Segurança

- Não versione `.env`, tokens, senhas ou dados reais do acervo.
- Use HTTPS e configure o proxy e as origens permitidas conforme o ambiente implantado.
- Distribua credenciais de usuário por um canal administrativo seguro; não as coloque neste README.