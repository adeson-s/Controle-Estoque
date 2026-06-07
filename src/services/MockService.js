// Serviço de dados de demonstração (sem dependência de Google Sheets)

const CONFIG = {
  SHEETS: {
    MOVIMENTACOES: 'MOVIMENTACOES',
    TECNICOS: 'CADASTRO_TECNICOS',
    PRODUTOS: 'CADASTRO_PRODUTOS',
  },
  AUTO_REFRESH: 30000,
  sheetId: 'demo',
  apiKey: '',
};

/* =========================================================
   DADOS BASE
========================================================= */

const PRODUTOS_BASE = [
  { PRODUTO: 'Cabo UTP Cat6', UNIDADE: 'm', 'ESTOQUE ATUAL': '350', 'ESTOQUE MÍNIMO': '100', QR_CODE: 'PRD-001' },
  { PRODUTO: 'Conector RJ45 Cat6', UNIDADE: 'un', 'ESTOQUE ATUAL': '200', 'ESTOQUE MÍNIMO': '50', QR_CODE: 'PRD-002' },
  { PRODUTO: 'Switch 24 Portas', UNIDADE: 'un', 'ESTOQUE ATUAL': '5', 'ESTOQUE MÍNIMO': '3', QR_CODE: 'PRD-003' },
  { PRODUTO: 'Roteador WiFi', UNIDADE: 'un', 'ESTOQUE ATUAL': '12', 'ESTOQUE MÍNIMO': '15', QR_CODE: 'PRD-004' },
  { PRODUTO: 'Patch Cord 1m Cat6', UNIDADE: 'un', 'ESTOQUE ATUAL': '80', 'ESTOQUE MÍNIMO': '25', QR_CODE: 'PRD-005' },
  { PRODUTO: 'Patch Cord 3m Cat6', UNIDADE: 'un', 'ESTOQUE ATUAL': '60', 'ESTOQUE MÍNIMO': '20', QR_CODE: 'PRD-006' },
  { PRODUTO: 'Caixa de Passagem 4x4', UNIDADE: 'un', 'ESTOQUE ATUAL': '45', 'ESTOQUE MÍNIMO': '15', QR_CODE: 'PRD-007' },
  { PRODUTO: 'Abraçadeira Nylon 200mm', UNIDADE: 'un', 'ESTOQUE ATUAL': '500', 'ESTOQUE MÍNIMO': '150', QR_CODE: 'PRD-008' },
  { PRODUTO: 'Parafuso M6x20', UNIDADE: 'un', 'ESTOQUE ATUAL': '800', 'ESTOQUE MÍNIMO': '250', QR_CODE: 'PRD-009' },
  { PRODUTO: 'Fita Isolante', UNIDADE: 'rl', 'ESTOQUE ATUAL': '30', 'ESTOQUE MÍNIMO': '10', QR_CODE: 'PRD-010' },
  { PRODUTO: 'Testador de Cabo RJ45', UNIDADE: 'un', 'ESTOQUE ATUAL': '3', 'ESTOQUE MÍNIMO': '2', QR_CODE: 'PRD-011' },
  { PRODUTO: 'Organizador de Cabos 1U', UNIDADE: 'un', 'ESTOQUE ATUAL': '12', 'ESTOQUE MÍNIMO': '5', QR_CODE: 'PRD-012' },
  { PRODUTO: 'Rack de Parede 12U', UNIDADE: 'un', 'ESTOQUE ATUAL': '3', 'ESTOQUE MÍNIMO': '2', QR_CODE: 'PRD-013' },
  { PRODUTO: 'Patch Panel 24 Portas', UNIDADE: 'un', 'ESTOQUE ATUAL': '5', 'ESTOQUE MÍNIMO': '3', QR_CODE: 'PRD-014' },
  { PRODUTO: 'No-break 600VA', UNIDADE: 'un', 'ESTOQUE ATUAL': '7', 'ESTOQUE MÍNIMO': '2', QR_CODE: 'PRD-015' },
  { PRODUTO: 'Eletroduto PVC 3/4"', UNIDADE: 'm', 'ESTOQUE ATUAL': '200', 'ESTOQUE MÍNIMO': '60', QR_CODE: 'PRD-016' },
  { PRODUTO: 'Luva para Eletroduto 3/4"', UNIDADE: 'un', 'ESTOQUE ATUAL': '100', 'ESTOQUE MÍNIMO': '30', QR_CODE: 'PRD-017' },
  { PRODUTO: 'Tampa de Caixa 4x4', UNIDADE: 'un', 'ESTOQUE ATUAL': '60', 'ESTOQUE MÍNIMO': '20', QR_CODE: 'PRD-018' },
  { PRODUTO: 'Etiqueta de Identificação', UNIDADE: 'un', 'ESTOQUE ATUAL': '300', 'ESTOQUE MÍNIMO': '100', QR_CODE: 'PRD-019' },
  { PRODUTO: 'Multímetro Digital', UNIDADE: 'un', 'ESTOQUE ATUAL': '1', 'ESTOQUE MÍNIMO': '2', QR_CODE: 'PRD-020' },
];

const TECNICOS_BASE = [
  { TÉCNICO: 'João Silva', PLACA: 'ABC-1D23', STATUS: 'ATIVO', 'NOME COMPLETO': 'João Paulo Silva' },
  { TÉCNICO: 'Maria Oliveira', PLACA: 'XYZ-5E67', STATUS: 'ATIVO', 'NOME COMPLETO': 'Maria Fernanda Oliveira' },
  { TÉCNICO: 'Carlos Santos', PLACA: 'DEF-9F01', STATUS: 'ATIVO', 'NOME COMPLETO': 'Carlos Eduardo Santos' },
  { TÉCNICO: 'Ana Costa', PLACA: 'GHI-3G45', STATUS: 'ATIVO', 'NOME COMPLETO': 'Ana Beatriz Costa' },
  { TÉCNICO: 'Pedro Alves', PLACA: 'JKL-7H89', STATUS: 'ATIVO', 'NOME COMPLETO': 'Pedro Henrique Alves' },
  { TÉCNICO: 'Lucas Ferreira', PLACA: 'MNO-2I34', STATUS: 'ATIVO', 'NOME COMPLETO': 'Lucas Gabriel Ferreira' },
  { TÉCNICO: 'Fernanda Lima', PLACA: 'PQR-6J78', STATUS: 'INATIVO', 'NOME COMPLETO': 'Fernanda Cristina Lima' },
];

const MOVIMENTACOES_BASE = [
  { DATA: '03/03/2026', TÉCNICO: 'João Silva', PLACA: 'ABC-1D23', PRODUTO: 'Cabo UTP Cat6', QUANTIDADE: '50', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '07/03/2026', TÉCNICO: 'Maria Oliveira', PLACA: 'XYZ-5E67', PRODUTO: 'Conector RJ45 Cat6', QUANTIDADE: '20', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '12/03/2026', TÉCNICO: 'Carlos Santos', PLACA: 'DEF-9F01', PRODUTO: 'Patch Cord 1m Cat6', QUANTIDADE: '5', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '18/03/2026', TÉCNICO: 'João Silva', PLACA: 'ABC-1D23', PRODUTO: 'Fita Isolante', QUANTIDADE: '3', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '25/03/2026', TÉCNICO: 'Ana Costa', PLACA: 'GHI-3G45', PRODUTO: 'Abraçadeira Nylon 200mm', QUANTIDADE: '50', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '02/04/2026', TÉCNICO: 'Pedro Alves', PLACA: 'JKL-7H89', PRODUTO: 'Parafuso M6x20', QUANTIDADE: '100', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '05/04/2026', TÉCNICO: 'Maria Oliveira', PLACA: 'XYZ-5E67', PRODUTO: 'Conector RJ45 Cat6', QUANTIDADE: '3', STATUS: 'PERDIDO', 'OBSERVAÇÕES': 'Perdido durante instalação' },
  { DATA: '08/04/2026', TÉCNICO: 'Lucas Ferreira', PLACA: 'MNO-2I34', PRODUTO: 'Patch Cord 3m Cat6', QUANTIDADE: '4', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '11/04/2026', TÉCNICO: 'Carlos Santos', PLACA: 'DEF-9F01', PRODUTO: 'Cabo UTP Cat6', QUANTIDADE: '30', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '16/04/2026', TÉCNICO: 'João Silva', PLACA: 'ABC-1D23', PRODUTO: 'Caixa de Passagem 4x4', QUANTIDADE: '8', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '21/04/2026', TÉCNICO: 'Ana Costa', PLACA: 'GHI-3G45', PRODUTO: 'Patch Cord 1m Cat6', QUANTIDADE: '2', STATUS: 'DEVOLUÇÃO', 'OBSERVAÇÕES': 'Material sobrou na obra' },
  { DATA: '24/04/2026', TÉCNICO: 'Pedro Alves', PLACA: 'JKL-7H89', PRODUTO: 'Roteador WiFi AC1200', QUANTIDADE: '2', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '29/04/2026', TÉCNICO: 'Lucas Ferreira', PLACA: 'MNO-2I34', PRODUTO: 'Tampa de Caixa 4x4', QUANTIDADE: '10', STATUS: 'SOBRA', 'OBSERVAÇÕES': '2 unidades devolvidas' },
  { DATA: '02/05/2026', TÉCNICO: 'Maria Oliveira', PLACA: 'XYZ-5E67', PRODUTO: 'Abraçadeira Nylon 200mm', QUANTIDADE: '100', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '06/05/2026', TÉCNICO: 'João Silva', PLACA: 'ABC-1D23', PRODUTO: 'Parafuso M6x20', QUANTIDADE: '50', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '09/05/2026', TÉCNICO: 'Carlos Santos', PLACA: 'DEF-9F01', PRODUTO: 'No-break 600VA', QUANTIDADE: '1', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '13/05/2026', TÉCNICO: 'Lucas Ferreira', PLACA: 'MNO-2I34', PRODUTO: 'Conector RJ45 Cat6', QUANTIDADE: '30', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '15/05/2026', TÉCNICO: 'Ana Costa', PLACA: 'GHI-3G45', PRODUTO: 'Cabo UTP Cat6', QUANTIDADE: '20', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '19/05/2026', TÉCNICO: 'Pedro Alves', PLACA: 'JKL-7H89', PRODUTO: 'Eletroduto PVC 3/4"', QUANTIDADE: '30', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '22/05/2026', TÉCNICO: 'João Silva', PLACA: 'ABC-1D23', PRODUTO: 'Patch Cord 3m Cat6', QUANTIDADE: '1', STATUS: 'TROCA', 'OBSERVAÇÕES': 'Cabo com defeito' },
  { DATA: '25/05/2026', TÉCNICO: 'Maria Oliveira', PLACA: 'XYZ-5E67', PRODUTO: 'Tampa de Caixa 4x4', QUANTIDADE: '5', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '28/05/2026', TÉCNICO: 'Carlos Santos', PLACA: 'DEF-9F01', PRODUTO: 'Luva para Eletroduto 3/4"', QUANTIDADE: '20', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '30/05/2026', TÉCNICO: 'Lucas Ferreira', PLACA: 'MNO-2I34', PRODUTO: 'Fita Isolante', QUANTIDADE: '5', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '01/06/2026', TÉCNICO: 'Ana Costa', PLACA: 'GHI-3G45', PRODUTO: 'Etiqueta de Identificação', QUANTIDADE: '50', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '02/06/2026', TÉCNICO: 'Pedro Alves', PLACA: 'JKL-7H89', PRODUTO: 'Caixa de Passagem 4x4', QUANTIDADE: '3', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '03/06/2026', TÉCNICO: 'João Silva', PLACA: 'ABC-1D23', PRODUTO: 'Conector RJ45 Cat6', QUANTIDADE: '10', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '04/06/2026', TÉCNICO: 'Maria Oliveira', PLACA: 'XYZ-5E67', PRODUTO: 'Abraçadeira Nylon 200mm', QUANTIDADE: '2', STATUS: 'PERDIDO', 'OBSERVAÇÕES': '' },
  { DATA: '04/06/2026', TÉCNICO: 'Carlos Santos', PLACA: 'DEF-9F01', PRODUTO: 'Patch Cord 1m Cat6', QUANTIDADE: '10', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
  { DATA: '05/06/2026', TÉCNICO: 'Lucas Ferreira', PLACA: 'MNO-2I34', PRODUTO: 'Cabo UTP Cat6', QUANTIDADE: '40', STATUS: 'TRANSFERÊNCIA', 'OBSERVAÇÕES': 'Transferência para Filial Norte' },
  { DATA: '05/06/2026', TÉCNICO: 'Ana Costa', PLACA: 'GHI-3G45', PRODUTO: 'Parafuso M6x20', QUANTIDADE: '200', STATUS: 'RETIRADA', 'OBSERVAÇÕES': '' },
];

const CONFERENCIAS_BASE = [
  {
    id: 'CONF-001',
    data: '15/03/2026',
    estoque: 'CENTRO',
    tecnico: 'João Silva',
    carro: 'ABC-1D23',
    estoquista: 'Admin Demo',
    itens: [
      { produto: 'Cabo UTP Cat6', sistema: 400, fisico: 395, diferenca: -5, status: 'SOBRA' },
      { produto: 'Conector RJ45 Cat6', sistema: 230, fisico: 228, diferenca: -2, status: 'SOBRA' },
      { produto: 'Patch Cord 1m Cat6', sistema: 85, fisico: 87, diferenca: 2, status: 'SOBRA' },
    ],
  },
  {
    id: 'CONF-002',
    data: '20/04/2026',
    estoque: 'CENTRO',
    tecnico: 'Maria Oliveira',
    carro: 'XYZ-5E67',
    estoquista: 'Admin Demo',
    itens: [
      { produto: 'Fita Isolante', sistema: 35, fisico: 33, diferenca: -2, status: 'PERDIDO' },
      { produto: 'Abraçadeira Nylon 200mm', sistema: 600, fisico: 598, diferenca: -2, status: 'SOBRA' },
      { produto: 'Parafuso M6x20', sistema: 900, fisico: 902, diferenca: 2, status: 'SOBRA' },
    ],
  },
  {
    id: 'CONF-003',
    data: '28/05/2026',
    estoque: 'CENTRO',
    tecnico: 'Carlos Santos',
    carro: 'DEF-9F01',
    estoquista: 'Admin Demo',
    itens: [
      { produto: 'Switch 24 Portas', sistema: 6, fisico: 5, diferenca: -1, status: 'PERDIDO' },
      { produto: 'Roteador WiFi AC1200', sistema: 17, fisico: 17, diferenca: 0, status: 'OK' },
      { produto: 'No-break 600VA', sistema: 8, fisico: 7, diferenca: -1, status: 'PERDIDO' },
    ],
  },
];

const USUARIOS_BASE = [
  { USERNAME: 'demo', NAME: 'Admin Demo', ROLE: 'gerente', ESTOQUES: '*', ATIVO: 'SIM' },
  { USERNAME: 'supervisor_demo', NAME: 'Supervisor Demo', ROLE: 'supervisor', ESTOQUES: 'CENTRO,NORTE', ATIVO: 'SIM' },
  { USERNAME: 'auxiliar_demo', NAME: 'Auxiliar Demo', ROLE: 'auxiliar', ESTOQUES: 'CENTRO', ATIVO: 'SIM' },
];

/* =========================================================
   ESTADO EM MEMÓRIA (reinicia ao recarregar a página)
========================================================= */

let _produtos = [...PRODUTOS_BASE];
let _tecnicos = TECNICOS_BASE.map((t, i) => ({ ...t, ID: i + 1 }));
let _movimentacoes = [...MOVIMENTACOES_BASE];
let _conferencias = [...CONFERENCIAS_BASE];

function derivarTipo(status) {
  if (status === 'TRANSFERÊNCIA') return 'TRANSFERÊNCIA';
  if (status === 'DEVOLUÇÃO' || status === 'ENTRADA') return 'ENTRADA';
  return 'SAIDA';
}

/* =========================================================
   FUNÇÕES DO SERVIÇO
========================================================= */

function isConfigured() {
  return true;
}

async function carregarTodos() {
  return {
    movimentacoes: _movimentacoes.map(m => ({
      ...m,
      TIPO: m.TIPO || derivarTipo(m.STATUS),
    })),
    tecnicos: [..._tecnicos],
    produtos: [..._produtos],
  };
}

async function salvarMovimentacao(dados) {
  if (dados.acao === 'salvarTecnico') {
    const novo = {
      ID: _tecnicos.length + 1,
      TÉCNICO: dados.nome,
      PLACA: dados.placa,
      STATUS: dados.status,
      'NOME COMPLETO': dados.nome,
    };
    _tecnicos = [..._tecnicos, novo];
    return { success: true };
  }

  if (dados.acao === 'editarTecnico') {
    _tecnicos = _tecnicos.map(t =>
      t.ID === dados.id
        ? { ...t, TÉCNICO: dados.nome, PLACA: dados.placa, STATUS: dados.status, 'NOME COMPLETO': dados.nome }
        : t
    );
    return { success: true };
  }

  const nova = {
    DATA: dados.DATA || new Date().toLocaleDateString('pt-BR'),
    TÉCNICO: dados['TÉCNICO'] || dados.TECNICO || '',
    PLACA: dados.PLACA || '',
    PRODUTO: dados.PRODUTO || '',
    QUANTIDADE: String(dados.QUANTIDADE || ''),
    STATUS: dados.STATUS || 'RETIRADA',
    TIPO: dados.TIPO || derivarTipo(dados.STATUS || 'RETIRADA'),
    'OBSERVAÇÕES': dados['OBSERVAÇÕES'] || dados.OBSERVACOES || '',
  };

  _movimentacoes = [nova, ..._movimentacoes];

  return { success: true };
}

async function salvarProduto(produto) {
  const idx = _produtos.findIndex(p => p.PRODUTO === produto.PRODUTO);

  if (idx >= 0) {
    _produtos = _produtos.map((p, i) =>
      i === idx ? { ...p, ...produto } : p
    );
  } else {
    _produtos = [..._produtos, produto];
  }

  return { success: true };
}

async function salvarConferencia(relatorio) {
  const nova = {
    id: `CONF-${String(_conferencias.length + 1).padStart(3, '0')}`,
    data: new Date().toLocaleDateString('pt-BR'),
    estoque: relatorio.estoque || 'CENTRO',
    tecnico: relatorio.tecnico || '',
    carro: relatorio.carro || '',
    estoquista: relatorio.estoquista || '',
    itens: relatorio.itens || [],
  };

  _conferencias = [nova, ..._conferencias];

  return { success: true };
}

async function listarConferencias() {
  return [..._conferencias];
}

async function buscarUsuarios() {
  return [...USUARIOS_BASE];
}

async function salvarUsuario(dados) {
  return { success: true };
}

async function excluirUsuario(username) {
  return { success: true };
}

async function testarConexao() {
  return {
    success: true,
    message: 'Modo demo ativo — dados fictícios carregados.',
  };
}

function formatDate(val) {
  if (!val) return '';

  if (typeof val === 'string' && val.includes('/')) return val;

  let date;

  if (!isNaN(val)) {
    const utc = new Date((Number(val) - 25569) * 86400 * 1000);
    date = new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
  } else if (typeof val === 'string' && val.includes('-')) {
    const [ano, mes, dia] = val.split('-').map(Number);
    date = new Date(ano, mes - 1, dia);
  } else {
    const d = new Date(val);
    if (isNaN(d)) return val;
    date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  return date.toLocaleDateString('pt-BR');
}

function clearCache() {}

/* =========================================================
   EXPORT
========================================================= */

export default {
  CONFIG,
  isConfigured,
  carregarTodos,
  salvarMovimentacao,
  salvarProduto,
  salvarConferencia,
  listarConferencias,
  buscarUsuarios,
  salvarUsuario,
  excluirUsuario,
  testarConexao,
  formatDate,
  clearCache,
};
