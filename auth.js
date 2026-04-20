/* ============================================================
   auth.js — Autenticação Supabase + controle de permissões
   ============================================================ */

'use strict';

const SUPABASE_URL = 'https://syqskrpjzceocmjlirnp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UfBv2kDEDPSaJLu_Cn7swg_x8lPwcH4';

const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'public' },
  auth: { persistSession: true, autoRefreshToken: true },
  global: { headers: { 'Prefer': 'return=minimal', 'apikey': SUPABASE_KEY } },
});
window._sb = _sb; // expõe para app.js
window._sbKey = SUPABASE_KEY; // expõe para chamadas fetch autenticadas

// Estado global de permissões — lido pelo app.js em cada renderização
window.USUARIO = { papel: 'visualizador', contasPermitidas: [] };

// ── Permissões ────────────────────────────────────────────────

async function carregarPermissoes(email) {
  // Normaliza para minúsculas para evitar falha por diferença de caixa
  const emailNorm = (email || '').trim().toLowerCase();
  console.log('[Auth] carregarPermissoes →', emailNorm);

  const { data, error } = await _sb
    .from('usuarios')
    .select('papel, contas_permitidas')
    .eq('email', emailNorm)
    .maybeSingle();

  console.log('[Auth] resultado da query →', { data, error });

  if (error) {
    console.error('[Auth] Erro na query de usuários:', error.message);
    window.USUARIO = { papel: 'visualizador', contasPermitidas: [] };
    return;
  }

  if (!data) {
    console.warn('[Auth] Email não encontrado na tabela usuarios — papel padrão: visualizador');
    window.USUARIO = { papel: 'visualizador', contasPermitidas: [] };
    return;
  }

  const contasPermitidas = data.contas_permitidas
    ? data.contas_permitidas.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  window.USUARIO = { papel: data.papel || 'visualizador', contasPermitidas };
  console.log('[Auth] USUARIO carregado →', window.USUARIO);
}

// ── Visibilidade ──────────────────────────────────────────────

function mostrarLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-shell').style.display    = 'none';
}

function mostrarApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-shell').style.display    = 'block';
}

// ── Inicialização ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {

  // Verifica sessão persistida
  const { data: { session } } = await _sb.auth.getSession();

  if (session) {
    await carregarPermissoes(session.user.email);
    if (typeof carregarPostsSupabase === 'function') await carregarPostsSupabase();
    if (typeof init === 'function') init();
    mostrarApp();
  } else {
    mostrarLogin();
  }

  // ── Login ─────────────────────────────────────────────────

  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;
    const errEl = document.getElementById('login-erro');
    const btn   = document.getElementById('login-btn');

    errEl.textContent = '';
    btn.disabled      = true;
    btn.textContent   = 'Entrando…';

    const { data, error } = await _sb.auth.signInWithPassword({ email, password: senha });

    if (error) {
      errEl.textContent = 'E-mail ou senha inválidos.';
      btn.disabled      = false;
      btn.textContent   = 'Entrar';
    } else {
      await carregarPermissoes(data.user.email);
      if (typeof carregarPostsSupabase === 'function') await carregarPostsSupabase();
      if (typeof init === 'function') init();
      mostrarApp();
    }
  });

  // ── Logout ───────────────────────────────────────────────

  document.getElementById('btn-logout').addEventListener('click', async () => {
    await _sb.auth.signOut();
    window.USUARIO = { papel: 'visualizador', contasPermitidas: [] };
    mostrarLogin();
  });

});

// Reage a expiração/renovação de token (não re-renderiza, só controla visibilidade)
_sb.auth.onAuthStateChange((_event, session) => {
  if (!session) {
    window.USUARIO = { papel: 'visualizador', contasPermitidas: [] };
    mostrarLogin();
  }
});
