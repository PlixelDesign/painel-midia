# PROMPT — Claude Code
## Versão 2.0 — cole isso no início da sessão

---

Quero que você crie o arquivo `app.js` para completar o Painel Operacional de Mídia.

O Codex já entregou a estrutura base:
- `data.js` — seed de dados
- `style.css` — design completo
- `index.html` — estrutura das 5 abas

**Leia os 3 arquivos existentes antes de escrever qualquer código.**
Entenda os IDs, classes e estrutura HTML antes de começar.

Depois leia o `SPEC-claudecode-parte2.md` inteiro.

## Sua missão

Criar apenas `app.js` com toda a lógica da aplicação.

## Ordem de execução

1. Ler `index.html`, `style.css` e `data.js`
2. Ler `SPEC-claudecode-parte2.md`
3. Criar `app.js` em blocos, me mostrando cada parte:
   - Sistema de dados (localStorage + seed)
   - Renderização das abas
   - Aba Torre de Controle (CRUD)
   - **Aba Conteúdo (calendário + filtros + fluxo de status)** ← prioridade
   - Aba Esta Semana (CRUD + toggle)
   - Aba Equipe (CRUD + lacunas)
   - Aba Eventos (CRUD + urgência automática)
   - Sistema de modais

## Prioridade absoluta: Aba de Conteúdo

O calendário editorial é o coração do sistema. Deve ter:
- Grade mensal com posts como chips coloridos por perfil
- Filtro por perfil funcionando (botão Todos + um por conta)
- Navegação entre meses (← →)
- Clicar em chip: abre modal de edição
- Clicar em dia vazio: abre modal com data preenchida
- Badge de status clicável que avança no fluxo
- Lista de posts abaixo do calendário

## Fluxo de status dos posts

```
rascunho → em aprovação → aprovado → agendado → publicado
```
Cancelado: só via modal (evitar clique acidental)
Publicado: card esmaecido
Cancelado: texto riscado

## Comportamento do localStorage

```javascript
const STORAGE_KEY = 'painelMidia';
// Iniciar: verificar se existe
// Se não: carregar SEED_DATA de data.js e salvar
// Se sim: usar dados salvos
// Toda alteração: salvar imediatamente
```

## Regras técnicas

- JavaScript puro — sem frameworks
- Sem APIs externas
- Comentado em português
- Funções organizadas por domínio
- IDs novos: `crypto.randomUUID()`
- Re-renderizar só a seção afetada

## Checklist de validação final

Antes de encerrar, confirme que:
- [ ] localStorage funciona (dados persistem após recarregar)
- [ ] Seed carrega na primeira abertura
- [ ] Torre de Controle: adicionar/editar/excluir conta funciona
- [ ] Conteúdo: calendário visual aparece com posts nos dias corretos
- [ ] Conteúdo: filtro por perfil funciona
- [ ] Conteúdo: navegação entre meses funciona
- [ ] Conteúdo: fluxo de status funciona (clique no badge)
- [ ] Esta Semana: marcar tarefa e "Nova semana" funcionam
- [ ] Equipe: CRUD de pessoas e lacunas funciona
- [ ] Eventos: urgência calculada automaticamente
- [ ] Modais abrem e fecham corretamente em mobile
- [ ] Nenhum erro no console
