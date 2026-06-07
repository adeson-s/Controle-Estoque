// src/auth/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const MASTER_SHEET_ID = import.meta.env.VITE_MASTER_SHEET_ID || '';

/* =========================================================
   FILIAIS
========================================================= */

export const CIDADES = {

  CENTRO: {
    label: 'Filial Centro',
    sheetId: import.meta.env.VITE_SHEET_CENTRO || '',
  },

  NORTE: {
    label: 'Filial Norte',
    sheetId: import.meta.env.VITE_SHEET_NORTE || '',
  },

  SUL: {
    label: 'Filial Sul',
    sheetId: import.meta.env.VITE_SHEET_SUL || '',
  },

  LESTE: {
    label: 'Filial Leste',
    sheetId: import.meta.env.VITE_SHEET_LESTE || '',
  },
};

/* =========================================================
   USUÁRIO DEMO
========================================================= */

const DEMO_USER = {
  username: 'demo',
  name: 'Admin Demo',
  role: 'gerente',
  estoquesPermitidos: ['CENTRO', 'NORTE', 'SUL', 'LESTE'],
  estoqueAtual: 'CENTRO',
  sheetId: 'demo',
  global: true,
  demo: true,
};

/* =========================================================
   PERMISSÕES
========================================================= */

export const PERMISSOES = {

  gerente: {
    verDashboard: true,
    verMovimentacoes: true,
    verProdutos: true,
    editarProdutos: true,
    excluirProdutos: true,
    criarProdutos: true,
    novaReposicao: true,
    verTecnicos: true,
    editarTecnicos: true,
    transferencia: true,
    conferencia: true,
    verRelatorios: true,
    exportarDados: true,
    gerenciarUsuarios: true,
  },

  supervisor: {
    verDashboard: true,
    verMovimentacoes: true,
    verProdutos: true,
    editarProdutos: true,
    excluirProdutos: false,
    criarProdutos: true,
    novaReposicao: true,
    verTecnicos: true,
    editarTecnicos: true,
    transferencia: true,
    conferencia: true,
    verRelatorios: true,
    exportarDados: true,
    gerenciarUsuarios: false,
  },

  auxiliar: {
    verDashboard: true,
    verMovimentacoes: true,
    verProdutos: true,
    editarProdutos: false,
    excluirProdutos: false,
    criarProdutos: false,
    novaReposicao: true,
    verTecnicos: true,
    editarTecnicos: false,
    transferencia: true,
    conferencia: true,
    verRelatorios: true,
    exportarDados: false,
    gerenciarUsuarios: false,
  },
};

/* =========================================================
   SESSION
========================================================= */

const SESSION_KEY = 'almox_auth_session';

const SESSION_HOURS = Number(import.meta.env.VITE_SESSION_HOURS) || 8;

/* =========================================================
   HELPERS
========================================================= */

function lerSessaoSincrona() {
  try {

    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) return null;

    const sessao = JSON.parse(raw);

    if (Date.now() > sessao.expiraEm) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return sessao.usuario || null;

  } catch (_) {

    localStorage.removeItem(SESSION_KEY);

    return null;
  }
}

function salvarSessao(usuario) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      usuario,
      expiraEm: Date.now() + SESSION_HOURS * 3600 * 1000,
      loginEm: Date.now(),
    })
  );
}

/* =========================================================
   BUSCAR USUÁRIO (Google Sheets)
========================================================= */

async function buscarUsuario(username, password) {

  if (!API_KEY || !MASTER_SHEET_ID) return null;

  try {

    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${MASTER_SHEET_ID}/values/USUARIOS?key=${API_KEY}&t=${Date.now()}`;

    const res = await fetch(url);

    if (!res.ok) return null;

    const data = await res.json();

    const valores = data.values || [];

    if (valores.length === 0) return null;

    const headers =
      valores[0].map(h => String(h).toUpperCase().trim());

    const usuarios =
      valores.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = String(row[i] ?? '').trim();
        });
        return obj;
      });

    const found = usuarios.find(u =>
      u.USERNAME?.toLowerCase() === username.toLowerCase()
      && String(u.PASSWORD) === String(password)
      && u.ATIVO !== 'NAO'
    );

    if (!found) return null;

    let estoquesPermitidos = [];

    if (found.ESTOQUES === '*') {
      estoquesPermitidos = Object.keys(CIDADES);
    } else {
      estoquesPermitidos =
        String(found.ESTOQUES || '')
          .split(',')
          .map(v => v.trim())
          .filter(Boolean);
    }

    const estoqueAtual = estoquesPermitidos[0] || null;

    const sheetId =
      estoqueAtual ? CIDADES[estoqueAtual]?.sheetId : null;

    return {
      username: found.USERNAME,
      name: found.NAME,
      role: (found.ROLE || 'auxiliar').toLowerCase(),
      estoquesPermitidos,
      estoqueAtual,
      sheetId,
      global: found.ESTOQUES === '*',
      demo: false,
    };

  } catch (_) {

    return null;
  }
}

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext = createContext(null);

/* =========================================================
   PROVIDER
========================================================= */

export function AuthProvider({ children }) {

  const [usuario, setUsuario] =
    useState(() => lerSessaoSincrona());

  const [carregando, setCarregando] =
    useState(false);

  /* =====================================================
     RENOVAR SESSÃO
  ===================================================== */

  useEffect(() => {

    if (!usuario) return;

    const renovar = () => {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          s.expiraEm = Date.now() + SESSION_HOURS * 3600 * 1000;
          localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        }
      } catch (_) {}
    };

    window.addEventListener('click', renovar);
    window.addEventListener('keydown', renovar);

    return () => {
      window.removeEventListener('click', renovar);
      window.removeEventListener('keydown', renovar);
    };

  }, [usuario]);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = useCallback(async (username, password) => {

    setCarregando(true);

    try {

      // Modo demo
      if (username.trim().toLowerCase() === 'demo' && password === 'demo123') {
        salvarSessao(DEMO_USER);
        setUsuario(DEMO_USER);
        return { ok: true };
      }

      // Google Sheets
      const found = await buscarUsuario(username.trim(), password);

      if (!found) {
        return {
          ok: false,
          erro: 'Usuário ou senha incorretos.',
        };
      }

      salvarSessao(found);
      setUsuario(found);

      return { ok: true };

    } catch (_) {

      return {
        ok: false,
        erro: 'Erro de conexão.',
      };

    } finally {

      setCarregando(false);
    }

  }, []);

  /* =====================================================
     TROCAR ESTOQUE
  ===================================================== */

  const trocarEstoque = useCallback((novo) => {

    if (!usuario) return;

    if (!usuario.estoquesPermitidos.includes(novo)) return;

    const atualizado = {
      ...usuario,
      estoqueAtual: novo,
      sheetId: usuario.demo ? 'demo' : (CIDADES[novo]?.sheetId || null),
    };

    setUsuario(atualizado);

    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const sessao = JSON.parse(raw);
        sessao.usuario = atualizado;
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessao));
      }
    } catch (_) {}

  }, [usuario]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  }, []);

  /* =====================================================
     PERMISSÃO
  ===================================================== */

  const pode = useCallback((permissao) => {
    if (!usuario) return false;
    return PERMISSOES[usuario.role]?.[permissao] ?? false;
  }, [usuario]);

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        logout,
        pode,
        trocarEstoque,
        cidades: CIDADES,
        isGerente: usuario?.role === 'gerente',
        isSupervisor: usuario?.role === 'supervisor',
        isAuxiliar: usuario?.role === 'auxiliar',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth deve ser usado dentro de <AuthProvider>'
    );
  }

  return ctx;
}
