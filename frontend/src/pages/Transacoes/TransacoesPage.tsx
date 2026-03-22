import { useEffect, useState } from "react";
import { getTransacoes, createTransacao, getPessoas, getCategorias } from "../../services/api";
import type { TransacaoResponse, PessoaResponse, CategoriaResponse, TipoTransacao } from "../../types";

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
  const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [categoriaId, setCategoriaId] = useState("");
  const [pessoaId, setPessoaId] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      const [t, p, c] = await Promise.all([getTransacoes(), getPessoas(), getCategorias()]);
      setTransacoes(t);
      setPessoas(p);
      setCategorias(c);
    } catch {
      setErro("Erro ao carregar dados.");
    }
  }

  // Filtra categorias compatíveis com o tipo selecionado
  const categoriasFiltradas = categorias.filter(
    (c) => c.finalidade === "Ambas" || c.finalidade === tipo
  );

  // Identifica se a pessoa selecionada é menor de idade
  const pessoaSelecionada = pessoas.find((p) => p.id === Number(pessoaId));
  const menorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  // Menor de idade não pode selecionar receita - força despesa
  useEffect(() => {
    if (menorDeIdade && tipo === "Receita") setTipo("Despesa");
  }, [menorDeIdade, tipo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!descricao.trim()) return setErro("A descrição é obrigatória.");
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) return setErro("O valor deve ser positivo.");
    if (!pessoaId) return setErro("Selecione uma pessoa.");
    if (!categoriaId) return setErro("Selecione uma categoria.");

    setLoading(true);
    try {
      await createTransacao({
        descricao: descricao.trim(),
        valor: valorNum,
        tipo,
        categoriaId: Number(categoriaId),
        pessoaId: Number(pessoaId),
      });
      // Limpa o form
      setDescricao("");
      setValor("");
      setCategoriaId("");
      setPessoaId("");
      setTipo("Despesa");
      await carregarDados();
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || "Erro ao criar transação.");
    } finally {
      setLoading(false);
    }
  }

  function formatarMoeda(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div>
      <div className="page-header">
        <h2>Transações</h2>
        <p>Registre receitas e despesas do controle residencial</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3>Nova transação</h3>

        <div className="form-row">
          <div className="field">
            <label htmlFor="pessoaId">Pessoa</label>
            <select id="pessoaId" value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} required>
              <option value="">Selecione...</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>
              ))}
            </select>
            {menorDeIdade && (
              <small className="msg-warning">Menor de idade: apenas despesas são permitidas.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => { setTipo(e.target.value as TipoTransacao); setCategoriaId(""); }}
              disabled={menorDeIdade}
            >
              <option value="Despesa">Despesa</option>
              {!menorDeIdade && <option value="Receita">Receita</option>}
            </select>
          </div>
        </div>

        <div className="form-row three-cols">
          <div className="field">
            <label htmlFor="categoriaId">Categoria</label>
            <select id="categoriaId" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
              <option value="">Selecione...</option>
              {categoriasFiltradas.map((c) => (
                <option key={c.id} value={c.id}>{c.descricao}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="descricao">Descrição</label>
            <input
              id="descricao"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={400}
              placeholder="Ex: Conta de luz"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min={0.01}
              step={0.01}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {erro && <p className="msg-error">{erro}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Categoria</th>
            <th>Pessoa</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.length === 0 ? (
            <tr><td colSpan={6} className="empty-state">Nenhuma transação cadastrada.</td></tr>
          ) : (
            transacoes.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.descricao}</td>
                <td>{formatarMoeda(t.valor)}</td>
                <td>
                  <span className={`tag ${t.tipo === "Despesa" ? "tag-despesa" : "tag-receita"}`}>
                    {t.tipo}
                  </span>
                </td>
                <td>{t.categoriaDescricao}</td>
                <td>{t.pessoaNome}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
