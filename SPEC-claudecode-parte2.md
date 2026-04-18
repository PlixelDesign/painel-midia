# SPEC — Painel Operacional de Mídia
## Para o Claude Code — Parte 2: Lógica Completa
## Versão 2.0

---

## Contexto

O Codex já entregou a estrutura base:
- `data.js` com o seed de dados
- `style.css` com o design completo
- `index.html` com as 5 abas estáticas

Sua missão é criar o `app.js` — toda a lógica da aplicação.

Leia os 3 arquivos existentes antes de começar para entender a estrutura de IDs e classes.

---

## O que o app.js deve fazer

---

### 1. Sistema de dados (localStorage)

```javascript
const STORAGE_KEY = 'painelMidia';

// Estrutura salva:
{
  contas: [...],
  posts: [...],
  tarefas: [...],
  equipe: [...],
  lacunas: [...],
  eventos: [...]
}
```

- Ao iniciar: verificar se `localStorage.getItem(STORAGE_KEY)` existe
- Se não existir: carregar `SEED_DATA` de `data.js` e salvar
- Se existir: usar os dados salvos
- Toda alteração (add/edit/delete): salvar imediatamente no localStorage
- IDs novos: usar `crypto.randomUUID()`

---

### 2. Renderização dinâmica

Substituir o HTML estático do Codex por renderização dinâmica a partir dos dados.
Ao iniciar, renderizar todas as abas com os dados do localStorage.
Ao alterar qualquer dado, re-renderizar apenas a seção afetada.

---

### 3. Aba Torre de Controle

**Contadores no topo** (calcular automaticamente):
- Ativas: contas com status `ativo` ou `instável`
- Travadas: status `travado`
- Pré-início: status `estruturado` ou `aguardando`

**Cards de conta:**
- Renderizar dinamicamente a partir de `data.contas`
- Cor da borda esquerda: usar `conta.cor`
- Badge de status: clicável — ao clicar, abre seletor inline dos status possíveis e salva

**Botão "Nova conta":** abre modal de criação

**Botão editar:** abre modal com campos preenchidos

**Botão excluir:** confirmação → remove do array → salva → re-renderiza

---

### 4. Aba Conteúdo — PRIORIDADE MÁXIMA

#### 4.1 Filtro de perfil

Botões: `Todos` + um por conta cadastrada.
Ao clicar: filtra o calendário e a lista.
Estado ativo marcado visualmente no botão.

#### 4.2 Navegação de mês

← e → navegam entre meses.
Estado: `{ mes: 4, ano: 2026 }` (mês atual ao iniciar).

#### 4.3 Calendário visual

Grade mensal:
- Header: Dom / Seg / Ter / Qua / Qui / Sex / Sáb
- Células: dias do mês com número
- Dias de meses anteriores/posteriores: visíveis mas esmaecidos

Posts como chips dentro das células:
```
[● Título curto]  ← cor do perfil à esquerda
```
- Cor do chip: `conta.cor` com opacidade
- Texto: `post.titulo` truncado se necessário
- Clicar no chip: abre modal de edição do post

Clicar numa célula vazia: abre modal de novo post com `dataplanejada` preenchida.

#### 4.4 Lista de posts

Abaixo do calendário, todos os posts do mês atual em ordem cronológica.
Filtro por status: dropdown com todas as opções.
Cada item mostra: badge do perfil (cor), título, formato, data/hora, badge de status, responsável.

#### 4.5 Modal de post

Campos:
- Perfil (select com as contas)
- Título (input)
- Formato (select: feed / carrossel / reels / stories / outro)
- Pilar editorial (select: vida da igreja / ensino / evangelização / comunhão / diagnóstico / bastidor / portfólio / oferta / outro)
- Data planejada (date)
- Horário planejado (time)
- Legenda (textarea)
- Observações (textarea)
- Responsável (input)
- Status (select com o fluxo completo)
- Link do arquivo (input)

Botões: Salvar / Cancelar / Excluir (se editando)

#### 4.6 Fluxo de status dos posts

```
rascunho → em aprovação → aprovado → agendado → publicado
                                              ↘ cancelado
```

Badge de status clicável: ao clicar, avança para o próximo status no fluxo.
Exceção: `cancelado` só via modal (evitar clique acidental).
Posts `publicados`: card esmaecido (opacity: 0.5).
Posts `cancelados`: card com texto riscado.

#### 4.7 Contadores do mês

No cabeçalho da aba, mostrar contagem por status dos posts do mês atual:
`rascunho: 2 | em aprovação: 1 | aprovado: 0 | publicado: 3`

---

### 5. Aba Esta Semana

**Marcar tarefa:** clique no card → toggle `concluida` → salva → re-renderiza
Tarefas concluídas: opacidade reduzida + texto riscado.

**"Nova semana":** remove todas as tarefas `concluida: true` → salva → re-renderiza

**"Nova tarefa":** modal com título e domínio → adiciona → salva

**Excluir:** confirmação → remove → salva

---

### 6. Aba Equipe

**Contadores automáticos:** ativos / parcial-eventual / a confirmar / fora.

**Badge de status clicável:** abre seletor inline dos status possíveis.

**Adicionar / editar / excluir pessoa:** modal com nome, iniciais (auto-geradas das primeiras letras, editáveis), função, status.

**Lacunas:**
- Exibir `atual / necessario` com barra de progresso visual simples
- Adicionar / editar / excluir lacuna: modal com funcao, descricao, atual, necessario

---

### 7. Aba Eventos

**Urgência calculada automaticamente:**
```javascript
function calcularUrgencia(dia, mes, ano) {
  if (!mes) return { texto: 'CONFIRMAR DATA', cor: '#6b6b7a' };
  const hoje = new Date();
  const evento = new Date(ano, mes - 1, dia || 1);
  const diff = Math.floor((evento - hoje) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { texto: 'ENCERRADO', cor: '#6b6b7a' };
  if (diff <= 30) return { texto: 'URGENTE', cor: '#ef4444' };
  if (diff <= 60) return { texto: 'EM BREVE', cor: '#f59e0b' };
  return { texto: '', cor: '#3b82f6' };
}
```

**Adicionar / editar / excluir evento:** modal com nome, conjunto, dia (opcional), mês (select), ano.

---

### 8. Sistema de modais

Um modal genérico reutilizável:
- Fundo escuro com blur
- Card centralizado (max-width: 480px)
- Fecha ao clicar fora ou no botão Cancelar
- Animação de entrada suave (transform + opacity)
- Scroll interno se o conteúdo for longo
- Funciona bem em mobile

---

### 9. Regras técnicas

- JavaScript puro — sem frameworks
- Sem fetch, sem APIs externas
- Comentado em português
- Funções organizadas por domínio (ex: `renderContas()`, `renderCalendario()`, `salvarDados()`)
- Usar `const` e `let`, sem `var`
- IDs de novos registros: `crypto.randomUUID()`
- Re-renderizar apenas a seção afetada, não a página inteira
- Compatível com deploy estático no Vercel

---

### 10. O que NÃO fazer

- Não recriar o `style.css` — já está pronto
- Não alterar a estrutura do `index.html` além do necessário para renderização dinâmica
- Não usar frameworks
- Não adicionar dependências externas
- Não integrar com API do Instagram ou qualquer API externa
