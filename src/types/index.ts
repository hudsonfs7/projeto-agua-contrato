
export type TipoPessoa = 'juridica' | 'natural';

export type TipoRede = 'agua' | 'esgoto' | 'agua_esgoto';

export type StatusProjeto = 
  | 'analise_inicial' 
  | 'em_elaboracao' 
  | 'em_revisao' 
  | 'aprovado' 
  | 'contratado'
  | 'em_execucao'
  | 'concluido';

export interface Pessoa {
  id: string;
  tipo: TipoPessoa;
  nome: string;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaixaRenda {
  id: number;
  descricao: string;
}

export interface Projeto {
  id: string;
  numeroEVTE: string;
  tipoRede: TipoRede;
  responsavelId: string;
  responsavel?: Pessoa;
  titulo: string;
  descricao: string;
  cidade: string;
  estado: string;
  bairro: string;
  numeroLotesHabitacionais: number;
  numeroLotesComerciais: number;
  faixaRendaId: number;
  faixaRenda?: FaixaRenda;
  status: StatusProjeto;
  dataInicio: Date;
  previsaoConclusao: Date | null;
  dataConclusao: Date | null;
  observacoes: string;
  createdAt: Date;
  updatedAt: Date;
}

export const FAIXAS_RENDA: FaixaRenda[] = [
  { id: 1, descricao: 'Baixa Renda (até 3 salários mínimos)' },
  { id: 2, descricao: 'Média Baixa (3 a 6 salários mínimos)' },
  { id: 3, descricao: 'Média (6 a 10 salários mínimos)' },
  { id: 4, descricao: 'Média Alta (10 a 20 salários mínimos)' },
  { id: 5, descricao: 'Alta (acima de 20 salários mínimos)' },
  { id: 6, descricao: 'Misto (várias faixas)' },
  { id: 7, descricao: 'Comercial' },
  { id: 8, descricao: 'Industrial' },
];

export const STATUS_PROJETO_MAP: Record<StatusProjeto, { label: string, color: string }> = {
  analise_inicial: { label: 'Análise Inicial', color: 'bg-yellow-100 text-yellow-800' },
  em_elaboracao: { label: 'Em Elaboração', color: 'bg-blue-100 text-blue-800' },
  em_revisao: { label: 'Em Revisão', color: 'bg-orange-100 text-orange-800' },
  aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
  contratado: { label: 'Contratado', color: 'bg-indigo-100 text-indigo-800' },
  em_execucao: { label: 'Em Execução', color: 'bg-purple-100 text-purple-800' },
  concluido: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-800' },
};

// Dados mock para desenvolvimento
export const MOCK_PESSOAS: Pessoa[] = [
  {
    id: '1',
    tipo: 'juridica',
    nome: 'Construtora Exemplo Ltda',
    documento: '12.345.678/0001-90',
    email: 'contato@exemplo.com',
    telefone: '(11) 3456-7890',
    endereco: 'Av. Principal, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    tipo: 'natural',
    nome: 'João Silva',
    documento: '123.456.789-00',
    email: 'joao@email.com',
    telefone: '(21) 98765-4321',
    endereco: 'Rua das Flores, 123',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20'),
  }
];

export const MOCK_PROJETOS: Projeto[] = [
  {
    id: '1',
    numeroEVTE: 'EVTE-2023-001',
    tipoRede: 'agua_esgoto',
    responsavelId: '1',
    titulo: 'Condomínio Jardim das Águas',
    descricao: 'Projeto de redes de água e esgoto para condomínio residencial',
    cidade: 'São Paulo',
    estado: 'SP',
    bairro: 'Morumbi',
    numeroLotesHabitacionais: 120,
    numeroLotesComerciais: 5,
    faixaRendaId: 3,
    status: 'em_elaboracao',
    dataInicio: new Date('2023-03-10'),
    previsaoConclusao: new Date('2023-09-30'),
    dataConclusao: null,
    observacoes: 'Projeto em fase de elaboração de plantas e memoriais descritivos.',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-04-15'),
  }
];
