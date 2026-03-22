import { useEffect, useState } from "react";
import { getCategorias, createCategoria } from "../../services/api";
import type { CategoriaResponse, Finalidade } from "../../types";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<Finalidade>("Despesa");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setCategorias(await getCategorias());
    } catch {
      setErro("Erro ao carregar categorias.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!descricao.trim()) return setErro("A descrição é obrigatória.");
    if (descricao.length > 400) return setErro("Máximo de 400 caracteres.");

    setLoading(true);
    try {
      await createCategoria({ descricao: descricao.trim(), finalidade });
      setDescricao("");
      setFinalidade("Despesa");
      await carregarCategorias();
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || "Erro ao criar categoria.");
    } finally {
      setLoading(false);
    }
  }

  function tagClass(f: string) {
    if (f === "Despesa") return "tag tag-despesa";
    if (f === "Receita") return "tag tag-receita";
    return "tag tag-ambas";
  }

  return (
    <div>
      <div className="page-header">
        <h2>Categorias</h2>
        <p>Categorias para classificar as transações</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3>Nova categoria</h3>
        <div className="form-row">
          <div className="field">
            <label htmlFor="descricao">Descrição</label>
            <input
              id="descricao"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={400}
              placeholder="Ex: Alimentação, Transporte..."
              required
            />
          </div>
          <div className="field">
            <label htmlFor="finalidade">Finalidade</label>
            <select
              id="finalidade"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value as Finalidade)}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
              <option value="Ambas">Ambas</option>
            </select>
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
            <th>Finalidade</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr><td colSpan={3} className="empty-state">Nenhuma categoria cadastrada.</td></tr>
          ) : (
            categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.descricao}</td>
                <td><span className={tagClass(c.finalidade)}>{c.finalidade}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
