// Tipos que espelham os DTOs do backend

export interface PessoaDto {
  nome: string;
  idade: number;
}

export interface PessoaResponse {
  id: number;
  nome: string;
  idade: number;
}

export type Finalidade = "Despesa" | "Receita" | "Ambas";

export interface CategoriaDto {
  descricao: string;
  finalidade: Finalidade;
}

export interface CategoriaResponse {
  id: number;
  descricao: string;
  finalidade: string;
}

export type TipoTransacao = "Despesa" | "Receita";

export interface TransacaoDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
}

export interface TransacaoResponse {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  categoriaId: number;
  categoriaDescricao: string;
  pessoaId: number;
  pessoaNome: string;
}

export interface TotalPorPessoa {
  pessoaId: number;
  pessoaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalPorCategoria {
  categoriaId: number;
  categoriaDescricao: string;
  finalidade: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisResponse<T> {
  itens: T[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}
