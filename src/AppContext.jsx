import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';

import SheetsService from './services/SheetsService';
import MockService from './services/MockService';
import { useAuth } from './auth/AuthContext';

import * as XLSX from 'xlsx';

const AppContext = createContext(null);

export function AppProvider({ children }) {

  const { usuario } = useAuth();

  const [dados, setDados] = useState({
    movimentacoes: [],
    tecnicos: [],
    produtos: [],
  });

  const [syncStatus, setSyncStatus] = useState('synced');

  // 'synced' | 'carregando' | 'error'

  const autoRefreshRef = useRef(null);

  /* =========================================================
     SERVIÇO ATIVO
  ========================================================= */

  function getService(u) {
    return u?.demo ? MockService : SheetsService;
  }

  /* =========================================================
     CARREGAR DADOS
  ========================================================= */

  const carregarDados = useCallback(async () => {

    const service = getService(usuario);

    if (!service.isConfigured()) {
      return;
    }

    setSyncStatus('carregando');

    try {

      if (!usuario?.demo) SheetsService.clearCache();

      const novos = await service.carregarTodos();

      setDados(novos);

      setSyncStatus('synced');

    } catch (err) {

      console.error(err);

      setSyncStatus('error');
    }

  }, [usuario?.sheetId, usuario?.demo]);

  /* =========================================================
     AUTO REFRESH
  ========================================================= */

  const iniciarAutoRefresh = useCallback(() => {

    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
    }

    autoRefreshRef.current = setInterval(() => {
      carregarDados();
    }, SheetsService.CONFIG.AUTO_REFRESH);

  }, [carregarDados]);

  /* =========================================================
     TROCA DE USUÁRIO / PLANILHA
  ========================================================= */

  useEffect(() => {

    async function atualizarSistema() {

      if (!usuario) {

        setDados({
          movimentacoes: [],
          tecnicos: [],
          produtos: [],
        });

        if (autoRefreshRef.current) {
          clearInterval(autoRefreshRef.current);
        }

        return;
      }

      const service = getService(usuario);

      try {

        if (!usuario.demo) SheetsService.clearCache();

        setDados({
          movimentacoes: [],
          tecnicos: [],
          produtos: [],
        });

        const novosDados = await service.carregarTodos();

        setDados(novosDados);

        setSyncStatus('synced');

        if (autoRefreshRef.current) {
          clearInterval(autoRefreshRef.current);
        }

        autoRefreshRef.current = setInterval(() => {
          carregarDados();
        }, SheetsService.CONFIG.AUTO_REFRESH);

      } catch (err) {

        console.error(err);

        setSyncStatus('error');
      }
    }

    atualizarSistema();

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };

  }, [usuario?.sheetId, usuario?.demo]);

  /* =========================================================
     EXPORTAR EXCEL
  ========================================================= */

  const exportarExcel = useCallback(() => {

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(dados.movimentacoes),
      'Movimentações'
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(dados.tecnicos),
      'Técnicos'
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(dados.produtos),
      'Produtos'
    );

    XLSX.writeFile(
      wb,
      `Almoxarifado_${new Date().toISOString().split('T')[0]}.xlsx`
    );

  }, [dados]);

  /* =========================================================
     RELATÓRIOS
  ========================================================= */

  const gerarRelatorio = useCallback((tipo) => {

    const wb = XLSX.utils.book_new();

    if (tipo === 'tecnicos') {

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(dados.tecnicos),
        'Técnicos'
      );

      XLSX.writeFile(wb, 'Relatorio_Tecnicos.xlsx');

    }

    else if (tipo === 'produtos') {

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(dados.produtos),
        'Produtos'
      );

      XLSX.writeFile(wb, 'Relatorio_Produtos.xlsx');

    }

    else if (tipo === 'estoque') {

      const criticos = dados.produtos.filter(p =>
        (parseInt(p['ESTOQUE ATUAL']) || 0) <=
        (parseInt(p['ESTOQUE MÍNIMO']) || 0) * 2
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(criticos),
        'Estoque Crítico'
      );

      XLSX.writeFile(wb, 'Relatorio_Estoque.xlsx');

    }

    else if (tipo === 'mensal') {

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(dados.movimentacoes),
        'Movimentações'
      );

      XLSX.writeFile(wb, 'Relatorio_Mensal.xlsx');
    }

  }, [dados]);

  /* =========================================================
     PROVIDER
  ========================================================= */

  const activeService = getService(usuario);

  return (

    <AppContext.Provider
      value={{

        dados,

        syncStatus,

        carregarDados,

        iniciarAutoRefresh,

        exportarExcel,

        gerarRelatorio,

        SheetsService: activeService,
      }}
    >

      {children}

    </AppContext.Provider>
  );
}

export function useApp() {

  return useContext(AppContext);
}
