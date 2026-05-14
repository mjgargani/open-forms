# Histórico de Alterações (Changelog) - Open-Forms

Este documento registra a evolução arquitetural e o histórico de integração de funcionalidades do MVP da plataforma Open-Forms, focada em ambientes educacionais com baixa conectividade (Offline-First).

## 🚀 [12/05/2026] - Consolidação do MVP e Merges Finais
**Data de Integração:** 12 de Maio de 2026 (09:57)

Esta etapa marca a finalização do MVP com a integração completa entre o Frontend e o Backend, além de otimizações de infraestrutura.
* **Merges Principais:** Conclusão dos Pull Requests da branch `dev/frontend` (#2) e `dev/backend` (#1) na branch principal.
* **Infraestrutura (Docker):** Otimização do `docker-compose.dev.yml`, substituindo imagens pesadas por versões `alpine`, garantindo maior leveza no ambiente de desenvolvimento local.
* **Integração de Ambiente:** Atualização dos arquivos `.env.example` e `vite.config.ts`, consolidando as portas de comunicação (Frontend: 5173, API: 3000, Postgres: 5432) e ativando o plugin PWA do Vite para suporte a *Service Workers*.
* **Conexão API-Front:** A API do NestJS foi oficialmente plugada ao Frontend, com a criação da rota pública e independente de visualização de provas (`/view`).
* **Correções Finais:** Ajustes de estabilidade na página do exame (`ExamExecutor`).

## 🔄 [Maio/2026] - Refatoração Arquitetural e Motor Offline-First
Fase dedicada a garantir a integridade dos dados e o funcionamento sem internet, aplicando conceitos de *Domain-Driven Design* (DDD) e *Optimistic UI*.

* **Offline-First no Dashboard:** Implementação de navegação otimista síncrona. Substituição da geração de IDs no servidor pela geração local de UUIDs (`uuidv4`) no lado do cliente, prevenindo bloqueios de segurança em testes móveis.
* **Nested Writes (Backend):** Refatoração massiva no Prisma ORM. O formulário (`Form`) passou a ser tratado como *Aggregation Root*. Remoção de recursos isolados (controllers/services não utilizados) para garantir salvamento atômico de Questões e Opções em uma única transação.
* **Configuração de Variáveis:** Adição de interpolação de variáveis de ambiente (`env`) nos serviços para maior segurança e flexibilidade.

## ✨ [Abril - Maio/2026] - Construção do Core (Form Builder & Executor)
Período de intenso desenvolvimento das interfaces de criação de provas e coleta de respostas.

* **Motor do Exame (ExamExecutor):** Implementação da interpretação de `Markdown` nas questões e opções. Ajuste nas lógicas de seleção única (Radio) e múltipla (Checkbox). Remoção de lógicas de gabarito vazadas para a interface pública (Anti-Cheat).
* **Exportação de Dados:** Criação do recurso de geração de relatórios em CSV (`FormResults`), conectando a criação de submissões à visualização do professor.
* **Form Builder (UI):** Criação da interface de construção de formulários (títulos, descrições e *QuestionBlocks* dinâmicos) com *breadcrumbs* para navegação fluida.

## 🏗️ [Abril/2026] - Fundação, FSD e Modelagem de Dados
Configuração inicial do ecossistema do projeto.

* **Arquitetura Frontend:** Adoção do *Feature-Sliced Design* (FSD) acoplado ao `TanStack Query` (para cache) e `TanStack Router` para criação de uma *Progressive Web App* (PWA) robusta.
* **Modelagem de Dados (Prisma):** Atualização do esquema do banco de dados (Seed) para suportar a nova estrutura relacional. Adição de tipagem rígida nos campos de questões (`DISCURSIVE`, `SINGLE`, `MULTIPLE`).
* **Serviços Iniciais:** Criação de *hooks* genéricos, componentes base de UI e configuração do serviço de *uploads*.