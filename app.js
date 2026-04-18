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

// Estado global da aplicação
let db = carregarDados();

// ─────────────────────────────────────────────
// 2. ESTADO DE UI
// ─────────────────────────────────────────────

const ui = {
  filtroContaId: null,    // null = Todos
  calMes: new Date().getMonth() + 1,
  calAno: new Date().getFullYear(),
  filtroStatusPost: 'todos',
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

function profileClass(contaId) {
  const idx = db.contas.findIndex(c => c.id === contaId);
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
  renderContas();
}

function renderContadores() {
  const ativas   = db.contas.filter(c => c.status === 'ativo' || c.status === 'instável').length;
  const travadas = db.contas.filter(c => c.status === 'travado').length;
  const preinicio = db.contas.filter(c => c.status === 'estruturado' || c.status === 'aguardando').length;

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

  lista.innerHTML = db.contas.map(conta => {
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
        <div class="card-actions">
          <button class="btn" type="button" data-action="editar-conta" data-id="${esc(conta.id)}">Editar</button>
          <button class="btn btn-danger" type="button" data-action="excluir-conta" data-id="${esc(conta.id)}">Excluir</button>
        </div>
      </article>
    `;
  }).join('');

  // Botão Nova Conta (apenas no section-head, não nos cards)
  const btnNova = document.querySelector('#tab-controle .section-head .btn-primary');
  if (btnNova) {
    btnNova.onclick = () => abrirModalConta(null);
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
}

/** Botão "Novo post" */
function vincularBotaoNovoPost() {
  const btn = document.querySelector('#tab-conteudo .section-head .btn-primary');
  if (btn) btn.onclick = () => abrirModalPost(null);
}

// ── 7.1 Filtros de perfil ──

function renderFiltrosConteudo() {
  const filtros = document.querySelector('#tab-conteudo .filters');
  if (!filtros) return;

  filtros.innerHTML = `
    <button class="filter-chip ${ui.filtroContaId === null ? 'active' : ''}" type="button" data-conta="todos">Todos</button>
    ${db.contas.map(c => `
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

/** Posts do mês atual, filtrados por conta se necessário */
function postsDoMes() {
  return db.posts.filter(p => {
    if (!p.dataplanejada) return false;
    const [a, m] = p.dataplanejada.split('-').map(Number);
    if (a !== ui.calAno || m !== ui.calMes) return false;
    if (ui.filtroContaId && p.contaId !== ui.filtroContaId) return false;
    return true;
  });
}

// ── 7.4 Calendário visual ──

function renderCalendario() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const hoje = new Date();
  const primeiroDia = new Date(ui.calAno, ui.calMes - 1, 1).getDay(); // 0=Dom
  const totalDias   = new Date(ui.calAno, ui.calMes, 0).getDate();

  // Posts do mês agrupados por dia
  const postsPorDia = {};
  postsDoMes().forEach(p => {
    const dia = Number(p.dataplanejada.split('-')[2]);
    if (!postsPorDia[dia]) postsPorDia[dia] = [];
    postsPorDia[dia].push(p);
  });

  let html = '';

  // Dias do mês anterior (esmaecidos)
  const diasAnterior = new Date(ui.calAno, ui.calMes - 1, 0).getDate();
  for (let i = primeiroDia - 1; i >= 0; i--) {
    html += `<div class="calendar-day is-muted"><span class="calendar-day-number">${diasAnterior - i}</span></div>`;
  }

  // Dias do mês atual
  for (let dia = 1; dia <= totalDias; dia++) {
    const eHoje = hoje.getDate() === dia && hoje.getMonth() + 1 === ui.calMes && hoje.getFullYear() === ui.calAno;
    const dataISO = `${ui.calAno}-${String(ui.calMes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    const chips = (postsPorDia[dia] || []).map(p => {
      const conta = getConta(p.contaId);
      const bgColor = conta ? conta.cor : '#7c6af7';
      const titulo  = p.titulo.length > 22 ? p.titulo.slice(0, 20) + '…' : p.titulo;
      return `<span class="post-chip" data-post-id="${esc(p.id)}" style="background:${esc(bgColor)}cc" title="${esc(p.titulo)}">${esc(titulo)}</span>`;
    }).join('');

    html += `
      <div class="calendar-day${eHoje ? ' is-today' : ''}" data-date="${esc(dataISO)}">
        <span class="calendar-day-number">${dia}</span>
        ${chips}
      </div>
    `;
  }

  // Preencher resto da grade (6 semanas = 42 células no máximo)
  const totalCelulas = primeiroDia + totalDias;
  const sobras = totalCelulas % 7 === 0 ? 0 : 7 - (totalCelulas % 7);
  for (let i = 1; i <= sobras; i++) {
    html += `<div class="calendar-day is-muted"><span class="calendar-day-number">${i}</span></div>`;
  }

  grid.innerHTML = html;

  // Evento de clique nos chips e dias (onclick substitui anterior)
  grid.onclick = e => {
    const chip = e.target.closest('.post-chip');
    if (chip) {
      e.stopPropagation();
      abrirModalPost(chip.dataset.postId);
      return;
    }
    const cell = e.target.closest('.calendar-day:not(.is-muted)');
    if (cell && cell.dataset.date) {
      abrirModalPost(null, cell.dataset.date);
    }
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
    const conta = getConta(p.contaId);
    const pc    = profileClass(p.contaId);
    const sc    = statusClass(p.status);
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
          </div>
          <h3 class="post-title">${esc(p.titulo)}</h3>
          <p class="post-meta">${esc(capitalize(p.formato))} · ${esc(p.pilar)} · ${formatarData(p.dataplanejada)}${p.horarioplanejado ? ' às ' + esc(p.horarioplanejado) : ''}</p>
        </div>
        <div class="post-details">
          ${p.responsavel ? `<span class="badge">${esc(p.responsavel)}</span>` : ''}
          <button class="btn" type="button" data-action="editar-post" data-id="${esc(p.id)}">Editar</button>
        </div>
      </article>
    `;
  }).join('');

  lista.onclick = e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'editar-post')     abrirModalPost(id);
    if (action === 'avancar-status')  avancarStatusPost(id);
  };
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

const FLUXO_STATUS = ['rascunho', 'em aprovação', 'aprovado', 'agendado', 'publicado'];

function avancarStatusPost(id) {
  const post = db.posts.find(p => p.id === id);
  if (!post) return;
  if (post.status === 'cancelado') return; // cancelado só via modal
  if (post.status === 'publicado') return; // já no fim do fluxo

  const idx = FLUXO_STATUS.indexOf(post.status);
  if (idx < FLUXO_STATUS.length - 1) {
    post.status = FLUXO_STATUS[idx + 1];
    salvarDados(db);
    renderCalendario();
    renderListaPosts();
    renderContadoresMes();
  }
}

function statusClass(status) {
  const map = {
    'rascunho':      'status-rascunho',
    'em aprovação':  'status-em-aprovacao',
    'aprovado':      'status-aprovado',
    'agendado':      'status-agendado',
    'publicado':     'status-publicado',
    'cancelado':     'status-cancelado',
  };
  return map[status] || 'status-rascunho';
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ── 7.7 Modal de post ──

const FORMATOS = ['feed', 'carrossel', 'reels', 'stories', 'outro'];
const PILARES  = ['vida da igreja', 'ensino', 'evangelização', 'comunhão', 'diagnóstico', 'bastidor', 'portfólio', 'oferta', 'outro'];
const STATUS_POST = ['rascunho', 'em aprovação', 'aprovado', 'agendado', 'publicado', 'cancelado'];

function abrirModalPost(id, dataPreenchida) {
  const post  = id ? db.posts.find(p => p.id === id) : null;
  const titulo = post ? 'Editar post' : 'Novo post';

  const contasOpts = db.contas.map(c =>
    `<option value="${esc(c.id)}" ${post?.contaId === c.id ? 'selected' : ''}>${esc(c.nome)}</option>`
  ).join('');

  const formatoOpts = FORMATOS.map(f =>
    `<option value="${f}" ${post?.formato === f ? 'selected' : ''}>${capitalize(f)}</option>`
  ).join('');

  const pilarOpts = PILARES.map(p =>
    `<option value="${p}" ${post?.pilar === p ? 'selected' : ''}>${capitalize(p)}</option>`
  ).join('');

  const statusOpts = STATUS_POST.map(s =>
    `<option value="${s}" ${post?.status === s ? 'selected' : ''}>${capitalize(s)}</option>`
  ).join('');

  const dataVal = post?.dataplanejada || dataPreenchida || '';

  const corpo = `
    <div class="form-group">
      <label class="form-label">Perfil</label>
      <select class="form-control" name="contaId">${contasOpts}</select>
    </div>
    <div class="form-group">
      <label class="form-label">Título</label>
      <input class="form-control" name="titulo" type="text" value="${esc(post?.titulo || '')}" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Formato</label>
        <select class="form-control" name="formato">${formatoOpts}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Pilar editorial</label>
        <select class="form-control" name="pilar">${pilarOpts}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Data planejada</label>
        <input class="form-control" name="dataplanejada" type="date" value="${esc(dataVal)}">
      </div>
      <div class="form-group">
        <label class="form-label">Horário</label>
        <input class="form-control" name="horarioplanejado" type="time" value="${esc(post?.horarioplanejado || '')}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <select class="form-control" name="status">${statusOpts}</select>
    </div>
    <div class="form-group">
      <label class="form-label">Responsável</label>
      <input class="form-control" name="responsavel" type="text" value="${esc(post?.responsavel || '')}">
    </div>
    <div class="form-group">
      <label class="form-label">Legenda</label>
      <textarea class="form-control" name="legenda">${esc(post?.legenda || '')}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Observações</label>
      <textarea class="form-control" name="observacoes">${esc(post?.observacoes || '')}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Link do arquivo</label>
      <input class="form-control" name="linkArquivo" type="url" value="${esc(post?.linkArquivo || '')}">
    </div>
  `;

  abrirModal(titulo, corpo, form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.titulo.trim()) { alert('Título é obrigatório.'); return; }

    if (post) {
      Object.assign(post, dados);
    } else {
      db.posts.push({
        id: crypto.randomUUID(),
        contaId: dados.contaId,
        titulo: dados.titulo.trim(),
        formato: dados.formato,
        pilar: dados.pilar,
        dataplanejada: dados.dataplanejada,
        horarioplanejado: dados.horarioplanejado,
        legenda: dados.legenda,
        observacoes: dados.observacoes,
        responsavel: dados.responsavel.trim(),
        status: dados.status || 'rascunho',
        linkArquivo: dados.linkArquivo,
      });
    }
    salvarDados(db);
    fecharModal();
    renderCalendario();
    renderListaPosts();
    renderContadoresMes();
  }, {
    mostrarExcluir: !!post,
    onExcluir: () => {
      db.posts = db.posts.filter(p => p.id !== id);
      salvarDados(db);
      renderCalendario();
      renderListaPosts();
      renderContadoresMes();
    },
  });
}

// ─────────────────────────────────────────────
// 8. ABA ESTA SEMANA
// ─────────────────────────────────────────────

const DOMINIOS = ['REUNIÃO', 'EQUIPE', 'CONTEÚDO', 'CULTO', 'OUTRO'];

function renderSemana() {
  const container = document.getElementById('week-tasks');
  if (!container) return;

  // Agrupar tarefas por domínio
  const grupos = {};
  DOMINIOS.forEach(d => { grupos[d] = []; });
  db.tarefas.forEach(t => {
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
              <span class="badge ${domClass}">${esc(t.dominio)}</span>
            </div>
            <button class="icon-button" type="button" aria-label="Excluir tarefa"
              data-action="excluir-tarefa" data-id="${esc(t.id)}">×</button>
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

  if (btnNova)    btnNova.onclick    = () => abrirModalTarefa(null);
  if (btnNovaSeq) btnNovaSeq.onclick = () => novaSemana();
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
  if (t) {
    t.concluida = !t.concluida;
    salvarDados(db);
    renderSemana();
  }
}

function excluirTarefa(id) {
  if (!confirm('Excluir esta tarefa?')) return;
  db.tarefas = db.tarefas.filter(t => t.id !== id);
  salvarDados(db);
  renderSemana();
}

function novaSemana() {
  const concluidas = db.tarefas.filter(t => t.concluida).length;
  if (concluidas === 0) { alert('Nenhuma tarefa concluída para remover.'); return; }
  if (!confirm(`Remover ${concluidas} tarefa(s) concluída(s) e iniciar nova semana?`)) return;
  db.tarefas = db.tarefas.filter(t => !t.concluida);
  salvarDados(db);
  renderSemana();
}

function abrirModalTarefa(id) {
  const tarefa = id ? db.tarefas.find(t => t.id === id) : null;
  const titulo = tarefa ? 'Editar tarefa' : 'Nova tarefa';

  const domOpts = DOMINIOS.map(d =>
    `<option value="${d}" ${tarefa?.dominio === d ? 'selected' : ''}>${d}</option>`
  ).join('');

  const corpo = `
    <div class="form-group">
      <label class="form-label">Título</label>
      <input class="form-control" name="titulo" type="text" value="${esc(tarefa?.titulo || '')}" required>
    </div>
    <div class="form-group">
      <label class="form-label">Domínio</label>
      <select class="form-control" name="dominio">${domOpts}</select>
    </div>
  `;

  abrirModal(titulo, corpo, form => {
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.titulo.trim()) { alert('Título é obrigatório.'); return; }

    if (tarefa) {
      Object.assign(tarefa, { titulo: dados.titulo.trim(), dominio: dados.dominio });
    } else {
      db.tarefas.push({
        id: crypto.randomUUID(),
        titulo: dados.titulo.trim(),
        dominio: dados.dominio,
        concluida: false,
      });
    }
    salvarDados(db);
    fecharModal();
    renderSemana();
  }, {
    mostrarExcluir: !!tarefa,
    onExcluir: () => { excluirTarefa(id); },
  });
}

// ─────────────────────────────────────────────
// 9. ABA EQUIPE
// ─────────────────────────────────────────────

const STATUS_EQUIPE = ['ativo', 'parcial', 'eventual', 'confirmar', 'limitado', 'afastado'];

// Agrupamento de status para exibição
const GRUPOS_EQUIPE = [
  { titulo: 'Ativos',               statuses: ['ativo'] },
  { titulo: 'Parcial-Eventual',     statuses: ['parcial', 'eventual'] },
  { titulo: 'A Confirmar',          statuses: ['confirmar'] },
  { titulo: 'Temporariamente Fora', statuses: ['limitado', 'afastado'] },
];

function renderEquipe() {
  renderContadoresEquipe();
  renderPessoas();
  renderLacunas();

  // Seletores com .section-head para não pegar botões dos cards renderizados
  const btnPessoa = document.querySelector('#tab-equipe .section-head .btn-primary');
  const btnLacuna = document.querySelector('#tab-equipe .section-head .btn:not(.btn-primary)');
  if (btnPessoa) btnPessoa.onclick = () => abrirModalPessoa(null);
  if (btnLacuna) btnLacuna.onclick = () => abrirModalLacuna(null);
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
                      <p class="person-role">${esc(p.funcao)}</p>
                    </div>
                    <span class="badge ${sc} clickable" data-action="status-pessoa" data-id="${esc(p.id)}">${esc(p.status)}</span>
                  </div>
                  <div class="person-actions">
                    <button class="btn" type="button" data-action="editar-pessoa" data-id="${esc(p.id)}">Editar</button>
                    <button class="btn btn-danger" type="button" data-action="excluir-pessoa" data-id="${esc(p.id)}">Excluir</button>
                  </div>
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
      <label class="form-label">Função / Habilidades</label>
      <textarea class="form-control" name="funcao">${esc(pessoa?.funcao || '')}</textarea>
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
      Object.assign(pessoa, { nome: dados.nome.trim(), iniciais, funcao: dados.funcao.trim(), status: dados.status });
    } else {
      db.equipe.push({
        id: crypto.randomUUID(),
        nome: dados.nome.trim(),
        iniciais,
        funcao: dados.funcao.trim(),
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
        <div class="card-actions">
          <button class="btn" type="button" data-action="editar-lacuna" data-id="${esc(l.id)}">Editar</button>
          <button class="btn btn-danger" type="button" data-action="excluir-lacuna" data-id="${esc(l.id)}">Excluir</button>
        </div>
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

  lista.innerHTML = db.eventos.map(ev => {
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
            <button class="btn" type="button" style="margin-left:auto" data-action="editar-evento" data-id="${esc(ev.id)}">Editar</button>
            <button class="btn btn-danger" type="button" data-action="excluir-evento" data-id="${esc(ev.id)}">Excluir</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Botão Novo evento (section-head para não conflitar com outros botões)
  const btnNovo = document.querySelector('#tab-eventos .section-head .btn-primary');
  if (btnNovo) btnNovo.onclick = () => abrirModalEvento(null);

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
// 11. CABEÇALHO DINÂMICO
// ─────────────────────────────────────────────

function renderHeader() {
  const pill = document.querySelector('.header-pill');
  if (pill) {
    pill.textContent = `${MESES[new Date().getMonth()]} ${new Date().getFullYear()}`;
  }
}

// ─────────────────────────────────────────────
// 12. INICIALIZAÇÃO
// ─────────────────────────────────────────────

function init() {
  iniciarTabs();
  renderHeader();
  renderControle();
  renderConteudo();
  renderSemana();
  renderEquipe();
  renderEventos();
}

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
