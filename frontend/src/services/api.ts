import axios from "axios";
import type {
  PessoaDto, PessoaResponse,
  CategoriaDto, CategoriaResponse,
  TransacaoDto, TransacaoResponse,
  TotaisResponse, TotalPorPessoa, TotalPorCategoria,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:5005/api",
});

// Pessoas
export const getPessoas = () => api.get<PessoaResponse[]>("/pessoas").then((r) => r.data);
export const getPessoa = (id: number) => api.get<PessoaResponse>(`/pessoas/${id}`).then((r) => r.data);
export const createPessoa = (data: PessoaDto) => api.post<PessoaResponse>("/pessoas", data).then((r) => r.data);
export const updatePessoa = (id: number, data: PessoaDto) => api.put<PessoaResponse>(`/pessoas/${id}`, data).then((r) => r.data);
export const deletePessoa = (id: number) => api.delete(`/pessoas/${id}`);

// Categorias
export const getCategorias = () => api.get<CategoriaResponse[]>("/categorias").then((r) => r.data);
export const createCategoria = (data: CategoriaDto) => api.post<CategoriaResponse>("/categorias", data).then((r) => r.data);

// Transações
export const getTransacoes = () => api.get<TransacaoResponse[]>("/transacoes").then((r) => r.data);
export const createTransacao = (data: TransacaoDto) => api.post<TransacaoResponse>("/transacoes", data).then((r) => r.data);

// Totais
export const getTotaisPorPessoa = () => api.get<TotaisResponse<TotalPorPessoa>>("/totais/por-pessoa").then((r) => r.data);
export const getTotaisPorCategoria = () => api.get<TotaisResponse<TotalPorCategoria>>("/totais/por-categoria").then((r) => r.data);
