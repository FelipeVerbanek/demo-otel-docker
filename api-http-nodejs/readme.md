# API de Demonstração com OpenTelemetry

Esta é uma API de demonstração desenvolvida com o propósito de explorar a instrumentação de aplicações usando OpenTelemetry. A API permite o cadastro de usuários e a criação de pedidos, comunicando-se com um serviço gRPC para processamento de dados.

## Funcionalidades

- **Cadastro de Usuários**: Permite registrar novos usuários no sistema.
- **Criação de Pedidos**: Permite a criação de novos pedidos associados a usuários registrados.
- **Comunicação gRPC**: Interage com um serviço gRPC externo para realizar operações adicionais.

## Estrutura da Aplicação

1. **API HTTP**: Desenvolvida em Node.js e instrumentada com OpenTelemetry para rastreamento de requisições HTTP.
2. **Serviço gRPC**: Um microserviço que recebe e processa as solicitações da API.
3. **Instrumentação com OpenTelemetry**: Rastreia e coleta métricas de desempenho, como latência de requisição e tempo de resposta, com exportação de traces para análise.

## Requisitos

- **Node.js** versão 20+
- **Docker** para configurar dependências
- **OpenTelemetry** para coleta e exportação de métricas

## Configuração e Instalação

### 1. Clone o Repositório

```bash
git clone git@git.tecnospeed.local:sysops/poc/open-telemetry/applications/api-http-nodejs.git
cd api-http-nodejs
```

### 2. Instale as Dependências

```bash
npm install
```
### 4. Gerar o arquivo proto do prisma
```bash
npx prisma generate
```
### 4. Gerar o arquivo proto do prisma
```bash
npx prisma generate
```

### 5. Gerar migrate postgres
```bash
npx prisma migrate deploy
```


### 6. Iniciar a API

Para rodar a aplicação:

```bash
npm dev
```


## Endpoints

- `POST /api/users`: Cadastro de novos usuários.
- `POST /api/orders`: Criação de um novo pedido para um usuário registrado.

## Monitoramento e Observabilidade

Esta API está instrumentada com OpenTelemetry para coletar métricas e traces de desempenho, que podem ser enviados para ferramentas como Prometheus e Grafana para visualização e análise.
