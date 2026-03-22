import { useEffect, useState } from "react";
import { getTotaisPorPessoa, getTotaisPorCategoria } from "../../services/api";
import type { TotaisResponse, TotalPorPessoa, TotalPorCategoria } from "../../types";

export default function TotaisPage() {
  const [porPessoa, setPorPessoa] = useState<TotaisResponse<TotalPorPessoa> | null>(null);
  const [porCategoria, setPorCategoria] = useState<TotaisResponse<TotalPorCategoria> | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => { carregarTotais(); }, []);

  async function carregarTotais() {
    try {
      const [p, c] = await Promise.all([getTotaisPorPessoa(), getTotaisPorCategoria()]);
      setPorPessoa(p);
      setPorCategoria(c);
    } catch {
      setErro("Erro ao carregar totais.");
    }
  }

  function moeda(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function classSaldo(v: number) {
    if (v > 0) return "val-positive";
    if (v < 0) return "val-negative";
    return "val-neutral";
  }

  return (
    <div>
      <div className="page-header">
        <h2>Totais</h2>
        <p>Resumo financeiro de receitas, despesas e saldo</p>
      </div>

      {erro && <p className="msg-error">{erro}</p>}

      {/* Totais por pessoa */}
      <div className="section">
        <h3>Por pessoa</h3>
        {porPessoa && (
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {porPessoa.itens.length === 0 ? (
                <tr><td colSpan={4} className="empty-state">Nenhuma pessoa cadastrada.</td></tr>
              ) : (
                <>
                  {porPessoa.itens.map((item) => (
                    <tr key={item.pessoaId}>
                      <td>{item.pessoaNome}</td>
                      <td>{moeda(item.totalReceitas)}</td>
                      <td>{moeda(item.totalDespesas)}</td>
                      <td className={classSaldo(item.saldo)}>{moeda(item.saldo)}</td>
                    </tr>
                  ))}
                  <tr className="totals-row">
                    <td>Total Geral</td>
                    <td>{moeda(porPessoa.totalGeralReceitas)}</td>
                    <td>{moeda(porPessoa.totalGeralDespesas)}</td>
                    <td className={classSaldo(porPessoa.saldoLiquido)}>{moeda(porPessoa.saldoLiquido)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Totais por categoria */}
      <div className="section">
        <h3>Por categoria</h3>
        {porCategoria && (
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Finalidade</th>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {porCategoria.itens.length === 0 ? (
                <tr><td colSpan={5} className="empty-state">Nenhuma categoria cadastrada.</td></tr>
              ) : (
                <>
                  {porCategoria.itens.map((item) => (
                    <tr key={item.categoriaId}>
                      <td>{item.categoriaDescricao}</td>
                      <td>
                        <span className={`tag ${item.finalidade === "Despesa" ? "tag-despesa" : item.finalidade === "Receita" ? "tag-receita" : "tag-ambas"}`}>
                          {item.finalidade}
                        </span>
                      </td>
                      <td>{moeda(item.totalReceitas)}</td>
                      <td>{moeda(item.totalDespesas)}</td>
                      <td className={classSaldo(item.saldo)}>{moeda(item.saldo)}</td>
                    </tr>
                  ))}
                  <tr className="totals-row">
                    <td colSpan={2}>Total Geral</td>
                    <td>{moeda(porCategoria.totalGeralReceitas)}</td>
                    <td>{moeda(porCategoria.totalGeralDespesas)}</td>
                    <td className={classSaldo(porCategoria.saldoLiquido)}>{moeda(porCategoria.saldoLiquido)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
