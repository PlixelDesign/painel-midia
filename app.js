/* ============================================================
   Painel Operacional de Mídia — app.js
   Lógica completa: localStorage, renderização, CRUD, modais
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────
// 1. SISTEMA DE DADOS (localStorage)
// ─────────────────────────────────────────────

const STORAGE_KEY = 'painelMidia';

/** Limpa o localStorage e recarrega o seed do data.js */
function resetDados() {
  localStorage.removeItem(STORAGE_KEY);
  const inicial = JSON.parse(JSON.stringify(SEED_DATA));
  salvarDados(inicial);
  console.info('Dados resetados — seed recarregado.');
  return inicial;
}

/** Carrega dados do localStorage ou inicializa com o seed */
function carregarDados() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) {
    try {
      const dados = JSON.parse(salvo);
      // Recarrega seed se posts estiver vazio ou com menos de 10 itens
      if (!dados.posts || dados.posts.length < 10) {
        console.info('Posts insuficientes — recarregando seed.');
        return resetDados();
      }
      // Recarrega seed se o seed tiver mais posts do que o localStorage
      if (SEED_DATA.posts.length > dados.posts.length) {
        console.info('Seed atualizado com mais posts — recarregando dados.');
        return resetDados();
      }
      return dados;
    } catch (e) {
      console.warn('Dados corrompidos — recarregando seed.');
    }
  }
  // Primeira abertura ou dado inválido: usa o seed e salva
  return resetDados();
}

/** Salva dados no localStorage imediatamente */
function salvarDados(dados) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

/**
 * Carrega posts do Supabase e sobrescreve db.posts.
 * localStorage continua como cache de leitura rápida.
 * Chamado por auth.js após autenticação.
 */
async function carregarPostsSupabase() {
  if (!window._sb) return;
  try {
    const { data, error, count } = await window._sb
      .schema('public')
      .from('posts')
      .select('*', { count: 'exact' })
      .order('dataplanejada');

    console.log('[Posts] Resultado Supabase → data:', data, '| error:', error, '| count:', count);

    if (error) { console.error('[Posts] Erro ao carregar do Supabase:', error.message); return; }

    // Normaliza campos: aceita tanto lowercase (Supabase) quanto camelCase (seed/legado)
    db.posts = (data || []).map(p => ({
      ...p,
      contaid:               p.contaid               ?? p.contaId              ?? '',
      linkarquivo:           p.linkarquivo           ?? p.linkArquivo          ?? '',
      direcaoedicao:         p.direcaoedicao         ?? p.direcaoEdicao        ?? '',
      horarioplanejado:      p.horarioplanejado      ?? p.horarioPlanejado     ?? '',
      dataplanejada:         p.dataplanejada         ?? p.dataPlanejada        ?? '',
      checklistgravacao:     p.checklistgravacao     ?? p.checklistGravacao    ?? '',
      timelineproducao:      p.timelineproducao      ?? p.timelineProducao     ?? '',
      checklistgravacaochecked: p.checklistgravacaochecked ?? p.checklistGravacaoChecked ?? '',
      timelineproducaochecked:  p.timelineproducaochecked  ?? p.timelineProducaoChecked  ?? '',
    }));

    salvarDados(db);
    console.log(`[Posts] ${db.posts.length} posts carregados do Supabase.`);

    // Diagnóstico do filtro de contas visíveis
    const idsVisiveis = (window.USUARIO?.papel === 'admin' || !window.USUARIO?.contasPermitidas?.length)
      ? db.contas.map(c => c.id)
      : db.contas.filter(c => window.USUARIO.contasPermitidas.includes(c.id)).map(c => c.id);
    const bloqueados = db.posts.filter(p => !idsVisiveis.includes(p.contaid));
    if (bloqueados.length > 0) {
      console.warn(`[Posts] ${bloqueados.length} post(s) bloqueados pelo filtro de contas visíveis.`,
        'idsVisiveis:', idsVisiveis,
        'contaids únicos nos posts:', [...new Set(db.posts.map(p => p.contaid))]);
    }
  } catch (e) {
    console.error('[Posts] Exceção ao carregar:', e.message);
  }
}

async function carregarTarefasSupabase() {
  if (!window._sb) return;
  try {
    const { data, error } = await window._sb
      .from('tarefas')
      .select('*')
      .order('created_at');

    if (error) { console.error('[Tarefas] Erro ao carregar:', error.message); return; }

    db.tarefas = (data || []).map(t => ({
      id:        t.id,
      titulo:    t.titulo   || '',
      dominio:   (t.dominio || 'OUTRO').toUpperCase(),
      contaid:   t.contaid  || '',
      concluida: t.concluida ?? false,
    }));

    salvarDados(db);
    console.log(`[Tarefas] ${db.tarefas.length} tarefas carregadas do Supabase.`);
  } catch (e) {
    console.error('[Tarefas] Exceção ao carregar:', e.message);
  }
}

// ── Helper de escrita com verificação de sessão ───────────────

async function _aguardarSessao(tentativas = 10, intervalo = 500) {
  for (let i = 0; i < tentativas; i++) {
    const { data: { session } } = await window._sb.auth.getSession();
    if (session) return session;
    if (i < tentativas - 1) await new Promise(r => setTimeout(r, intervalo));
  }
  return null;
}

async function _sbEscritaPosts(fn) {
  const { data: { session }, error: errSess } = await window._sb.auth.getSession();
  console.log('[Posts] sessão antes da escrita →',
    session
      ? `uid=${session.user.id} | exp=${new Date(session.expires_at * 1000).toISOString()}`
      : 'null',
    errSess ? `| errSess=${JSON.stringify(errSess)}` : '');

  let sessaoAtiva = session;
  if (!sessaoAtiva) {
    console.warn('[Posts] Sessão não encontrada — aguardando até 5s…');
    sessaoAtiva = await _aguardarSessao();
  }
  if (!sessaoAtiva) {
    const err = { message: 'Sem sessão ativa. Faça login novamente.' };
    console.error('[Posts] Abortando escrita — sem sessão ativa após espera.');
    return { error: err };
  }

  const resultado = await fn();
  if (resultado?.error) {
    console.error('[Posts] Erro Supabase (completo):', JSON.stringify(resultado.error, null, 2));
  }
  return resultado;
}

async function _sbEscritaTarefas(fn) {
  const { data: { session } } = await window._sb.auth.getSession();
  let sessaoAtiva = session;
  if (!sessaoAtiva) {
    console.warn('[Tarefas] Sessão não encontrada — aguardando…');
    sessaoAtiva = await _aguardarSessao();
  }
  if (!sessaoAtiva) {
    console.error('[Tarefas] Abortando — sem sessão ativa.');
    return { error: { message: 'Sem sessão ativa.' } };
  }
  const resultado = await fn();
  if (resultado?.error) console.error('[Tarefas] Erro Supabase:', JSON.stringify(resultado.error, null, 2));
  return resultado;
}

// Estado global da aplicação
let db = carregarDados();

// ─────────────────────────────────────────────
// 2. ESTADO DE UI
// ─────────────────────────────────────────────

const ui = {
  filtroContaId: null,
  calMes: new Date().getMonth() + 1,
  calAno: new Date().getFullYear(),
  filtroStatusPost: 'todos',
  mobileConteudoView: 'calendario',
};

// ─────────────────────────────────────────────
// 3. UTILITÁRIOS
// ─────────────────────────────────────────────

/** Formata data ISO (AAAA-MM-DD) para DD/MM/AAAA */
function formatarData(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

/** Formata data ISO para "Ter, 22 Abr" */
function formatarDataCurta(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-').map(Number);
  const diasSem = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const mesesC  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const diaSem  = new Date(a, m - 1, d).getDay();
  return `${diasSem[diaSem]}, ${d} ${mesesC[m - 1]}`;
}

/** Retorna hoje como string ISO AAAA-MM-DD (sem fuso) */
function hojeISO() {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,'0')}-${String(h.getDate()).padStart(2,'0')}`;
}

/** True se o post está atrasado (data < hoje e não publicado/cancelado) */
function isAtrasado(post) {
  if (!post.dataplanejada) return false;
  if (['publicado','cancelado'].includes(post.status)) return false;
  return post.dataplanejada < hojeISO();
}

/** Retorna o próximo post planejado de uma conta (a partir de hoje) */
function proximoPost(contaId) {
  const hoje = hojeISO();
  return db.posts
    .filter(p => p.contaid === contaId && p.dataplanejada >= hoje && !['publicado','cancelado'].includes(p.status))
    .sort((a, b) => a.dataplanejada.localeCompare(b.dataplanejada))[0] || null;
}

/** Retorna nome do mês em português */
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MESES_CURTOS = ['Jan','Fev','Mar','Abr','Mai','Jun',
                      'Jul','Ago','Set','Out','Nov','Dez'];

/** Retorna conta pelo id */
function getConta(id) {
  return db.contas.find(c => c.id === id) || null;
}

/**
 * Retorna classe CSS de perfil baseada no índice da conta.
 * O CSS define: profile-subsede, profile-plixel, profile-vocal,
 * profile-criancas, profile-irmas, profile-adolescentes
 */
const PROFILE_CLASSES = [
  'profile-subsede',
  'profile-plixel',
  'profile-vocal',
  'profile-criancas',
  'profile-irmas',
  'profile-adolescentes',
];

function profileClass(contaid) {
  const idx = db.contas.findIndex(c => c.id === contaid);
  return PROFILE_CLASSES[idx] || 'profile-subsede';
}

/** Gera iniciais a partir de um nome */
function gerarIniciais(nome) {
  return nome.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

/** Escapa HTML para evitar XSS */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Retorna true se o usuário logado pode editar/excluir/criar */
function podeEditar() {
  return window.USUARIO?.papel === 'admin';
}

/** Retorna as contas visíveis para o usuário atual */
function contasVisiveis() {
  const u = window.USUARIO;
  if (!u || u.papel === 'admin' || !u.contasPermitidas || u.contasPermitidas.length === 0) {
    return db.contas;
  }
  return db.contas.filter(c => u.contasPermitidas.includes(c.id));
}

// ─────────────────────────────────────────────
// 4. SISTEMA DE MODAIS
// ─────────────────────────────────────────────

/** Cria e exibe um modal genérico.
 *  @param {string} titulo - Título do modal
 *  @param {string} corpoHTML - HTML do corpo
 *  @param {Function} onSalvar - Callback(formEl) chamado ao clicar Salvar
 *  @param {Object} opts - { mostrarExcluir, onExcluir, labelSalvar }
 */
function abrirModal(titulo, corpoHTML, onSalvar, opts = {}) {
  // Remove modal anterior se existir
  fecharModal();

  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div class="modal-header">
        <h2 id="modal-titulo" class="modal-title">${esc(titulo)}</h2>
        <button class="icon-button modal-close" type="button" aria-label="Fechar">×</button>
      </div>
      <div class="modal-body">
        <form id="modal-form" novalidate>
          ${corpoHTML}
        </form>
      </div>
      <div class="modal-footer">
        ${opts.mostrarExcluir ? '<button class="btn btn-danger" type="button" id="modal-excluir">Excluir</button>' : ''}
        <button class="btn" type="button" id="modal-cancelar">Cancelar</button>
        <button class="btn btn-primary" type="button" id="modal-salvar">${esc(opts.labelSalvar || 'Salvar')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  if (opts.wide) overlay.querySelector('.modal-card').classList.add('modal-wide');

  // Fechar ao clicar fora
  overlay.addEventListener('click', e => {
    if (e.target === overlay) fecharModal();
  });

  overlay.querySelector('.modal-close').addEventListener('click', fecharModal);
  overlay.querySelector('#modal-cancelar').addEventListener('click', fecharModal);

  overlay.querySelector('#modal-salvar').addEventListener('click', () => {
    const form = overlay.querySelector('#modal-form');
    onSalvar(form);
  });

  if (opts.mostrarExcluir && opts.onExcluir) {
    overlay.querySelector('#modal-excluir').addEventListener('click', () => {
      if (confirm('Confirmar exclusão?')) {
        opts.onExcluir();
        fecharModal();
      }
    });
  }

  // Foco no primeiro campo
  requestAnimationFrame(() => {
    const first = overlay.querySelector('input, select, textarea');
    if (first) first.focus();
  });
}

function fecharModal() {
  const existing = document.getElementById('modal-overlay');
  if (existing) existing.remove();
}

// Estilos dos modais injetados dinamicamente
(function injetarEstilosModal() {
  const style = document.createElement('style');
  style.textContent = `
    #modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .modal-card {
      background: #1c1c20;
      border: 1px solid #2a2a30;
      border-radius: 10px;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.18s ease;
      box-shadow: 0 24px 64px rgba(0,0,0,0.56);
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 14px;
      border-bottom: 1px solid #2a2a30;
    }
    .modal-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #e8e8f0;
    }
    .modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    .modal-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 14px 20px;
      border-top: 1px solid #2a2a30;
    }
    .modal-footer .btn-danger { margin-right: auto; }
    .form-group {
      display: grid;
      gap: 6px;
      margin-bottom: 14px;
    }
    .form-group:last-child { margin-bottom: 0; }
    .form-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b6b7a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .form-control {
      width: 100%;
      padding: 9px 12px;
      border: 1px solid #2a2a30;
      border-radius: 8px;
      background: #141416;
      color: #e8e8f0;
      font: inherit;
      font-size: 0.9rem;
      transition: border-color 0.15s;
    }
    .form-control:focus {
      outline: none;
      border-color: #7c6af7;
    }
    textarea.form-control { resize: vertical; min-height: 72px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .status-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .status-option {
      cursor: pointer;
      padding: 4px 10px;
      border: 1px solid #2a2a30;
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 700;
      background: #141416;
      color: #e8e8f0;
      text-transform: uppercase;
      font-family: "JetBrains Mono", monospace;
      transition: background 0.12s, border-color 0.12s;
    }
    .status-option:hover { border-color: #7c6af7; }
    .status-option.selected { background: #7c6af7; border-color: #7c6af7; color: #fff; }
    .gap-progress-bar {
      height: 6px;
      border-radius: 3px;
      background: #2a2a30;
      overflow: hidden;
      margin-top: 8px;
    }
    .gap-progress-fill {
      height: 100%;
      border-radius: 3px;
      background: #7c6af7;
      transition: width 0.3s;
    }
    .inline-status-picker {
      position: absolute;
      z-index: 200;
      background: #1c1c20;
      border: 1px solid #2a2a30;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .post-item.is-publicado { opacity: 0.5; }
    .post-item.is-cancelado .post-title { text-decoration: line-through; color: #6b6b7a; }
    .task-card.is-concluida { opacity: 0.45; }
    .task-card.is-concluida .task-title { text-decoration: line-through; }
    .counter-row .badge { cursor: default; }
    .person-field-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #6b6b7a; margin-right: 2px; }
    .person-capacity { margin-top: 2px; }
    /* ── Aba Usuários ── */
    .user-list { display: grid; gap: 12px; }
    .user-card { background: #1c1c20; border: 1px solid #2a2a30; border-left: 3px solid; border-radius: 8px; padding: 16px; }
    .user-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
    .user-name { margin: 0 0 2px; font-size: 0.95rem; font-weight: 700; color: #e8e8f0; }
    .user-email { margin: 0; font-size: 0.8rem; color: #6b6b7a; font-family: "JetBrains Mono", monospace; }
    .user-contas { margin: 0 0 12px; font-size: 0.8rem; color: #a0a0b0; }
    .badge-admin { background: rgba(124,106,247,0.15); color: #a89df9; border: 1px solid rgba(124,106,247,0.3); }
    .badge-visualizador { background: rgba(59,130,246,0.15); color: #6fa8f5; border: 1px solid rgba(59,130,246,0.3); }
    .checkbox-group { display: grid; gap: 8px; padding: 4px 0; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; cursor: pointer; color: #e8e8f0; }
    .checkbox-label input[type="checkbox"] { accent-color: #7c6af7; width: 15px; height: 15px; flex-shrink: 0; cursor: pointer; }
    .form-hint { margin: 8px 0 0; font-size: 0.78rem; color: #6b6b7a; font-style: italic; }
    /* ── Importação em lote ── */
    .import-json-area { font-family: "JetBrains Mono", monospace; font-size: 0.76rem; min-height: 200px; line-height: 1.5; }
    .import-erro { color: #ef4444; font-size: 0.78rem; white-space: pre-wrap; min-height: 18px; margin: 6px 0 0; }
    .import-preview-header { font-size: 0.875rem; color: #e8e8f0; margin: 0 0 10px; }
    .import-dup-warn { color: #f59e0b; }
    .import-preview-list { display: grid; gap: 6px; max-height: 340px; overflow-y: auto; padding-right: 2px; }
    .import-preview-row {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding: 8px 10px; border: 1px solid #2a2a30; border-radius: 6px; background: #141416;
    }
    .import-preview-row.import-dup { border-color: rgba(245,158,11,0.45); background: rgba(245,158,11,0.05); }
    .import-preview-info { flex: 1; min-width: 0; display: grid; gap: 2px; }
    .import-preview-titulo { font-size: 0.82rem; font-weight: 600; color: #e8e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .import-preview-meta { font-size: 0.7rem; color: #6b6b7a; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .import-preview-dup { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .import-dup-badge { font-size: 0.65rem; color: #f59e0b; font-family: "JetBrains Mono", monospace; white-space: nowrap; }
    .import-dup-action { min-height: 28px !important; padding: 3px 6px !important; font-size: 0.72rem !important; width: 130px; }
    .post-chip { cursor: pointer; }
    .calendar-day { cursor: pointer; }
    .calendar-day:hover { background: rgba(124,106,247,0.06); }
    .badge.clickable { cursor: pointer; }
    .badge.clickable:hover { opacity: 0.8; }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────
// 5. NAVEGAÇÃO POR ABAS (substitui script inline)
// ─────────────────────────────────────────────

function iniciarTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab, .view').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
}

// ─────────────────────────────────────────────
// 6. ABA TORRE DE CONTROLE
// ─────────────────────────────────────────────

function renderControle() {
  renderContadores();
  renderProximoEvento();
  renderContas();
}

function renderProximoEvento() {
  let bloco = document.getElementById('proximo-evento-bloco');
  if (!bloco) return;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const futuros = db.eventos
    .filter(ev => ev.dia && ev.mes)
    .map(ev => ({ ev, data: new Date(ev.ano, ev.mes - 1, ev.dia) }))
    .filter(({ data }) => data >= hoje)
    .sort((a, b) => a.data - b.data);

  if (futuros.length === 0) { bloco.style.display = 'none'; return; }

  const { ev, data } = futuros[0];
  const urg = calcularUrgencia(ev.dia, ev.mes, ev.ano);
  const diasSem = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const dataLabel = `${diasSem[data.getDay()]}, ${ev.dia} de ${MESES[ev.mes - 1]}`;

  bloco.style.display = '';
  bloco.innerHTML = `
    <div class="proximo-evento-card">
      <div class="proximo-evento-label">Próximo evento</div>
      <div class="proximo-evento-info">
        <span class="proximo-evento-nome">${esc(ev.nome)}</span>
        <span class="proximo-evento-conjunto">${esc(ev.conjunto)}</span>
        <span class="proximo-evento-data">${esc(dataLabel)}</span>
        <span class="badge ${urg.statusClass}">${esc(urg.texto)}</span>
      </div>
    </div>
  `;
}

function renderContadores() {
  const contas = contasVisiveis();
  const ativas   = contas.filter(c => c.status === 'ativo' || c.status === 'instável').length;
  const travadas = contas.filter(c => c.status === 'travado').length;
  const preinicio = contas.filter(c => c.status === 'estruturado' || c.status === 'aguardando').length;

  const grid = document.querySelector('.stat-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.stat-number');
  if (cards[0]) cards[0].textContent = ativas;
  if (cards[1]) cards[1].textContent = travadas;
  if (cards[2]) cards[2].textContent = preinicio;
}

function renderContas() {
  const lista = document.getElementById('account-list');
  if (!lista) return;

  lista.innerHTML = contasVisiveis().map(conta => {
    const statusClass = `status-${conta.status.replace(/\s+/g, '-').replace('á','a').replace('é','e').replace('ú','u')}`;
    return `
      <article class="account-card ${statusClass}" data-id="${esc(conta.id)}" style="border-left-color: ${esc(conta.cor)}">
        <div class="card-top">
          <div>
            <h3 class="card-title">${esc(conta.nome)}</h3>
            <p class="card-subtitle">${esc(conta.handle)}</p>
          </div>
          <span class="badge ${statusClass} clickable" data-action="status-conta" data-id="${esc(conta.id)}">${esc(conta.status)}</span>
        </div>
        <div class="account-meta-grid">
          <div class="meta-box">
            <span class="meta-label">Responsável</span>
            <span class="meta-value">${esc(conta.responsavel)}</span>
          </div>
          <div class="meta-box">
            <span class="meta-label">Cadência</span>
            <span class="meta-value">${esc(conta.cadencia)}</span>
          </div>
        </div>
        <div class="blocker">${esc(conta.bloqueio)}</div>
        ${(() => {
          const np = proximoPost(conta.id);
          const tituloTrunc = np ? (np.titulo.length > 40 ? np.titulo.slice(0,38)+'…' : np.titulo) : null;
          return `<div class="conta-prox-post">${
            np
              ? `<span class="conta-prox-icone">📅</span><span class="conta-prox-data">${esc(formatarDataCurta(np.dataplanejada))}</span><span class="conta-prox-titulo">${esc(tituloTrunc)}</span>`
              : `<span class="conta-prox-vazio">Nenhum post planejado</span>`
          }</div>`;
        })()}
        ${podeEditar() ? `
        <div class="card-actions">
          <button class="btn" type="button" data-action="editar-conta" data-id="${esc(conta.id)}">Editar</button>
          <button class="btn btn-danger" type="button" data-action="excluir-conta" data-id="${esc(conta.id)}">Excluir</button>
        </div>` : ''}
      </article>
    `;
  }).join('');

  // Botão Nova Conta (apenas no section-head, não nos cards)
  const btnNova = document.querySelector('#tab-controle .section-head .btn-primary');
  if (btnNova) {
    btnNova.style.display = podeEditar() ? '' : 'none';
    if (podeEditar()) btnNova.onclick = () => abrirModalConta(null);
  }

  // Evento nos cards (onclick substitui anterior, evita acúmulo)
  lista.onclick = onClickControle;
}

function onClickControle(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;

  if (action === 'editar-conta') abrirModalConta(id);
  if (action === 'excluir-conta') excluirConta(id);
  if (action === 'status-conta')  abrirPickerStatusConta(btn, id);
}

/** Status possíveis para contas */
const STATUS_CONTA = ['ativo', 'instável', 'travado', 'estruturado', 'aguardando'];

function abrirPickerStatusConta(badge, id) {
  // Remove pickers anteriores
  document.querySelectorAll('.inline-status-picker').forEach(p => p.remove());

  const picker = document.createElement('div');
  picker.className = 'inline-status-picker';
  picker.style.top  = (badge.getBoundingClientRect().bottom + window.scrollY + 4) + 'px';
  picker.style.left = badge.getBoundingClientRect().left + 'px';
  document.body.appendChild(picker);

  STATUS_CONTA.forEach(st => {
    const opt = document.createElement('button');
    opt.type = 'button';
    opt.className = 'status-option';
    opt.textContent = st;
    opt.addEventListener('click', () => {
      const conta = db.contas.find(c => c.id === id);
      if (conta) {
        conta.status = st;
        salvarDados(db);
        renderControle();
        // Re-renderiza filtros de conteúdo pois status mudou
        renderFiltrosConteudo();
      }
      picker.remove();
    });
    picker.appendChild(opt);
  });

  // Fechar ao clicar fora
  setTimeout(() => {
    document.addEventListener('click', function fechar(e) {
      if (!picker.contains(e.target)) {
        picker.remove();
        document.removeEventListener('click', fechar);
      }
    });
  }, 0);
}

function abrirModalConta(id) {
  const conta = id ? db.contas.find(c => c.id === id) : null;
  const titulo = conta ? 'Editar conta' : 'Nova conta';

  const statusOpts = STATUS_CONTA.map(s =>
    `<option value="${s}" ${conta?.status === s ? 'selected' : ''}>${s}</option>`
  ).join('');

  const corpo = `
    <div class="form-group">
      <label class="form-label">Nome</label>
      <input class="form-control" name="nome" type="text" value="${esc(conta?.nome || '')}" required>
    </div>
    <div class="form-group">
      <label class="form-label">Handle / Perfil</label>
      <input class="form-control" name="handle" type="text" value="${esc(conta?.handle || '')}">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-control" name="status">${statusOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Tier</label>
        <select class="form-control" name="tier">
          ${[1,2,3].map(t => `<option value="${t}" ${(conta?.tier||1)==t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Responsável</label>
      <input class="form-control" name="responsavel" type="text" value="${esc(conta?.responsavel || '')}">
    </div>
    <div class="form-group">
      <label class="form-label">Cadência</label>
      <input class="form-control" name="cadencia" type="text" value="${esc(conta?.cadencia || '')}">
    </div>
    <div class="form-group">
      <label class="form-label">Bloqueios</label>
      <input class="form-control" name="bloqueio" type="text" value="${esc(conta?.bloqueio || '')}">
    </div>
    <div class="form-group">
      <label class="form-label">Cor (hex)</label>
      <input class="form-control" name="cor" type="color" value="${esc(conta?.cor || '#7c6af7')}" style="height:42px;padding:4px 8px">
    </div>
  `;

  abrirModal(titulo, corpo, form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.nome.trim()) { alert('Nome é obrigatório.'); return; }

    if (conta) {
      Object.assign(conta, dados, { tier: Number(dados.tier) });
    } else {
      db.contas.push({
        id: crypto.randomUUID(),
        nome: dados.nome.trim(),
        handle: dados.handle.trim(),
        status: dados.status,
        responsavel: dados.responsavel.trim(),
        cadencia: dados.cadencia.trim(),
        bloqueio: dados.bloqueio.trim(),
        tier: Number(dados.tier),
        cor: dados.cor,
      });
    }
    salvarDados(db);
    fecharModal();
    renderControle();
    renderFiltrosConteudo();
  }, {
    mostrarExcluir: !!conta,
    onExcluir: () => excluirConta(id),
  });
}

function excluirConta(id) {
  if (!confirm('Excluir esta conta? Os posts vinculados serão mantidos.')) return;
  db.contas = db.contas.filter(c => c.id !== id);
  salvarDados(db);
  renderControle();
  renderFiltrosConteudo();
}

// ─────────────────────────────────────────────
// 7. ABA CONTEÚDO — PRIORIDADE MÁXIMA
// ─────────────────────────────────────────────

function renderConteudo() {
  renderFiltrosConteudo();
  renderNavMes();
  renderContadoresMes();
  renderCalendario();
  renderListaPosts();
  iniciarFiltroStatus();
  vincularBotaoNovoPost();
  iniciarToggleMobileConteudo();
}

function iniciarToggleMobileConteudo() {
  const toggle = document.querySelector('.mobile-view-toggle');
  if (!toggle) return;

  toggle.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.onclick = () => {
      toggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ui.mobileConteudoView = btn.dataset.view;

      const calPanel = document.querySelector('#tab-conteudo .calendar-panel');
      const postList = document.getElementById('post-list');
      const weekList = document.getElementById('mobile-week-list');

      if (ui.mobileConteudoView === 'calendario') {
        calPanel?.classList.remove('is-mobile-hidden');
        postList?.classList.remove('is-mobile-hidden');
        weekList?.classList.remove('is-mobile-active');
      } else {
        calPanel?.classList.add('is-mobile-hidden');
        postList?.classList.add('is-mobile-hidden');
        weekList?.classList.add('is-mobile-active');
        renderMobileSemanas();
      }
    };
  });
}

/** Botões da aba Conteúdo */
function vincularBotaoNovoPost() {
  const btnNovo = document.querySelector('#tab-conteudo .section-head .btn-primary');
  if (btnNovo) {
    btnNovo.style.display = podeEditar() ? '' : 'none';
    if (podeEditar()) btnNovo.onclick = () => abrirModalPost(null);
  }

  const btnImport = document.getElementById('btn-importar-posts');
  if (btnImport) {
    btnImport.style.display = podeEditar() ? '' : 'none';
    if (podeEditar()) btnImport.onclick = () => abrirModalImportarPosts();
  }
}

// ── 7.1 Filtros de perfil ──

function renderFiltrosConteudo() {
  const filtros = document.querySelector('#tab-conteudo .filters');
  if (!filtros) return;

  filtros.innerHTML = `
    <button class="filter-chip ${ui.filtroContaId === null ? 'active' : ''}" type="button" data-conta="todos">Todos</button>
    ${contasVisiveis().map(c => `
      <button class="filter-chip ${ui.filtroContaId === c.id ? 'active' : ''}" type="button" data-conta="${esc(c.id)}">${esc(c.nome)}</button>
    `).join('')}
  `;

  filtros.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.filtroContaId = btn.dataset.conta === 'todos' ? null : btn.dataset.conta;
      renderFiltrosConteudo();
      renderCalendario();
      renderListaPosts();
      renderContadoresMes();
    });
  });
}

// ── 7.2 Navegação de mês ──

function renderNavMes() {
  const nav = document.querySelector('.month-nav');
  if (!nav) return;

  nav.querySelector('[aria-label="Mês anterior"]').onclick = () => {
    ui.calMes--;
    if (ui.calMes < 1) { ui.calMes = 12; ui.calAno--; }
    atualizarMes();
  };

  nav.querySelector('[aria-label="Próximo mês"]').onclick = () => {
    ui.calMes++;
    if (ui.calMes > 12) { ui.calMes = 1; ui.calAno++; }
    atualizarMes();
  };

  atualizarLabelMes();
}

function atualizarMes() {
  atualizarLabelMes();
  renderContadoresMes();
  renderCalendario();
  renderListaPosts();
}

function atualizarLabelMes() {
  const pill = document.querySelector('.month-nav .header-pill');
  if (pill) pill.textContent = `${MESES[ui.calMes - 1]} ${ui.calAno}`;

  // Atualiza também o section-copy da aba Conteúdo
  const copy = document.querySelector('#tab-conteudo .section-copy');
  if (copy) copy.textContent = `Calendário editorial de ${MESES[ui.calMes - 1]} de ${ui.calAno} e fila de posts.`;
}

// ── 7.3 Contadores do mês ──

function renderContadoresMes() {
  const row = document.querySelector('.counter-row');
  if (!row) return;

  const postsMes = postsDoMes();
  const contar = st => postsMes.filter(p => p.status === st).length;

  row.innerHTML = `
    <span class="badge status-rascunho">rascunho ${contar('rascunho')}</span>
    <span class="badge status-em-aprovacao">em aprovação ${contar('em aprovação')}</span>
    <span class="badge status-aprovado">aprovado ${contar('aprovado')}</span>
    <span class="badge status-agendado">agendado ${contar('agendado')}</span>
    <span class="badge status-publicado">publicado ${contar('publicado')}</span>
  `;
}

/** Posts do mês atual, filtrados por conta e por permissão */
function postsDoMes() {
  const idsVisiveis = contasVisiveis().map(c => c.id);
  return db.posts.filter(p => {
    if (!p.dataplanejada) return false;
    const [a, m] = p.dataplanejada.split('-').map(Number);
    if (a !== ui.calAno || m !== ui.calMes) return false;
    if (ui.filtroContaId && p.contaid !== ui.filtroContaId) return false;
    if (!idsVisiveis.includes(p.contaid)) return false;
    return true;
  });
}

// ── 7.4 Calendário visual ──

const STATUS_COLORS = {
  // novos status
  'status-ideia':                 '#6b6b7a',
  'status-pre-producao':          '#3b82f6',
  'status-captacao':              '#f97316',
  'status-edicao':                '#7c6af7',
  'status-produzindo':            '#3b82f6',
  'status-revisando':             '#f97316',
  'status-aguardando-aprovacao':  '#f59e0b',
  'status-aprovado':              '#86efac',
  'status-agendado':              '#22c55e',
  'status-publicado':             '#166534',
  'status-cancelado':             '#ef4444',
  // legado (backward compat)
  'status-rascunho':              '#6b6b7a',
  'status-em-aprovacao':          '#f59e0b',
};

function renderCalendario() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const hoje        = new Date();
  const primeiroDia = new Date(ui.calAno, ui.calMes - 1, 1).getDay();
  const totalDias   = new Date(ui.calAno, ui.calMes, 0).getDate();

  // Intervalo da semana atual (Dom–Sáb)
  const hojeLocal   = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const iniSemana   = new Date(hojeLocal); iniSemana.setDate(hojeLocal.getDate() - hojeLocal.getDay());
  const fimSemana   = new Date(iniSemana); fimSemana.setDate(iniSemana.getDate() + 6);

  const postsPorDia = {};
  postsDoMes().forEach(p => {
    const dia = Number(p.dataplanejada.split('-')[2]);
    if (!postsPorDia[dia]) postsPorDia[dia] = [];
    postsPorDia[dia].push(p);
  });

  let html = '';

  const diasAnterior = new Date(ui.calAno, ui.calMes - 1, 0).getDate();
  for (let i = primeiroDia - 1; i >= 0; i--) {
    html += `<div class="calendar-day is-muted"><span class="calendar-day-number">${diasAnterior - i}</span></div>`;
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const eHoje   = hoje.getDate() === dia && hoje.getMonth() + 1 === ui.calMes && hoje.getFullYear() === ui.calAno;
    const dataISO = `${ui.calAno}-${String(ui.calMes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    const posts   = postsPorDia[dia] || [];

    // Semana atual
    const dataCell  = new Date(ui.calAno, ui.calMes - 1, dia);
    const eSemanaAtual = dataCell >= iniSemana && dataCell <= fimSemana;

    const cards = posts.map(p => {
      const conta      = getConta(p.contaid);
      const cor        = conta?.cor || '#7c6af7';
      const sc         = statusClass(p.status);
      const stColor    = STATUS_COLORS[sc] || '#6b6b7a';
      const tituloTrunc = p.titulo.length > 30 ? p.titulo.slice(0, 28) + '…' : p.titulo;
      const atrasado   = isAtrasado(p);
      return `
        <div class="cal-post-card${atrasado ? ' is-atrasado' : ''}" data-post-id="${esc(p.id)}" title="${esc(p.titulo)}">
          <div class="cal-post-bar" style="background:${esc(cor)}"></div>
          <div class="cal-post-body">
            <span class="cal-post-title">${esc(tituloTrunc)}</span>
            <div class="cal-post-badges">
              <span class="cal-badge" style="background:${esc(cor)}22;border-color:${esc(cor)}55;color:${esc(cor)}">${esc(capitalize(p.formato))}</span>
              <span class="cal-badge" style="background:${stColor}22;border-color:${stColor}55;color:${stColor}">${esc(p.status)}</span>
            </div>
          </div>
        </div>`;
    }).join('');

    html += `
      <div class="calendar-day${eHoje ? ' is-today' : ''}${eSemanaAtual ? ' is-current-week' : ''}" data-date="${esc(dataISO)}">
        <span class="calendar-day-number">${dia}</span>
        ${cards}
      </div>`;
  }

  const totalCelulas = primeiroDia + totalDias;
  const sobras = totalCelulas % 7 === 0 ? 0 : 7 - (totalCelulas % 7);
  for (let i = 1; i <= sobras; i++) {
    html += `<div class="calendar-day is-muted"><span class="calendar-day-number">${i}</span></div>`;
  }

  grid.innerHTML = html;

  grid.onclick = e => {
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      const cell = e.target.closest('.calendar-day:not(.is-muted)');
      if (!cell) return;
      const posts = [...cell.querySelectorAll('.cal-post-card')].map(c => c.dataset.postId);
      if (posts.length === 0) {
        abrirModalPost(null, cell.dataset.date);
      } else if (posts.length === 1) {
        abrirSidebarPost(posts[0]);
      } else {
        abrirDaySheet(cell.dataset.date, posts);
      }
      return;
    }

    const card = e.target.closest('.cal-post-card');
    if (card) {
      e.stopPropagation();
      abrirSidebarPost(card.dataset.postId);
      return;
    }
    const cell = e.target.closest('.calendar-day:not(.is-muted)');
    if (cell && cell.dataset.date) {
      abrirModalPost(null, cell.dataset.date);
    }
  };

  iniciarCalPreview(grid);
}

// ── 7.4a Hover preview no calendário (desktop) ──

let _calPreviewTimer = null;

function iniciarCalPreview(grid) {
  grid.querySelectorAll('.cal-post-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      clearTimeout(_calPreviewTimer);
      _calPreviewTimer = setTimeout(() => mostrarCalPreview(card), 400);
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(_calPreviewTimer);
      esconderCalPreview();
    });
  });
}

function mostrarCalPreview(card) {
  esconderCalPreview();

  const id   = card.dataset.postId;
  const post = db.posts.find(p => p.id === id);
  if (!post) return;

  const conta    = getConta(post.contaid);
  const cor      = conta?.cor || '#7c6af7';
  const sc       = statusClass(post.status);
  const conceito = post.conceito
    ? (post.conceito.length > 100 ? post.conceito.slice(0, 98) + '…' : post.conceito)
    : '';

  const el = document.createElement('div');
  el.id = 'cal-preview';
  el.className = 'cal-preview';
  el.innerHTML = `
    <p class="cal-pv-title">${esc(post.titulo)}</p>
    <p class="cal-pv-meta">
      <span style="color:${esc(cor)};font-weight:700">${esc(conta?.nome || '—')}</span>
      <span>·</span>
      <span>${esc(capitalize(post.formato))}</span>
      <span>·</span>
      <span class="badge ${sc}" style="font-size:0.58rem;min-height:18px;padding:2px 6px">${esc(post.status)}</span>
    </p>
    ${conceito ? `<div class="cal-pv-divider"></div><p class="cal-pv-conceito">${esc(conceito)}</p>` : ''}
    ${(post.responsavel || post.dataplanejada) ? '<div class="cal-pv-divider"></div>' : ''}
    ${post.responsavel  ? `<p class="cal-pv-resp">👤 ${esc(post.responsavel)}</p>` : ''}
    ${post.dataplanejada ? `<p class="cal-pv-data">📅 ${formatarData(post.dataplanejada)}${post.horarioplanejado ? ' às ' + esc(post.horarioplanejado) : ''}</p>` : ''}
  `;

  // Insere invisível para medir dimensões
  el.style.opacity    = '0';
  el.style.transition = 'none';
  document.body.appendChild(el);

  const rect = card.getBoundingClientRect();
  const pvW  = el.offsetWidth  || 236;
  const pvH  = el.offsetHeight || 120;
  const vw   = window.innerWidth;
  const vh   = window.innerHeight;
  const gap  = 8;

  // Tenta à direita; se não couber, abre à esquerda
  let left = rect.right + gap;
  if (left + pvW > vw - gap) left = rect.left - pvW - gap;
  left = Math.max(gap, left);

  // Alinha ao topo do card, clampado à viewport
  let top = rect.top;
  top = Math.min(top, vh - pvH - gap);
  top = Math.max(gap, top);

  el.style.left = left + 'px';
  el.style.top  = top  + 'px';

  // Anima entrada
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.12s ease';
    el.style.opacity    = '1';
  });
}

function esconderCalPreview() {
  clearTimeout(_calPreviewTimer);
  const el = document.getElementById('cal-preview');
  if (el) el.remove();
}

// ── 7.4ab Day sheet mobile (2+ posts) ──

function abrirDaySheet(dataISO, postIds) {
  fecharDaySheet();

  const posts = postIds.map(id => db.posts.find(p => p.id === id)).filter(Boolean);
  const dataFmt = formatarData(dataISO);

  const itemsHtml = posts.map(p => {
    const conta  = getConta(p.contaid);
    const cor    = conta?.cor || '#7c6af7';
    const sc     = statusClass(p.status);
    const stColor = STATUS_COLORS[sc] || '#6b6b7a';
    const titulo = p.titulo.length > 48 ? p.titulo.slice(0, 46) + '…' : p.titulo;
    return `
      <button class="day-sheet-item" data-post-id="${esc(p.id)}">
        <span class="day-sheet-dot" style="background:${esc(cor)}"></span>
        <span class="day-sheet-info">
          <span class="day-sheet-title">${esc(titulo)}</span>
          <span class="day-sheet-badges">
            <span class="cal-badge" style="background:${esc(cor)}22;border-color:${esc(cor)}55;color:${esc(cor)}">${esc(conta?.nome || '—')}</span>
            <span class="cal-badge" style="background:${esc(cor)}22;border-color:${esc(cor)}55;color:${esc(cor)}">${esc(capitalize(p.formato))}</span>
            <span class="cal-badge" style="background:${stColor}22;border-color:${stColor}55;color:${stColor}">${esc(p.status)}</span>
          </span>
        </span>
      </button>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.id = 'day-sheet-overlay';
  overlay.innerHTML = `
    <div id="day-sheet">
      <div class="day-sheet-header">
        <span class="day-sheet-date">${esc(dataFmt)}</span>
        <button class="day-sheet-close" id="day-sheet-close-btn" aria-label="Fechar">✕</button>
      </div>
      <div class="day-sheet-list">
        ${itemsHtml}
        <button class="day-sheet-new" data-date="${esc(dataISO)}">+ Novo post</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('ds-visible');
    document.getElementById('day-sheet').classList.add('ds-open');
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) fecharDaySheet();
  });

  document.getElementById('day-sheet-close-btn').addEventListener('click', fecharDaySheet);

  overlay.querySelectorAll('.day-sheet-item').forEach(btn => {
    btn.addEventListener('click', () => {
      fecharDaySheet();
      abrirSidebarPost(btn.dataset.postId);
    });
  });

  overlay.querySelector('.day-sheet-new').addEventListener('click', e => {
    fecharDaySheet();
    abrirModalPost(null, e.currentTarget.dataset.date);
  });
}

function fecharDaySheet() {
  const overlay = document.getElementById('day-sheet-overlay');
  if (!overlay) return;
  const sheet = document.getElementById('day-sheet');
  overlay.classList.remove('ds-visible');
  if (sheet) sheet.classList.remove('ds-open');
  setTimeout(() => overlay.remove(), 280);
}

// ── 7.4b Lista semanal mobile ──

function renderMobileSemanas() {
  const container = document.getElementById('mobile-week-list');
  if (!container) return;

  const posts = postsDoMes().sort((a, b) => {
    const ka = a.dataplanejada + (a.horarioplanejado || '');
    const kb = b.dataplanejada + (b.horarioplanejado || '');
    return ka.localeCompare(kb);
  });

  if (posts.length === 0) {
    container.innerHTML = '<p class="muted" style="padding:12px">Nenhum post neste período.</p>';
    return;
  }

  const semanas = {};
  posts.forEach(p => {
    const dia = Number(p.dataplanejada.split('-')[2]);
    const sem = Math.ceil(dia / 7);
    if (!semanas[sem]) semanas[sem] = [];
    semanas[sem].push(p);
  });

  container.innerHTML = Object.entries(semanas).map(([, semPosts]) => {
    const dias  = semPosts.map(p => Number(p.dataplanejada.split('-')[2]));
    const dMin  = Math.min(...dias);
    const dMax  = Math.max(...dias);
    const label = dMin === dMax ? `Dia ${dMin}` : `Dias ${dMin}–${dMax}`;

    const items = semPosts.map(p => {
      const conta = getConta(p.contaid);
      const cor   = conta?.cor || '#7c6af7';
      const sc    = statusClass(p.status);
      return `
        <article class="post-item ${sc}" data-id="${esc(p.id)}" style="cursor:pointer;border-left-color:${esc(cor)}">
          <div>
            <div class="post-top">
              <span class="badge" style="background:${esc(cor)}22;border-color:${esc(cor)}55;color:${esc(cor)}">${esc(conta?.nome || '')}</span>
              <span class="badge ${sc}">${esc(p.status)}</span>
            </div>
            <h3 class="post-title">${esc(p.titulo)}</h3>
            <p class="post-meta">${esc(capitalize(p.formato))} · ${formatarData(p.dataplanejada)}${p.horarioplanejado ? ' às ' + esc(p.horarioplanejado) : ''}</p>
          </div>
        </article>`;
    }).join('');

    return `<div class="mobile-week-block"><span class="mobile-week-label">${label}</span>${items}</div>`;
  }).join('');

  container.onclick = e => {
    const article = e.target.closest('.post-item[data-id]');
    if (article) abrirSidebarPost(article.dataset.id);
  };
}

// ── 7.5 Lista de posts ──

function renderListaPosts() {
  const lista = document.getElementById('post-list');
  if (!lista) return;

  let posts = postsDoMes().sort((a, b) => {
    const ka = a.dataplanejada + (a.horarioplanejado || '');
    const kb = b.dataplanejada + (b.horarioplanejado || '');
    return ka.localeCompare(kb);
  });

  if (ui.filtroStatusPost !== 'todos') {
    posts = posts.filter(p => p.status === ui.filtroStatusPost);
  }

  if (posts.length === 0) {
    lista.innerHTML = '<p class="muted" style="padding:12px">Nenhum post neste período.</p>';
    return;
  }

  lista.innerHTML = posts.map(p => {
    const conta = getConta(p.contaid);
    const pc    = profileClass(p.contaid);
    const sc    = statusClass(p.status);
    const atrasado = isAtrasado(p);
    const modificadores = [
      p.status === 'publicado' ? 'is-publicado' : '',
      p.status === 'cancelado' ? 'is-cancelado' : '',
    ].filter(Boolean).join(' ');

    return `
      <article class="post-item ${sc} ${modificadores}" data-id="${esc(p.id)}">
        <div>
          <div class="post-top">
            <span class="badge ${pc}">${esc(conta?.nome || 'Sem conta')}</span>
            <span class="badge ${sc} clickable" data-action="avancar-status" data-id="${esc(p.id)}" title="Clicar para avançar status">${esc(p.status)}</span>
            ${atrasado ? '<span class="badge badge-atrasado">Atrasado</span>' : ''}
          </div>
          <h3 class="post-title">${esc(p.titulo)}</h3>
          <p class="post-meta">${esc(capitalize(p.formato))} · ${esc(p.pilar)} · ${formatarData(p.dataplanejada)}${p.horarioplanejado ? ' às ' + esc(p.horarioplanejado) : ''}</p>
        </div>
        <div class="post-details">
          ${p.responsavel ? `<span class="badge">${esc(p.responsavel)}</span>` : ''}
        </div>
      </article>
    `;
  }).join('');

  lista.onclick = e => {
    // Status badge: avança sem abrir sidebar
    const badge = e.target.closest('[data-action="avancar-status"]');
    if (badge) {
      e.stopPropagation();
      avancarStatusPost(badge.dataset.id);
      return;
    }
    // Clique no artigo → sidebar
    const article = e.target.closest('.post-item[data-id]');
    if (article) abrirSidebarPost(article.dataset.id);
  };
  // Cursor pointer nos artigos
  lista.querySelectorAll('.post-item[data-id]').forEach(a => { a.style.cursor = 'pointer'; });
}

function iniciarFiltroStatus() {
  const sel = document.getElementById('post-status-filter');
  if (!sel) return;

  // Repopular opções
  const statusOpts = ['todos', 'rascunho', 'em aprovação', 'aprovado', 'agendado', 'publicado', 'cancelado'];
  sel.innerHTML = statusOpts.map(s => `<option value="${s}">${s === 'todos' ? 'Todos os status' : capitalize(s)}</option>`).join('');
  sel.value = ui.filtroStatusPost;

  sel.onchange = () => {
    ui.filtroStatusPost = sel.value;
    renderListaPosts();
  };
}

// ── 7.6 Fluxo de status dos posts ──

function getFluxoStatus(formato, tipo) {
  if (formato === 'reels') {
    return ['ideia', 'pré-produção', 'captação', 'edição', 'aguardando aprovação', 'aprovado', 'agendado', 'publicado'];
  }
  if (tipo === 'comercial') {
    return ['ideia', 'produzindo', 'revisando', 'agendado', 'publicado'];
  }
  return ['ideia', 'produzindo', 'aguardando aprovação', 'aprovado', 'agendado', 'publicado'];
}

function avancarStatusPost(id) {
  const post = db.posts.find(p => p.id === id);
  if (!post) return;
  if (post.status === 'cancelado') return;
  if (post.status === 'publicado') return;

  const conta = getConta(post.contaid);
  const fluxo = getFluxoStatus(post.formato, conta?.tipo);
  const idx   = fluxo.indexOf(post.status);
  const next  = idx === -1 ? fluxo[0] : (idx < fluxo.length - 1 ? fluxo[idx + 1] : null);

  if (next) {
    post.status = next;
    const updateFields = { status: post.status };

    if (next === 'aprovado') {
      post.aprovadopor = window.USUARIO?.email || '';
      post.aprovadoem  = new Date().toISOString();
      updateFields.aprovadopor = post.aprovadopor;
      updateFields.aprovadoem  = post.aprovadoem;
    }

    salvarDados(db);
    renderCalendario();
    renderListaPosts();
    renderContadoresMes();
    if (window._sb) {
      _sbEscritaPosts(() => window._sb.schema('public').from('posts').update(updateFields).eq('id', id))
        .then(({ error }) => { if (error) console.warn('[Posts] Erro ao avançar status:', error.message); });
    }
  }
}

function statusClass(status) {
  const map = {
    'ideia':                 'status-ideia',
    'pré-produção':          'status-pre-producao',
    'captação':              'status-captacao',
    'edição':                'status-edicao',
    'produzindo':            'status-produzindo',
    'revisando':             'status-revisando',
    'aguardando aprovação':  'status-aguardando-aprovacao',
    'aprovado':              'status-aprovado',
    'agendado':              'status-agendado',
    'publicado':             'status-publicado',
    'cancelado':             'status-cancelado',
    // legado
    'rascunho':              'status-rascunho',
    'em aprovação':          'status-em-aprovacao',
  };
  return map[status] || 'status-ideia';
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ── 7.7 Modal de post ──

const FORMATOS   = ['feed', 'carrossel', 'reels', 'stories', 'outro'];
const PILARES    = ['vida da igreja', 'ensino', 'evangelização', 'comunhão', 'diagnóstico', 'bastidor', 'portfólio', 'oferta', 'outro'];

const CHECKLISTS_FORMATO = {
  reels:     'Roteiro finalizado | Locação definida | Figurino aprovado | Equipamento carregado | Iluminação testada | Áudio testado | Gravar 3x cada take | Material revisado',
  carrossel: 'Textos revisados | Paleta de cores definida | Fontes corretas | Logo incluído | Testar legibilidade mobile | Ordem dos slides correta | Exportar em JPEG/PNG | Nomear arquivos corretamente',
  feed:      'Texto revisado | Proporção correta (1:1 ou 4:5) | Logo incluído | Testar legibilidade mobile | Exportar em alta resolução',
  stories:   'Proporção 9:16 | Elementos fora da área de corte | Texto legível | CTA visível | Exportar em MP4 ou PNG',
};
const STATUS_POST = ['ideia', 'pré-produção', 'captação', 'edição', 'produzindo', 'revisando', 'aguardando aprovação', 'aprovado', 'agendado', 'publicado', 'cancelado', 'rascunho', 'em aprovação'];

function _buildStatusOpts(formato, contaid, statusAtual) {
  const conta = getConta(contaid);
  const fluxo = getFluxoStatus(formato, conta?.tipo);
  const opcoes = [...fluxo, 'cancelado'];
  // garante que o status atual apareça mesmo se for legado
  if (statusAtual && !opcoes.includes(statusAtual)) opcoes.unshift(statusAtual);
  return opcoes.map(s => `<option value="${s}" ${statusAtual === s ? 'selected' : ''}>${capitalize(s)}</option>`).join('');
}

function abrirModalPost(id, dataPreenchida) {
  const post   = id ? db.posts.find(p => p.id === id) : null;
  const titulo = post ? 'Editar post' : 'Novo post';

  const contaInicial  = post?.contaid || db.contas[0]?.id || '';
  const formatoInicial = post?.formato || 'feed';

  const contasOpts  = db.contas.map(c => `<option value="${esc(c.id)}" ${post?.contaid === c.id ? 'selected' : ''}>${esc(c.nome)}</option>`).join('');
  const formatoOpts = FORMATOS.map(f => `<option value="${f}" ${post?.formato === f ? 'selected' : ''}>${capitalize(f)}</option>`).join('');
  const pilarOpts   = PILARES.map(p => `<option value="${p}" ${post?.pilar === p ? 'selected' : ''}>${capitalize(p)}</option>`).join('');
  const statusOpts  = _buildStatusOpts(formatoInicial, contaInicial, post?.status || 'ideia');
  const dataVal     = post?.dataplanejada || dataPreenchida || '';

  const corpo = `
    <div class="modal-two-col">

      <!-- Coluna esquerda: campos básicos -->
      <div class="modal-col">
        <div class="form-group">
          <label class="form-label">Perfil</label>
          <select class="form-control" name="contaid" tabindex="1">${contasOpts}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Título</label>
          <input class="form-control" id="post-titulo-input" name="titulo" type="text"
            value="${esc(post?.titulo || '')}" tabindex="2" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Formato</label>
            <select class="form-control" name="formato" tabindex="3">${formatoOpts}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Pilar</label>
            <select class="form-control" name="pilar" tabindex="4">${pilarOpts}</select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Data</label>
            <input class="form-control" name="dataplanejada" type="date" value="${esc(dataVal)}" tabindex="5">
          </div>
          <div class="form-group">
            <label class="form-label">Horário</label>
            <input class="form-control" name="horarioplanejado" type="time" value="${esc(post?.horarioplanejado || '')}" tabindex="6">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-control" name="status" tabindex="7">${statusOpts}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Responsável</label>
          <input class="form-control" name="responsavel" type="text" value="${esc(post?.responsavel || '')}" tabindex="8">
        </div>
        <div class="form-group">
          <label class="form-label">Link do arquivo</label>
          <input class="form-control" name="linkarquivo" type="url" value="${esc(post?.linkarquivo || '')}" tabindex="9">
        </div>
      </div>

      <!-- Coluna direita: campos de produção -->
      <div class="modal-col">
        <div class="form-group">
          <label class="form-label">Conceito</label>
          <textarea class="form-control auto-resize" name="conceito" tabindex="10"
            placeholder="Ideia central — o que precisa transmitir">${esc(post?.conceito || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Roteiro</label>
          <textarea class="form-control auto-resize" name="roteiro" tabindex="11"
            placeholder="Shot a shot (reels) ou sequência de slides (carrossel)">${esc(post?.roteiro || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Direção de Edição</label>
          <textarea class="form-control auto-resize" name="direcaoedicao" tabindex="12"
            placeholder="Ritmo, cortes, música, efeitos, texto na tela">${esc(post?.direcaoedicao || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Hashtags</label>
          <textarea class="form-control auto-resize" name="hashtags" tabindex="13"
            placeholder="#hashtag1 #hashtag2">${esc(post?.hashtags || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Legenda</label>
          <textarea class="form-control auto-resize" name="legenda" tabindex="14">${esc(post?.legenda || '')}</textarea>
        </div>
      </div>

      <!-- Linha completa abaixo das duas colunas -->
      <div class="form-group modal-full-row">
        <label class="form-label">
          Checklist de gravação
          <span style="color:#6b6b7a;font-weight:400;text-transform:none;letter-spacing:0">(itens separados por |)</span>
        </label>
        <input class="form-control" name="checklistgravacao" type="text" tabindex="15"
          placeholder="Luz natural | Roupa definida | Local escolhido | Celular carregado"
          value="${esc(post?.checklistgravacao || '')}">
      </div>
      <div class="form-group modal-full-row">
        <label class="form-label">
          Timeline de produção
          <span style="color:#6b6b7a;font-weight:400;text-transform:none;letter-spacing:0">(etapas separadas por |)</span>
        </label>
        <input class="form-control" name="timelineproducao" type="text" tabindex="16"
          placeholder="Roteiro escrito | Gravação feita | Edição concluída | Aprovação | Agendado"
          value="${esc(post?.timelineproducao || '')}">
      </div>
      <div class="form-group modal-full-row">
        <label class="form-label">Observações</label>
        <textarea class="form-control auto-resize" name="observacoes" tabindex="17">${esc(post?.observacoes || '')}</textarea>
      </div>

    </div>
  `;

  abrirModal(titulo, corpo, async form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.titulo.trim()) { alert('Título é obrigatório.'); return; }

    const campos = {
      contaid:           dados.contaid,
      titulo:            dados.titulo.trim(),
      formato:           dados.formato,
      pilar:             dados.pilar,
      dataplanejada:     dados.dataplanejada,
      horarioplanejado:  dados.horarioplanejado,
      legenda:           dados.legenda    || '',
      observacoes:       dados.observacoes || '',
      responsavel:       (dados.responsavel || '').trim(),
      status:            dados.status || 'ideia',
      linkarquivo:       dados.linkarquivo || '',
      conceito:          (dados.conceito      || '').trim(),
      roteiro:           (dados.roteiro       || '').trim(),
      direcaoedicao:     (dados.direcaoedicao || '').trim(),
      hashtags:          (dados.hashtags      || '').trim(),
      checklistgravacao: (dados.checklistgravacao || '').trim(),
      timelineproducao:  (dados.timelineproducao  || '').trim(),
      iniciadoem:        post?.iniciadoem || '',
    };

    // Registro automático de aprovação
    if (campos.status === 'aprovado' && (!post || post.status !== 'aprovado')) {
      campos.aprovadopor = window.USUARIO?.email || '';
      campos.aprovadoem  = new Date().toISOString();
    } else {
      campos.aprovadopor = post?.aprovadopor || '';
      campos.aprovadoem  = post?.aprovadoem  || '';
    }

    if (post) {
      campos.checklistgravacaochecked = campos.checklistgravacao !== post.checklistgravacao
        ? '' : (post.checklistgravacaochecked || '');
      campos.timelineproducaochecked = campos.timelineproducao !== post.timelineproducao
        ? '' : (post.timelineproducaochecked || '');

      const { error } = await _sbEscritaPosts(() => window._sb.schema('public').from('posts').update(campos).eq('id', id));
      if (error) { alert('Erro ao salvar post: ' + error.message); return; }
      Object.assign(post, campos);
    } else {
      const novoPost = { id: crypto.randomUUID(), checklistgravacaochecked: '', timelineproducaochecked: '', ...campos };
      const { error } = await _sbEscritaPosts(() => window._sb.schema('public').from('posts').insert(novoPost));
      if (error) { alert('Erro ao criar post: ' + error.message); return; }
      db.posts.push(novoPost);
    }
    salvarDados(db);
    fecharModal();
    renderCalendario();
    renderListaPosts();
    renderContadoresMes();
  }, {
    mostrarExcluir: !!post,
    onExcluir: async () => {
      const { error } = await _sbEscritaPosts(() => window._sb.schema('public').from('posts').delete().eq('id', id));
      if (error) { alert('Erro ao excluir post: ' + error.message); return; }
      db.posts = db.posts.filter(p => p.id !== id);
      salvarDados(db);
      renderCalendario();
      renderListaPosts();
      renderContadoresMes();
    },
    wide: true,
  });

  // Pós-abertura: foco no título, auto-resize, Ctrl+Enter
  requestAnimationFrame(() => {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    const tituloEl = overlay.querySelector('#post-titulo-input');
    if (tituloEl) tituloEl.focus();

    // Atualiza options de status ao mudar formato ou conta
    const selFormato = overlay.querySelector('[name="formato"]');
    const selConta   = overlay.querySelector('[name="contaid"]');
    const selStatus  = overlay.querySelector('[name="status"]');
    const chkInput   = overlay.querySelector('[name="checklistgravacao"]');
    const _syncStatus = () => {
      if (!selFormato || !selConta || !selStatus) return;
      const cur = selStatus.value;
      selStatus.innerHTML = _buildStatusOpts(selFormato.value, selConta.value, cur);
    };

    // Checklist padrão por formato
    let _btnUsarPadrao = null;
    const _preencherChecklist = (formato) => {
      const padrao = CHECKLISTS_FORMATO[formato];
      if (!padrao || !chkInput) return;
      if (!chkInput.value.trim()) {
        chkInput.value = padrao;
      } else if (chkInput.value.trim() !== padrao) {
        if (!_btnUsarPadrao) {
          _btnUsarPadrao = document.createElement('button');
          _btnUsarPadrao.type = 'button';
          _btnUsarPadrao.className = 'btn';
          _btnUsarPadrao.style.cssText = 'margin-top:6px;font-size:0.78rem';
          _btnUsarPadrao.textContent = 'Usar padrão do formato';
          chkInput.parentElement.appendChild(_btnUsarPadrao);
          _btnUsarPadrao.addEventListener('click', () => {
            chkInput.value = CHECKLISTS_FORMATO[selFormato?.value] || '';
            _btnUsarPadrao.remove();
            _btnUsarPadrao = null;
          });
        }
      }
    };

    if (selFormato) selFormato.addEventListener('change', () => { _syncStatus(); if (_btnUsarPadrao) { _btnUsarPadrao.remove(); _btnUsarPadrao = null; } _preencherChecklist(selFormato.value); });
    if (selConta)   selConta.addEventListener('change', _syncStatus);
    // Novo post: preenche checklist com padrão do formato inicial
    if (!id && selFormato) _preencherChecklist(selFormato.value);

    overlay.querySelectorAll('.auto-resize').forEach(ta => {
      ta.style.height = 'auto';
      ta.style.height = Math.max(64, ta.scrollHeight) + 'px';
      ta.addEventListener('input', () => {
        ta.style.height = 'auto';
        ta.style.height = Math.max(64, ta.scrollHeight) + 'px';
      });
    });

    overlay.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        overlay.querySelector('#modal-salvar')?.click();
      }
    });
  });
}

// ── 7.8 Importação em lote de posts ──

function abrirModalImportarPosts() {
  let fase = 1;
  let postsValidados = [];
  let isDupArr       = [];

  const corpo = `
    <div id="import-fase1">
      <div class="form-group">
        <label class="form-label">Cole o JSON com os posts</label>
        <textarea class="form-control import-json-area" id="import-json-input"
          placeholder='[{"titulo":"Título", "contaid":"1", "dataplanejada":"2026-05-01", "formato":"reels", ...}]'></textarea>
      </div>
      <p id="import-erro" class="import-erro"></p>
    </div>
    <div id="import-fase2" style="display:none"></div>
  `;

  abrirModal('Importar posts', corpo, async () => {
    if (fase === 1) {
      const jsonStr = document.getElementById('import-json-input')?.value || '';
      const result  = _validarImportJSON(jsonStr);

      if (!result.ok) {
        document.getElementById('import-erro').textContent = result.erro;
        return; // mantém modal aberto
      }

      postsValidados = result.posts;
      isDupArr       = result.isDupArr;

      document.getElementById('import-fase1').style.display = 'none';
      document.getElementById('import-fase2').innerHTML     = _renderPreviewImport(postsValidados, isDupArr);
      document.getElementById('import-fase2').style.display = 'block';
      document.getElementById('modal-salvar').textContent   = 'Confirmar importação';
      fase = 2;

    } else {
      await _confirmarImport(postsValidados, isDupArr);
    }
  }, { labelSalvar: 'Analisar JSON', wide: true });
}

function _validarImportJSON(jsonStr) {
  if (!jsonStr.trim()) return { ok: false, erro: 'Cole um JSON válido no campo acima.' };

  let arr;
  try { arr = JSON.parse(jsonStr); }
  catch (e) { return { ok: false, erro: `JSON inválido: ${e.message}` }; }

  if (!Array.isArray(arr)) return { ok: false, erro: 'O JSON deve ser um array  [ { ... }, { ... } ].' };
  if (arr.length === 0)    return { ok: false, erro: 'O array está vazio.' };

  const erros = [];
  const posts = arr.map((item, i) => {
    const ausentes = [];
    if (!String(item.titulo  ?? '').trim()) ausentes.push('titulo');
    if (!String(item.contaid ?? ''))        ausentes.push('contaid');
    if (!item.dataplanejada)                ausentes.push('dataplanejada');
    if (ausentes.length) erros.push(`Item ${i + 1}: campos obrigatórios ausentes (${ausentes.join(', ')})`);

    return {
      id:                       crypto.randomUUID(),
      contaid:                  String(item.contaid          ?? ''),
      titulo:                   String(item.titulo           ?? '').trim(),
      formato:                  item.formato                 || 'feed',
      pilar:                    item.pilar                   || 'outro',
      dataplanejada:            item.dataplanejada           || '',
      horarioplanejado:         item.horarioplanejado        || '',
      conceito:                 item.conceito                || '',
      roteiro:                  item.roteiro                 || '',
      direcaoedicao:            item.direcaoedicao           || '',
      checklistgravacao:        item.checklistgravacao       || '',
      checklistgravacaochecked: '',
      timelineproducao:         item.timelineproducao        || '',
      timelineproducaochecked:  '',
      hashtags:                 item.hashtags                || '',
      legenda:                  item.legenda                 || '',
      observacoes:              item.observacoes             || '',
      responsavel:              String(item.responsavel      ?? '').trim(),
      status:                   item.status                  || 'rascunho',
      linkarquivo:              item.linkarquivo             || '',
    };
  });

  if (erros.length) return { ok: false, erro: erros.join('\n') };

  const isDupArr = posts.map(p =>
    db.posts.some(ex =>
      ex.titulo.toLowerCase() === p.titulo.toLowerCase() &&
      ex.dataplanejada === p.dataplanejada
    )
  );

  return { ok: true, posts, isDupArr };
}

function _renderPreviewImport(posts, isDupArr) {
  const dupCount = isDupArr.filter(Boolean).length;

  const linhas = posts.map((p, i) => {
    const isDup = isDupArr[i];
    const conta = getConta(p.contaid);
    const sc    = statusClass(p.status);
    return `
      <div class="import-preview-row${isDup ? ' import-dup' : ''}">
        <div class="import-preview-info">
          <span class="import-preview-titulo">${esc(p.titulo)}</span>
          <span class="import-preview-meta">
            ${esc(conta?.nome || `ID:${p.contaid}`)} · ${formatarData(p.dataplanejada)}
            · <span class="badge ${sc}" style="font-size:0.56rem;min-height:16px;padding:1px 5px">${esc(p.status)}</span>
          </span>
        </div>
        ${isDup ? `
        <div class="import-preview-dup">
          <span class="import-dup-badge">⚠ já existe</span>
          <select class="form-control import-dup-action" data-idx="${i}">
            <option value="sobrescrever">Sobrescrever</option>
            <option value="pular">Pular</option>
          </select>
        </div>` : ''}
      </div>`;
  }).join('');

  return `
    <p class="import-preview-header">
      <strong>${posts.length}</strong> post${posts.length !== 1 ? 's' : ''} encontrado${posts.length !== 1 ? 's' : ''}.
      ${dupCount > 0
        ? `<span class="import-dup-warn"> ${dupCount} já existe${dupCount !== 1 ? 'm' : ''} — escolha a ação abaixo.</span>`
        : ' Nenhuma duplicata encontrada.'}
    </p>
    <div class="import-preview-list">${linhas}</div>`;
}

async function _confirmarImport(posts, isDupArr) {
  let criados     = 0;
  let atualizados = 0;
  let pulados     = 0;
  const erros     = [];

  const postsParaSalvar = [];
  const tiposAcao       = [];

  for (let i = 0; i < posts.length; i++) {
    const post   = posts[i];
    const sel    = document.querySelector(`.import-dup-action[data-idx="${i}"]`);
    const action = isDupArr[i] ? (sel?.value || 'pular') : 'criar';

    if (action === 'pular') { pulados++; continue; }

    if (action === 'sobrescrever') {
      const { data: existente, error: errBusca } = await window._sb
        .schema('public')
        .from('posts')
        .select('id')
        .eq('contaid',       post.contaid)
        .eq('dataplanejada', post.dataplanejada)
        .eq('titulo',        post.titulo)
        .maybeSingle();

      if (errBusca) { erros.push(`"${post.titulo}": ${errBusca.message}`); continue; }

      postsParaSalvar.push({ ...post, id: existente?.id || post.id });
    } else {
      postsParaSalvar.push(post);
    }
    tiposAcao.push(action);
  }

  if (postsParaSalvar.length > 0) {
    const response = await fetch(
      'https://syqskrpjzceocmjlirnp.supabase.co/functions/v1/upsert-posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': window._sbKey,
          'Authorization': `Bearer ${window._sbKey}`
        },
        body: JSON.stringify({ posts: postsParaSalvar })
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      console.error('[upsert-posts] erro HTTP', response.status, txt);
      erros.push(`Erro na Edge Function (${response.status}): ${txt}`);
    } else {
      const raw     = await response.json();
      const results = Array.isArray(raw) ? raw : [];
      if (!Array.isArray(raw)) console.warn('[upsert-posts] resposta inesperada:', raw);

      results.forEach((r, i) => {
        if (r.error) {
          erros.push(`"${r.titulo}": ${r.error}`);
        } else if (tiposAcao[i] === 'sobrescrever') {
          atualizados++;
        } else {
          criados++;
        }
      });
    }
  }

  // Recarrega do Supabase para garantir consistência
  await carregarPostsSupabase();
  fecharModal();
  renderCalendario();
  renderListaPosts();
  renderContadoresMes();

  const partes = [];
  if (criados > 0)      partes.push(`${criados} criado${criados !== 1 ? 's' : ''}`);
  if (atualizados > 0)  partes.push(`${atualizados} atualizado${atualizados !== 1 ? 's' : ''}`);
  if (pulados > 0)      partes.push(`${pulados} pulado${pulados !== 1 ? 's' : ''}`);
  const resumo = `Importação concluída!\n${partes.join(', ') || 'Nenhum post processado'}.`;
  const detalhesErro = erros.length ? `\n\nErros (${erros.length}):\n${erros.slice(0, 5).join('\n')}` : '';
  alert(resumo + detalhesErro);
}

// ─────────────────────────────────────────────
// 8. ABA ESTA SEMANA
// ─────────────────────────────────────────────

const DOMINIOS = ['REUNIÃO', 'EQUIPE', 'CONTEÚDO', 'CULTO', 'OUTRO'];

function atualizarBadgeTarefas() {
  const btn = document.querySelector('.tab[data-target="tab-semana"]');
  if (!btn) return;
  const pendentes = db.tarefas.filter(t => !t.concluida).length;
  let badge = btn.querySelector('.tab-badge');
  if (pendentes === 0) {
    if (badge) badge.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'tab-badge';
    btn.appendChild(badge);
  }
  badge.textContent = pendentes > 99 ? '99+' : String(pendentes);
}

function renderSemana() {
  const container = document.getElementById('week-tasks');
  if (!container) return;

  // Filtrar tarefas por conta para visualizadores restritos
  const _u = window.USUARIO;
  const _semRestricaoT = !_u || _u.papel === 'admin' || !_u.contasPermitidas || _u.contasPermitidas.length === 0;
  const _idsVisiveisT = _semRestricaoT ? null : contasVisiveis().map(c => c.id);
  const tarefasFiltradas = _idsVisiveisT === null
    ? db.tarefas
    : db.tarefas.filter(t => !t.contaid || _idsVisiveisT.includes(t.contaid));

  // Agrupar tarefas por domínio
  const grupos = {};
  DOMINIOS.forEach(d => { grupos[d] = []; });
  tarefasFiltradas.forEach(t => {
    const dom = t.dominio.toUpperCase();
    if (!grupos[dom]) grupos[dom] = [];
    grupos[dom].push(t);
  });

  container.innerHTML = DOMINIOS.map(dom => {
    const tarefas = grupos[dom] || [];
    const domClass = 'domain-' + dom.toLowerCase().replace(/[^a-z]/g, '');
    const itens = tarefas.length
      ? tarefas.map(t => `
          <article class="task-card ${t.concluida ? 'is-concluida' : ''}" data-id="${esc(t.id)}">
            <input class="task-check" type="checkbox" ${t.concluida ? 'checked' : ''}
              aria-label="${esc(t.titulo)}" data-action="toggle-tarefa" data-id="${esc(t.id)}">
            <div class="task-content">
              <h4 class="task-title">${esc(t.titulo)}</h4>
              <div class="task-badges">
                <span class="badge ${domClass}">${esc(t.dominio)}</span>
                ${t.contaid ? (() => { const _c = getConta(t.contaid); return _c ? `<span class="badge" style="background:${esc(_c.cor)}22;border-color:${esc(_c.cor)}55;color:${esc(_c.cor)}">${esc(_c.nome)}</span>` : ''; })() : ''}
              </div>
            </div>
            ${podeEditar() ? `<button class="icon-button" type="button" aria-label="Excluir tarefa" data-action="excluir-tarefa" data-id="${esc(t.id)}">×</button>` : ''}
          </article>
        `).join('')
      : '<p class="muted">Sem tarefas neste domínio.</p>';

    return `
      <section class="week-domain">
        <h3 class="domain-title">${esc(dom)}</h3>
        ${itens}
      </section>
    `;
  }).join('');

  // Eventos (onclick/onchange substituem anteriores)
  container.onclick  = onClickSemana;
  container.onchange = onChangeSemana;

  // Botões de cabeçalho (section-head para não pegar botões dos cards)
  const btnNova    = document.querySelector('#tab-semana .section-head .btn-primary');
  const btnNovaSeq = document.querySelector('#tab-semana .section-head .btn:not(.btn-primary)');

  if (btnNova)    { btnNova.style.display    = podeEditar() ? '' : 'none'; if (podeEditar()) btnNova.onclick    = () => abrirModalTarefa(null); }
  if (btnNovaSeq) { btnNovaSeq.style.display = podeEditar() ? '' : 'none'; if (podeEditar()) btnNovaSeq.onclick = () => novaSemana(); }

  atualizarBadgeTarefas();
}

function onClickSemana(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  if (btn.dataset.action === 'excluir-tarefa') excluirTarefa(btn.dataset.id);
}

function onChangeSemana(e) {
  const check = e.target.closest('[data-action="toggle-tarefa"]');
  if (!check) return;
  toggleTarefa(check.dataset.id);
}

function toggleTarefa(id) {
  const t = db.tarefas.find(t => t.id === id);
  if (!t) return;
  t.concluida = !t.concluida;
  salvarDados(db);
  renderSemana();
  atualizarBadgeTarefas();
  if (window._sb) {
    _sbEscritaTarefas(() => window._sb.from('tarefas').update({ concluida: t.concluida }).eq('id', id))
      .then(({ error }) => { if (error) console.warn('[Tarefas] Erro ao salvar toggle:', error.message); });
  }
}

function excluirTarefa(id) {
  if (!confirm('Excluir esta tarefa?')) return;
  db.tarefas = db.tarefas.filter(t => t.id !== id);
  salvarDados(db);
  renderSemana();
  if (window._sb) {
    _sbEscritaTarefas(() => window._sb.from('tarefas').delete().eq('id', id))
      .then(({ error }) => { if (error) console.warn('[Tarefas] Erro ao excluir tarefa:', error.message); });
  }
}

function novaSemana() {
  const concluidas = db.tarefas.filter(t => t.concluida).length;
  if (concluidas === 0) { alert('Nenhuma tarefa concluída para remover.'); return; }
  if (!confirm(`Remover ${concluidas} tarefa(s) concluída(s) e iniciar nova semana?`)) return;
  const idsRemover = db.tarefas.filter(t => t.concluida).map(t => t.id);
  db.tarefas = db.tarefas.filter(t => !t.concluida);
  salvarDados(db);
  renderSemana();
  if (window._sb && idsRemover.length > 0) {
    _sbEscritaTarefas(() => window._sb.from('tarefas').delete().in('id', idsRemover))
      .then(({ error }) => { if (error) console.warn('[Tarefas] Erro ao limpar semana:', error.message); });
  }
}

function abrirModalTarefa(id) {
  const tarefa = id ? db.tarefas.find(t => t.id === id) : null;
  const titulo = tarefa ? 'Editar tarefa' : 'Nova tarefa';

  const domOpts = DOMINIOS.map(d =>
    `<option value="${d}" ${tarefa?.dominio === d ? 'selected' : ''}>${d}</option>`
  ).join('');

  const contaOpts = `<option value="">Geral (todos veem)</option>` +
    db.contas.map(c => `<option value="${esc(c.id)}" ${tarefa?.contaid === c.id ? 'selected' : ''}>${esc(c.nome)}</option>`).join('');

  const corpo = `
    <div class="form-group">
      <label class="form-label">Título</label>
      <input class="form-control" name="titulo" type="text" value="${esc(tarefa?.titulo || '')}" required>
    </div>
    <div class="form-group">
      <label class="form-label">Domínio</label>
      <select class="form-control" name="dominio">${domOpts}</select>
    </div>
    <div class="form-group">
      <label class="form-label">Conta relacionada</label>
      <select class="form-control" name="contaid">${contaOpts}</select>
    </div>
  `;

  abrirModal(titulo, corpo, async form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.titulo.trim()) { alert('Título é obrigatório.'); return; }

    if (tarefa) {
      const campos = { titulo: dados.titulo.trim(), dominio: dados.dominio, contaid: dados.contaid || '' };
      if (window._sb) {
        const { error } = await _sbEscritaTarefas(() => window._sb.from('tarefas').update(campos).eq('id', id));
        if (error) { alert('Erro ao salvar tarefa: ' + error.message); return; }
      }
      Object.assign(tarefa, campos);
    } else {
      const novaTarefa = {
        id: crypto.randomUUID(),
        titulo: dados.titulo.trim(),
        dominio: dados.dominio,
        contaid: dados.contaid || '',
        concluida: false,
      };
      if (window._sb) {
        const { error } = await _sbEscritaTarefas(() => window._sb.from('tarefas').insert(novaTarefa));
        if (error) { alert('Erro ao criar tarefa: ' + error.message); return; }
      }
      db.tarefas.push(novaTarefa);
    }
    salvarDados(db);
    fecharModal();
    renderSemana();
  }, {
    mostrarExcluir: !!tarefa,
    onExcluir: async () => {
      if (window._sb) {
        const { error } = await _sbEscritaTarefas(() => window._sb.from('tarefas').delete().eq('id', id));
        if (error) { alert('Erro ao excluir tarefa: ' + error.message); return; }
      }
      db.tarefas = db.tarefas.filter(t => t.id !== id);
      salvarDados(db);
      renderSemana();
    },
  });
}

// ─────────────────────────────────────────────
// 9. ABA EQUIPE
// ─────────────────────────────────────────────

const STATUS_EQUIPE = ['ativo', 'parcial', 'eventual', 'confirmar', 'limitado', 'afastado'];

// Agrupamento de status para exibição
const GRUPOS_EQUIPE = [
  { titulo: 'Ativos',               statuses: ['ativo', 'limitado'] },
  { titulo: 'Parcial-Eventual',     statuses: ['parcial', 'eventual'] },
  { titulo: 'A Confirmar',          statuses: ['confirmar'] },
  { titulo: 'Temporariamente Fora', statuses: ['afastado'] },
];

function renderEquipe() {
  renderContadoresEquipe();
  renderPessoas();
  renderLacunas();

  // Seletores com .section-head para não pegar botões dos cards renderizados
  const btnPessoa = document.querySelector('#tab-equipe .section-head .btn-primary');
  const btnLacuna = document.querySelector('#tab-equipe .section-head .btn:not(.btn-primary)');
  if (btnPessoa) { btnPessoa.style.display = podeEditar() ? '' : 'none'; if (podeEditar()) btnPessoa.onclick = () => abrirModalPessoa(null); }
  if (btnLacuna) { btnLacuna.style.display = podeEditar() ? '' : 'none'; if (podeEditar()) btnLacuna.onclick = () => abrirModalLacuna(null); }
}

function renderContadoresEquipe() {
  const grid = document.querySelector('#tab-equipe .stat-grid');
  if (!grid) return;

  const ativos   = db.equipe.filter(e => e.status === 'ativo').length;
  const parciais  = db.equipe.filter(e => ['parcial','eventual'].includes(e.status)).length;
  const confirmar = db.equipe.filter(e => e.status === 'confirmar').length;

  const cards = grid.querySelectorAll('.stat-number');
  if (cards[0]) cards[0].textContent = ativos;
  if (cards[1]) cards[1].textContent = parciais;
  if (cards[2]) cards[2].textContent = confirmar;
}

function renderPessoas() {
  const lista = document.getElementById('team-list');
  if (!lista) return;

  lista.innerHTML = GRUPOS_EQUIPE.map(grupo => {
    const pessoas = db.equipe.filter(e => grupo.statuses.includes(e.status));
    if (pessoas.length === 0) return '';

    return `
      <section class="team-block">
        <h3 class="team-block-title">${esc(grupo.titulo)}</h3>
        <div class="people-list">
          ${pessoas.map(p => {
            const sc = `status-${p.status}`;
            return `
              <article class="person-card ${sc}" data-id="${esc(p.id)}">
                <span class="avatar ${sc}">${esc(p.iniciais)}</span>
                <div class="person-info">
                  <div class="person-top">
                    <div>
                      <h4 class="person-name">${esc(p.nome)}</h4>
                      <p class="person-role"><span class="person-field-label">Função:</span> ${esc(p.funcao)}</p>
                      ${podeEditar() && p.capacidade ? `<p class="person-role person-capacity"><span class="person-field-label">Capacidade:</span> ${esc(p.capacidade)}</p>` : ''}
                    </div>
                    <span class="badge ${sc} clickable" data-action="status-pessoa" data-id="${esc(p.id)}">${esc(p.status)}</span>
                  </div>
                  ${podeEditar() ? `
                  <div class="person-actions">
                    <button class="btn" type="button" data-action="editar-pessoa" data-id="${esc(p.id)}">Editar</button>
                    <button class="btn btn-danger" type="button" data-action="excluir-pessoa" data-id="${esc(p.id)}">Excluir</button>
                  </div>` : ''}
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }).join('');

  lista.onclick = onClickEquipe;
}

function onClickEquipe(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === 'editar-pessoa')  abrirModalPessoa(id);
  if (action === 'excluir-pessoa') excluirPessoa(id);
  if (action === 'status-pessoa')  abrirPickerStatusEquipe(btn, id);
}

function abrirPickerStatusEquipe(badge, id) {
  document.querySelectorAll('.inline-status-picker').forEach(p => p.remove());

  const picker = document.createElement('div');
  picker.className = 'inline-status-picker';
  picker.style.position = 'fixed';
  picker.style.top  = badge.getBoundingClientRect().bottom + 4 + 'px';
  picker.style.left = badge.getBoundingClientRect().left + 'px';
  document.body.appendChild(picker);

  STATUS_EQUIPE.forEach(st => {
    const opt = document.createElement('button');
    opt.type = 'button';
    opt.className = 'status-option';
    opt.textContent = st;
    opt.addEventListener('click', () => {
      const pessoa = db.equipe.find(e => e.id === id);
      if (pessoa) {
        pessoa.status = st;
        salvarDados(db);
        renderEquipe();
      }
      picker.remove();
    });
    picker.appendChild(opt);
  });

  setTimeout(() => {
    document.addEventListener('click', function fechar(e) {
      if (!picker.contains(e.target)) {
        picker.remove();
        document.removeEventListener('click', fechar);
      }
    });
  }, 0);
}

function abrirModalPessoa(id) {
  const pessoa = id ? db.equipe.find(e => e.id === id) : null;
  const titulo = pessoa ? 'Editar pessoa' : 'Adicionar pessoa';

  const statusOpts = STATUS_EQUIPE.map(s =>
    `<option value="${s}" ${pessoa?.status === s ? 'selected' : ''}>${s}</option>`
  ).join('');

  const corpo = `
    <div class="form-group">
      <label class="form-label">Nome completo</label>
      <input class="form-control" name="nome" type="text" value="${esc(pessoa?.nome || '')}" required id="input-nome-pessoa">
    </div>
    <div class="form-group">
      <label class="form-label">Iniciais (auto-geradas, editáveis)</label>
      <input class="form-control" name="iniciais" type="text" maxlength="3" value="${esc(pessoa?.iniciais || '')}" id="input-iniciais-pessoa">
    </div>
    <div class="form-group">
      <label class="form-label">Função atual</label>
      <textarea class="form-control" name="funcao">${esc(pessoa?.funcao || '')}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Capacidade disponível</label>
      <textarea class="form-control" name="capacidade">${esc(pessoa?.capacidade || '')}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <select class="form-control" name="status">${statusOpts}</select>
    </div>
  `;

  abrirModal(titulo, corpo, form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.nome.trim()) { alert('Nome é obrigatório.'); return; }

    const iniciais = dados.iniciais.trim() || gerarIniciais(dados.nome);

    if (pessoa) {
      Object.assign(pessoa, { nome: dados.nome.trim(), iniciais, funcao: dados.funcao.trim(), capacidade: dados.capacidade.trim(), status: dados.status });
    } else {
      db.equipe.push({
        id: crypto.randomUUID(),
        nome: dados.nome.trim(),
        iniciais,
        funcao: dados.funcao.trim(),
        capacidade: dados.capacidade.trim(),
        status: dados.status,
      });
    }
    salvarDados(db);
    fecharModal();
    renderEquipe();
  }, {
    mostrarExcluir: !!pessoa,
    onExcluir: () => excluirPessoa(id),
  });

  // Auto-gerar iniciais ao digitar nome
  requestAnimationFrame(() => {
    const inputNome     = document.getElementById('input-nome-pessoa');
    const inputIniciais = document.getElementById('input-iniciais-pessoa');
    if (inputNome && inputIniciais) {
      inputNome.addEventListener('input', () => {
        if (!inputIniciais.dataset.editado) {
          inputIniciais.value = gerarIniciais(inputNome.value);
        }
      });
      inputIniciais.addEventListener('input', () => {
        inputIniciais.dataset.editado = '1';
      });
    }
  });
}

function excluirPessoa(id) {
  if (!confirm('Excluir esta pessoa da equipe?')) return;
  db.equipe = db.equipe.filter(e => e.id !== id);
  salvarDados(db);
  renderEquipe();
}

// ── 9.2 Lacunas ──

function renderLacunas() {
  const lista = document.getElementById('gap-list');
  if (!lista) return;

  lista.innerHTML = db.lacunas.map(l => {
    const pct = l.necessario > 0 ? Math.min(100, Math.round((l.atual / l.necessario) * 100)) : 0;
    return `
      <article class="gap-card" data-id="${esc(l.id)}">
        <div class="gap-top">
          <div>
            <h4 class="gap-title">${esc(l.funcao)}</h4>
            <p class="gap-description">${esc(l.descricao)}</p>
          </div>
          <span class="gap-counter">${l.atual} / ${l.necessario}</span>
        </div>
        <div class="gap-progress-bar">
          <div class="gap-progress-fill" style="width:${pct}%"></div>
        </div>
        ${podeEditar() ? `
        <div class="card-actions">
          <button class="btn" type="button" data-action="editar-lacuna" data-id="${esc(l.id)}">Editar</button>
          <button class="btn btn-danger" type="button" data-action="excluir-lacuna" data-id="${esc(l.id)}">Excluir</button>
        </div>` : ''}
      </article>
    `;
  }).join('');

  lista.onclick = e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'editar-lacuna')  abrirModalLacuna(id);
    if (action === 'excluir-lacuna') excluirLacuna(id);
  };
}

function abrirModalLacuna(id) {
  const lacuna = id ? db.lacunas.find(l => l.id === id) : null;
  const titulo = lacuna ? 'Editar lacuna' : 'Nova lacuna';

  const corpo = `
    <div class="form-group">
      <label class="form-label">Função</label>
      <input class="form-control" name="funcao" type="text" value="${esc(lacuna?.funcao || '')}" required>
    </div>
    <div class="form-group">
      <label class="form-label">Descrição</label>
      <input class="form-control" name="descricao" type="text" value="${esc(lacuna?.descricao || '')}">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Atual</label>
        <input class="form-control" name="atual" type="number" min="0" value="${lacuna?.atual ?? 0}">
      </div>
      <div class="form-group">
        <label class="form-label">Necessário</label>
        <input class="form-control" name="necessario" type="number" min="1" value="${lacuna?.necessario ?? 1}">
      </div>
    </div>
  `;

  abrirModal(titulo, corpo, form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.funcao.trim()) { alert('Função é obrigatória.'); return; }

    if (lacuna) {
      Object.assign(lacuna, {
        funcao: dados.funcao.trim(),
        descricao: dados.descricao.trim(),
        atual: Number(dados.atual),
        necessario: Number(dados.necessario),
      });
    } else {
      db.lacunas.push({
        id: crypto.randomUUID(),
        funcao: dados.funcao.trim(),
        descricao: dados.descricao.trim(),
        atual: Number(dados.atual),
        necessario: Number(dados.necessario),
      });
    }
    salvarDados(db);
    fecharModal();
    renderLacunas();
  }, {
    mostrarExcluir: !!lacuna,
    onExcluir: () => excluirLacuna(id),
  });
}

function excluirLacuna(id) {
  if (!confirm('Excluir esta lacuna?')) return;
  db.lacunas = db.lacunas.filter(l => l.id !== id);
  salvarDados(db);
  renderLacunas();
}

// ─────────────────────────────────────────────
// 10. ABA EVENTOS
// ─────────────────────────────────────────────

/**
 * Calcula urgência de um evento.
 * @returns {{ texto: string, cor: string, statusClass: string }}
 */
function calcularUrgencia(dia, mes, ano) {
  if (!mes) return { texto: 'CONFIRMAR DATA', cor: '#6b6b7a', statusClass: 'status-confirmar' };

  const hoje  = new Date();
  const evento = new Date(ano, mes - 1, dia || 1);
  const diff  = Math.floor((evento - hoje) / (1000 * 60 * 60 * 24));

  if (diff < 0)   return { texto: 'ENCERRADO',     cor: '#6b6b7a', statusClass: 'status-afastado' };
  if (diff <= 30) return { texto: 'URGENTE',        cor: '#ef4444', statusClass: 'status-travado' };
  if (diff <= 60) return { texto: 'EM BREVE',       cor: '#f59e0b', statusClass: 'status-instavel' };
  return              { texto: `${diff}d`,           cor: '#3b82f6', statusClass: 'status-agendado' };
}

function renderEventos() {
  const lista = document.getElementById('event-list');
  if (!lista) return;

  const u = window.USUARIO;
  const semRestricao = !u || u.papel === 'admin' || !u.contasPermitidas || u.contasPermitidas.length === 0;
  let eventosFiltrados;
  if (semRestricao) {
    eventosFiltrados = db.eventos;
  } else {
    const termos = contasVisiveis().flatMap(c => [c.nome, c.handle]).filter(Boolean);
    eventosFiltrados = db.eventos.filter(ev =>
      !ev.conjunto ||
      termos.some(t => ev.conjunto === t || t.includes(ev.conjunto) || ev.conjunto.includes(t))
    );
  }

  lista.innerHTML = eventosFiltrados.map(ev => {
    const urg = calcularUrgencia(ev.dia, ev.mes, ev.ano);
    const mesLabel = ev.mes ? MESES_CURTOS[ev.mes - 1] : String(ev.ano);
    const diaLabel = ev.dia ? String(ev.dia).padStart(2, '0') : '--';

    return `
      <article class="event-card ${urg.statusClass}" data-id="${esc(ev.id)}">
        <div class="event-datebox">
          <span class="event-month">${esc(mesLabel)}</span>
          <strong class="event-day">${esc(diaLabel)}</strong>
        </div>
        <div class="event-info">
          <h3 class="event-name">${esc(ev.nome)}</h3>
          <p class="event-set">${esc(ev.conjunto)}</p>
          <div class="event-meta">
            <span class="badge ${urg.statusClass}">${esc(urg.texto || `${MESES[ev.mes - 1]} ${ev.ano}`)}</span>
            <span class="badge">${ev.ano}</span>
            ${podeEditar() ? `
            <button class="btn" type="button" style="margin-left:auto" data-action="editar-evento" data-id="${esc(ev.id)}">Editar</button>
            <button class="btn btn-danger" type="button" data-action="excluir-evento" data-id="${esc(ev.id)}">Excluir</button>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Botão Novo evento (section-head para não conflitar com outros botões)
  const btnNovo = document.querySelector('#tab-eventos .section-head .btn-primary');
  if (btnNovo) {
    btnNovo.style.display = podeEditar() ? '' : 'none';
    if (podeEditar()) btnNovo.onclick = () => abrirModalEvento(null);
  }

  lista.onclick = e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'editar-evento')  abrirModalEvento(id);
    if (action === 'excluir-evento') excluirEvento(id);
  };
}

const MESES_SELECT = MESES.map((m, i) => `<option value="${i+1}">${m}</option>`).join('');

function abrirModalEvento(id) {
  const ev    = id ? db.eventos.find(e => e.id === id) : null;
  const titulo = ev ? 'Editar evento' : 'Novo evento';

  const mesOpts = `<option value="">— sem data definida —</option>` +
    MESES.map((m, i) => `<option value="${i+1}" ${ev?.mes == i+1 ? 'selected' : ''}>${m}</option>`).join('');

  const corpo = `
    <div class="form-group">
      <label class="form-label">Nome do evento</label>
      <input class="form-control" name="nome" type="text" value="${esc(ev?.nome || '')}" required>
    </div>
    <div class="form-group">
      <label class="form-label">Conjunto / Responsável</label>
      <input class="form-control" name="conjunto" type="text" value="${esc(ev?.conjunto || '')}">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Dia (opcional)</label>
        <input class="form-control" name="dia" type="number" min="1" max="31" value="${ev?.dia || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Ano</label>
        <input class="form-control" name="ano" type="number" min="2024" value="${ev?.ano || new Date().getFullYear()}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Mês</label>
      <select class="form-control" name="mes">${mesOpts}</select>
    </div>
  `;

  abrirModal(titulo, corpo, form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.nome.trim()) { alert('Nome é obrigatório.'); return; }

    const novoEv = {
      nome: dados.nome.trim(),
      conjunto: dados.conjunto.trim(),
      dia: dados.dia ? Number(dados.dia) : null,
      mes: dados.mes ? Number(dados.mes) : null,
      ano: Number(dados.ano) || new Date().getFullYear(),
    };

    if (ev) {
      Object.assign(ev, novoEv);
    } else {
      db.eventos.push({ id: crypto.randomUUID(), ...novoEv });
    }
    salvarDados(db);
    fecharModal();
    renderEventos();
  }, {
    mostrarExcluir: !!ev,
    onExcluir: () => excluirEvento(id),
  });
}

function excluirEvento(id) {
  if (!confirm('Excluir este evento?')) return;
  db.eventos = db.eventos.filter(e => e.id !== id);
  salvarDados(db);
  renderEventos();
}

// ─────────────────────────────────────────────
// 11. ABA USUÁRIOS (admin only)
// ─────────────────────────────────────────────

async function renderUsuarios() {
  const lista = document.getElementById('user-list');
  if (!lista) return;

  lista.innerHTML = '<p class="muted" style="padding:12px">Carregando...</p>';

  const { data: usuarios, error } = await window._sb
    .from('usuarios')
    .select('*')
    .order('nome');

  if (error) {
    lista.innerHTML = `<p class="muted" style="padding:12px">Erro ao carregar usuários: ${esc(error.message)}</p>`;
    return;
  }

  if (!usuarios || usuarios.length === 0) {
    lista.innerHTML = '<p class="muted" style="padding:12px">Nenhum usuário cadastrado.</p>';
  } else {
    lista.innerHTML = usuarios.map(u => {
      const isAdmin     = u.papel === 'admin';
      const borderColor = isAdmin ? '#7c6af7' : '#3b82f6';
      const papelClass  = isAdmin ? 'badge-admin' : 'badge-visualizador';

      const contasIds = u.contas_permitidas
        ? u.contas_permitidas.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const contasNomes = contasIds.length
        ? contasIds.map(raw => {
            const conta = db.contas.find(c => c.id === raw);
            if (!conta) return `<span class="badge">ID:${esc(raw)}</span>`;
            return `<span class="badge" style="background:${esc(conta.cor)}22;border-color:${esc(conta.cor)}55;color:${esc(conta.cor)}">${esc(conta.nome)}</span>`;
          }).join(' ')
        : '<span class="muted" style="font-style:italic">Todas as contas</span>';

      return `
        <article class="user-card" data-id="${esc(u.id)}" style="border-left-color:${borderColor}">
          <div class="user-card-top">
            <div>
              <h4 class="user-name">${esc(u.nome)}</h4>
              <p class="user-email">${esc(u.email)}</p>
            </div>
            <span class="badge ${papelClass}">${esc(u.papel)}</span>
          </div>
          <p class="user-contas">${contasNomes}</p>
          <div class="card-actions">
            <button class="btn" type="button" data-action="editar-usuario" data-id="${esc(u.id)}">Editar</button>
            <button class="btn btn-danger" type="button" data-action="excluir-usuario" data-id="${esc(u.id)}">Excluir</button>
          </div>
        </article>
      `;
    }).join('');

    lista.onclick = e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === 'editar-usuario')  abrirModalUsuario(id, usuarios);
      if (action === 'excluir-usuario') excluirUsuario(id);
    };
  }

  const btnNovo = document.getElementById('btn-novo-usuario');
  if (btnNovo) btnNovo.onclick = () => abrirModalUsuario(null, usuarios || []);
}

function abrirModalUsuario(id, usuarios) {
  const usuario = id ? usuarios.find(u => u.id === id) : null;
  const titulo  = usuario ? 'Editar usuário' : 'Adicionar usuário';

  const contasAtuais = usuario?.contas_permitidas
    ? usuario.contas_permitidas.split(',').map(s => s.trim())
    : [];

  const checkboxesContas = db.contas.map(c => `
    <label class="checkbox-label">
      <input type="checkbox" name="conta_${esc(c.id)}" value="${esc(c.id)}"
        ${contasAtuais.includes(c.id) ? 'checked' : ''}>
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${esc(c.cor)};margin-right:4px;flex-shrink:0"></span>
      ${esc(c.nome)}
    </label>
  `).join('');

  const corpo = `
    <div class="form-group">
      <label class="form-label">Nome</label>
      <input class="form-control" name="nome" type="text" value="${esc(usuario?.nome || '')}" required>
    </div>
    <div class="form-group">
      <label class="form-label">E-mail</label>
      <input class="form-control" name="email" type="email" value="${esc(usuario?.email || '')}"
        ${usuario ? 'readonly style="opacity:0.5;cursor:not-allowed"' : ''} required>
    </div>
    <div class="form-group">
      <label class="form-label">Papel</label>
      <select class="form-control" name="papel">
        <option value="visualizador" ${(usuario?.papel ?? 'visualizador') !== 'admin' ? 'selected' : ''}>visualizador</option>
        <option value="admin" ${usuario?.papel === 'admin' ? 'selected' : ''}>admin</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Contas permitidas <span style="color:#6b6b7a;font-weight:400">(nenhuma selecionada = todas)</span></label>
      <div class="checkbox-group">${checkboxesContas}</div>
    </div>
    ${!usuario ? '<p class="form-hint">Um convite será enviado para o e-mail informado após a criação.</p>' : ''}
  `;

  abrirModal(titulo, corpo, async form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.nome.trim())  { alert('Nome é obrigatório.');   return; }
    if (!dados.email.trim()) { alert('E-mail é obrigatório.'); return; }

    const contasSelecionadas = db.contas
      .filter(c => form.querySelector(`[name="conta_${c.id}"]`)?.checked)
      .map(c => c.id)
      .join(',');

    const payload = {
      nome:              dados.nome.trim(),
      email:             dados.email.trim().toLowerCase(),
      papel:             dados.papel,
      contas_permitidas: contasSelecionadas,
    };

    if (usuario) {
      const { error } = await window._sb.from('usuarios').update(payload).eq('id', id);
      if (error) { alert('Erro ao salvar: ' + error.message); return; }
    } else {
      const { error: errInsert } = await window._sb.from('usuarios').insert(payload);
      if (errInsert) { alert('Erro ao criar usuário: ' + errInsert.message); return; }

      // Convite via Supabase Auth (requer service role key configurada no cliente)
      const { error: errInvite } = await window._sb.auth.admin.inviteUserByEmail(payload.email);
      if (errInvite) {
        alert(
          `Usuário criado na tabela, mas o convite por e-mail falhou.\n\n` +
          `Motivo: ${errInvite.message}\n\n` +
          `Dica: invites requerem a service role key do Supabase (não a anon key).`
        );
      }
    }

    fecharModal();
    renderUsuarios();
  }, {
    mostrarExcluir: !!usuario,
    onExcluir:      () => excluirUsuario(id),
    labelSalvar:    usuario ? 'Salvar' : 'Criar e convidar',
  });
}

async function excluirUsuario(id) {
  if (!confirm('Excluir este usuário do painel?\n\nNota: o acesso no Supabase Auth não é removido automaticamente.')) return;
  const { error } = await window._sb.from('usuarios').delete().eq('id', id);
  if (error) { alert('Erro ao excluir: ' + error.message); return; }
  renderUsuarios();
}

// ─────────────────────────────────────────────
// 12. SIDEBAR DE VISUALIZAÇÃO DE POST
// ─────────────────────────────────────────────

function fecharSidebar() {
  const overlay = document.getElementById('sidebar-overlay');
  if (!overlay) return;
  const sb = overlay.querySelector('#post-sidebar');
  if (sb) {
    sb.classList.remove('sb-open');
    setTimeout(() => overlay.remove(), 230);
  } else {
    overlay.remove();
  }
}

function abrirSidebarPost(id) {
  fecharSidebar();

  const post  = db.posts.find(p => p.id === id);
  if (!post) return;
  const conta = getConta(post.contaid);
  const cor   = conta?.cor || '#7c6af7';
  const pc    = profileClass(post.contaid);
  const sc    = statusClass(post.status);

  const parsePipe    = str => (str || '').split('|').map(s => s.trim()).filter(Boolean);
  const parseChecked = str => (str || '').split(',').map(Number).filter(n => !isNaN(n) && n >= 0);

  const checklistItems  = parsePipe(post.checklistgravacao);
  const timelineItems   = parsePipe(post.timelineproducao);
  const chkGravacao     = parseChecked(post.checklistgravacaochecked);
  const chkTimeline     = parseChecked(post.timelineproducaochecked);

  const mkSection = (label, body, open = false) =>
    body ? `
      <details class="sb-section"${open ? ' open' : ''}>
        <summary class="sb-section-title">${label}</summary>
        <div class="sb-section-body">${body}</div>
      </details>` : '';

  const mkChecklist = (items, checked, field, label) =>
    items.length ? `
      <details class="sb-section" open>
        <summary class="sb-section-title">${label}</summary>
        <div class="sb-section-body sb-checklist">
          ${items.map((item, i) => `
            <label class="sb-check-label">
              <input type="checkbox" class="sb-check" ${checked.includes(i) ? 'checked' : ''}
                data-post-id="${esc(id)}" data-field="${field}" data-idx="${i}">
              <span>${esc(item)}</span>
            </label>`).join('')}
        </div>
      </details>` : '';

  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  overlay.innerHTML = `
    <aside id="post-sidebar">
      <div class="sb-header" style="border-left-color:${esc(cor)}">
        <div class="sb-header-top">
          <div class="sb-header-meta">
            <span class="badge ${pc}" style="background:${esc(cor)}22;border-color:${esc(cor)}55;color:${esc(cor)}">${esc(conta?.nome || 'Sem conta')}</span>
            <span class="badge ${sc}">${esc(post.status)}</span>
          </div>
          <div class="sb-header-actions">
            ${post.status === 'ideia' && podeEditar() ? `<button class="btn" id="sb-iniciar-producao" type="button">Iniciar produção</button>` : ''}
            ${podeEditar() ? `<button class="btn btn-primary sb-editar-btn" id="sb-editar">Editar</button>` : ''}
            <button class="icon-button" id="sb-fechar" aria-label="Fechar">×</button>
          </div>
        </div>
        <h2 class="sb-titulo">${esc(post.titulo)}</h2>
        <p class="sb-meta">${esc(capitalize(post.formato))}${post.pilar ? ' · ' + esc(post.pilar) : ''}${post.dataplanejada ? ' · ' + formatarData(post.dataplanejada) : ''}${post.horarioplanejado ? ' às ' + esc(post.horarioplanejado) : ''}</p>
        ${post.responsavel ? `<p class="sb-responsavel">${esc(post.responsavel)}</p>` : ''}
      </div>

      <div class="sb-body">
        ${isAtrasado(post) ? '<div class="sb-aviso-atrasado">⚠ Este post está atrasado</div>' : ''}
        ${post.iniciadoem ? `<p class="sb-info-item">Em produção desde ${esc(formatarData(post.iniciadoem.slice(0,10)))}</p>` : ''}
        ${post.aprovadopor ? `<p class="sb-info-item sb-aprovado">Aprovado por ${esc(post.aprovadopor)} em ${esc(formatarData((post.aprovadoem || '').slice(0,10)))}</p>` : ''}
        ${mkSection('Conceito',
            post.conceito ? `<p class="sb-text">${esc(post.conceito)}</p>` : '', true)}
        ${mkSection('Roteiro',
            post.roteiro ? `<pre class="sb-pre">${esc(post.roteiro)}</pre>` : '')}
        ${mkSection('Direção de Edição',
            post.direcaoedicao ? `<p class="sb-text">${esc(post.direcaoedicao)}</p>` : '')}
        ${mkChecklist(checklistItems, chkGravacao, 'checklistgravacaochecked', 'Checklist de Gravação')}
        ${mkChecklist(timelineItems,  chkTimeline,  'timelineproducaochecked',  'Timeline de Produção')}
        ${mkSection('Legenda e Hashtags', (post.legenda || post.hashtags) ? `
            ${post.legenda  ? `<p class="sb-text sb-legenda">${esc(post.legenda).replace(/\n/g,'<br>')}</p>` : ''}
            ${post.hashtags ? `<p class="sb-hashtags">${esc(post.hashtags)}</p>` : ''}
          ` : '')}
        ${mkSection('Observações',
            post.observacoes ? `<p class="sb-text">${esc(post.observacoes)}</p>` : '')}
        ${post.linkarquivo
            ? mkSection('Arquivo', `<a href="${esc(post.linkarquivo)}" target="_blank" rel="noopener" class="sb-link">Abrir arquivo ↗</a>`)
            : ''}
      </div>
    </aside>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.querySelector('#post-sidebar').classList.add('sb-open');
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) fecharSidebar(); });
  overlay.querySelector('#sb-fechar').addEventListener('click', fecharSidebar);

  if (podeEditar()) {
    overlay.querySelector('#sb-editar')?.addEventListener('click', () => {
      fecharSidebar();
      abrirModalPost(id);
    });

    overlay.querySelector('#sb-iniciar-producao')?.addEventListener('click', async () => {
      const p = db.posts.find(p => p.id === id);
      if (!p || p.status !== 'ideia') return;
      const _conta = getConta(p.contaid);
      const _fluxo = getFluxoStatus(p.formato, _conta?.tipo);
      const _idx   = _fluxo.indexOf('ideia');
      const _next  = _idx !== -1 && _idx < _fluxo.length - 1 ? _fluxo[_idx + 1] : null;
      if (!_next) return;
      p.status     = _next;
      p.iniciadoem = new Date().toISOString();
      salvarDados(db);
      renderCalendario();
      renderListaPosts();
      renderContadoresMes();
      if (window._sb) {
        await _sbEscritaPosts(() => window._sb.schema('public').from('posts')
          .update({ status: p.status, iniciadoem: p.iniciadoem }).eq('id', id));
      }
      fecharSidebar();
      abrirSidebarPost(id);
    });
  }

  // Salva estado dos checkboxes no db
  overlay.addEventListener('change', e => {
    const chk = e.target.closest('.sb-check');
    if (!chk) return;
    const { postId, field, idx } = chk.dataset;
    const p = db.posts.find(p => p.id === postId);
    if (!p) return;
    const arr = parseChecked(p[field]);
    const i   = Number(idx);
    if (chk.checked && !arr.includes(i)) arr.push(i);
    if (!chk.checked) { const pos = arr.indexOf(i); if (pos > -1) arr.splice(pos, 1); }
    arr.sort((a, b) => a - b);
    p[field] = arr.join(',');
    salvarDados(db); // cache imediato
    // Supabase: fire-and-forget (apenas progresso de checklist)
    if (window._sb) {
      _sbEscritaPosts(() => window._sb.schema('public').from('posts').update({ [field]: p[field] }).eq('id', p.id))
        .then(({ error }) => { if (error) console.warn('[Posts] Erro ao salvar checkbox:', error.message); });
    }
  });

  const onKey = e => { if (e.key === 'Escape') { fecharSidebar(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

// ─────────────────────────────────────────────
// 13. CABEÇALHO DINÂMICO
// ─────────────────────────────────────────────

function renderHeader() {
  const pill = document.querySelector('.header-pill');
  if (pill) {
    pill.textContent = `${MESES[new Date().getMonth()]} ${new Date().getFullYear()}`;
  }
}

function mostrarBannerPostsProximos() {
  if (document.getElementById('banner-posts-proximos')) return;

  const hoje = hojeISO();
  const d2 = new Date();
  d2.setDate(d2.getDate() + 2);
  const limiteISO = `${d2.getFullYear()}-${String(d2.getMonth()+1).padStart(2,'0')}-${String(d2.getDate()).padStart(2,'0')}`;

  const idsVisiveis = contasVisiveis().map(c => c.id);
  const proximos = db.posts.filter(p =>
    p.dataplanejada &&
    p.dataplanejada >= hoje &&
    p.dataplanejada <= limiteISO &&
    !['publicado', 'cancelado'].includes(p.status) &&
    idsVisiveis.includes(p.contaid)
  );

  if (proximos.length === 0) return;

  const banner = document.createElement('div');
  banner.id = 'banner-posts-proximos';
  banner.style.cssText = 'background:#f59e0b1a;border-bottom:1px solid #f59e0b44;color:#f59e0b;padding:9px 20px;display:flex;align-items:center;gap:12px;font-size:0.84rem;font-weight:500;cursor:pointer;user-select:none;';
  banner.innerHTML = `
    <span style="flex:1">⚠ ${proximos.length} post(s) publicam nos próximos 2 dias — clique para ver</span>
    <button id="banner-fechar-btn" type="button" style="background:none;border:none;color:#f59e0b;font-size:1.2rem;cursor:pointer;padding:0 4px;line-height:1;opacity:0.75" aria-label="Fechar">×</button>
  `;

  const nav = document.querySelector('nav.tabs');
  if (nav) nav.after(banner);

  banner.addEventListener('click', e => {
    if (e.target.closest('#banner-fechar-btn')) { banner.remove(); return; }
    document.querySelector('[data-target="tab-conteudo"]')?.click();
  });
}

// ─────────────────────────────────────────────
// 14. INICIALIZAÇÃO
// ─────────────────────────────────────────────

function init() {
  // Exibe aba Usuários apenas para admin
  const tabBtnUsuarios = document.getElementById('tab-btn-usuarios');
  if (tabBtnUsuarios) tabBtnUsuarios.style.display = podeEditar() ? '' : 'none';

  iniciarTabs();
  renderHeader();
  renderControle();
  renderConteudo();
  renderSemana();
  renderEquipe();
  renderEventos();
  mostrarBannerPostsProximos();
  if (podeEditar()) renderUsuarios(); // async, fire-and-forget
}

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
