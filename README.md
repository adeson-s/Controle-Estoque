# AlmoxApp — Controle de Estoque

Sistema de controle de almoxarifado para equipes de campo, desenvolvido com React + Vite. Suporta múltiplas filiais, controle de saídas por técnico, conferência de estoque, alertas de reposição e geração de relatórios.

> **Modo demo disponível**.

---

## Demonstração

| Tela | Descrição |
|---|---|
| Dashboard | KPIs, gráficos de tendência, alertas críticos de estoque |
| Nova Saída | Registro de retiradas com carrinho de produtos e leitura de QR Code |
| Produtos | Listagem com filtros, status de estoque e modal de detalhes |
| Técnicos | Cadastro e histórico de movimentações por técnico |
| Conferência | Levantamento físico de estoque por filial e kit de produtos |
| Usuários | Gerenciamento de acessos por role (gerente, supervisor, auxiliar) |

---

## Stack

- **React 18** + **Vite 5**
- **React Router v6** — roteamento client-side
- **Chart.js 4** — gráficos de dashboard
- **QRCode.react** — geração e leitura de QR Codes
- **XLSX** — exportação de relatórios para Excel
- **jsPDF** — geração de PDFs
- **Google Sheets API** — backend de dados (opcional, substituível por mock)
- **Google Apps Script** — operações de escrita na planilha

---

## Funcionalidades

- **Autenticação** com controle de sessão por inatividade (localStorage)
- **Multi-filial** — usuários podem ter acesso a uma ou mais filiais
- **Controle de permissões** por role: `gerente`, `supervisor`, `auxiliar`
- **Dashboard** com KPIs, gráfico de tendência, top produtos e ranking de perdas
- **Nova Saída** — carrinho de produtos com status por item, quantidade e observações
- **Histórico de movimentações** com filtros por técnico e período
- **Alertas de estoque crítico** ordenados por nível de urgência
- **Conferência de estoque** — comparativo sistema vs. físico por filial
- **Detalhes do produto** — histórico, sparkline de saídas, QR Code imprimível
- **Detalhes do técnico** — dashboard individual com top produtos e histórico
- **Exportação** de dados para Excel e PDF
- **Modo demo** completo com dados fictícios (sem necessidade de configuração)

---


## Configuração com Google Sheets (opcional)

Para conectar ao seu próprio backend:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Preencha as variáveis no `.env`:

```env
VITE_GOOGLE_API_KEY=        # API Key do Google Cloud Console
VITE_MASTER_SHEET_ID=       # ID da planilha de usuários
VITE_SCRIPT_URL=            # URL do Google Apps Script publicado

VITE_SHEET_CENTRO=          # ID da planilha da Filial Centro
VITE_SHEET_NORTE=           # ID da planilha da Filial Norte
VITE_SHEET_SUL=             # ID da planilha da Filial Sul
VITE_SHEET_LESTE=           # ID da planilha da Filial Leste

VITE_SESSION_HOURS=8        # Tempo de sessão em horas
```

### Estrutura esperada da planilha

Cada planilha de filial deve conter três abas:

| Aba | Colunas obrigatórias |
|---|---|
| `CADASTRO_PRODUTOS` | `PRODUTO`, `UNIDADE`, `ESTOQUE ATUAL`, `ESTOQUE MÍNIMO`, `QR_CODE` |
| `CADASTRO_TECNICOS` | `TÉCNICO`, `NOME COMPLETO`, `PLACA`, `STATUS` |
| `MOVIMENTACOES` | `DATA`, `TÉCNICO`, `PLACA`, `PRODUTO`, `QUANTIDADE`, `STATUS`, `TIPO`, `OBSERVAÇÕES` |

A planilha mestre (`MASTER_SHEET_ID`) deve ter uma aba `USUARIOS` com as colunas:
`USERNAME`, `PASSWORD`, `NAME`, `ROLE`, `ESTOQUES`, `ATIVO`

---

## Estrutura do projeto

```
src/
├── auth/
│   └── AuthContext.jsx       # Autenticação, sessão e permissões
├── components/
│   ├── DetalheProduto.jsx    # Modal de detalhes do produto
│   ├── DetalheTecnico.jsx    # Modal de detalhes do técnico
│   ├── PageHeader.jsx        # Cabeçalho com troca de filial e logout
│   └── Sidebar.jsx           # Menu lateral
├── data/
│   ├── kits.json             # Kits de conferência por filial
│   └── localHierarchy.js     # Hierarquia de locais do estoque
├── pages/
│   ├── Dashboard.jsx
│   ├── Produtos.jsx
│   ├── Tecnicos.jsx
│   ├── NovaSaida.jsx
│   ├── Conferenciaestoque.jsx
│   ├── Movimentacoes.jsx
│   ├── Gerenciamentousuarios.jsx
│   └── Login.jsx
├── services/
│   ├── MockService.js        # Dados fictícios para modo demo
│   └── SheetsService.js      # Integração com Google Sheets
└── AppContext.jsx             # Estado global e seleção de serviço ativo
```

---

## Roles e permissões

| Permissão | Gerente | Supervisor | Auxiliar |
|---|:---:|:---:|:---:|
| Dashboard | ✓ | ✓ | ✓ |
| Produtos — visualizar | ✓ | ✓ | ✓ |
| Produtos — criar/editar | ✓ | ✓ | — |
| Produtos — excluir | ✓ | — | — |
| Nova Saída | ✓ | ✓ | ✓ |
| Técnicos — visualizar | ✓ | ✓ | ✓ |
| Técnicos — editar | ✓ | ✓ | — |
| Conferência de estoque | ✓ | ✓ | ✓ |
| Relatórios | ✓ | ✓ | ✓ |
| Exportar dados | ✓ | ✓ | — |
| Gerenciar usuários | ✓ | — | — |

---

## Licença

MIT
