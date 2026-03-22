import { useEffect, useState } from "react";
import { getPessoas, createPessoa, updatePessoa, deletePessoa } from "../../services/api";
import type { PessoaResponse, PessoaDto } from "../../types";

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    try {
      setPessoas(await getPessoas());
    } catch {
      setErro("Erro ao carregar pessoas.");
    }
  }

  function limparForm() {
    setNome("");
    setIdade("");
    setEditingId(null);
    setErro("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const idadeNum = parseInt(idade);
    if (!nome.trim()) return setErro("O nome é obrigatório.");
    if (nome.length > 200) return setErro("O nome deve ter no máximo 200 caracteres.");
    if (isNaN(idadeNum) || idadeNum < 0) return setErro("Informe uma idade válida.");

    const dto: PessoaDto = { nome: nome.trim(), idade: idadeNum };
    setLoading(true);

    try {
      if (editingId) {
        await updatePessoa(editingId, dto);
      } else {
        await createPessoa(dto);
      }
      limparForm();
      await carregarPessoas();
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(p: PessoaResponse) {
    setEditingId(p.id);
    setNome(p.nome);
    setIdade(String(p.idade));
    setErro("");
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza? Todas as transações dessa pessoa serão apagadas.")) return;
    try {
      await deletePessoa(id);
      await carregarPessoas();
    } catch {
      setErro("Erro ao excluir pessoa.");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Pessoas</h2>
        <p>Gerencie as pessoas cadastradas no sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3>{editingId ? "Editar pessoa" : "Nova pessoa"}</h3>
        <div className="form-row">
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={200}
              placeholder="Ex: Maria Silva"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="idade">Idade</label>
            <input
              id="idade"
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              min={0}
              placeholder="Ex: 30"
              required
            />
          </div>
        </div>

        {erro && <p className="msg-error">{erro}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Salvando..." : editingId ? "Atualizar" : "Cadastrar"}
          </button>
          {editingId && (
            <button type="button" onClick={limparForm} className="btn btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th style={{ width: 160 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.length === 0 ? (
            <tr><td colSpan={4} className="empty-state">Nenhuma pessoa cadastrada.</td></tr>
          ) : (
            pessoas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.idade} anos</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEdit(p)} className="btn btn-sm btn-ghost">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-danger">Excluir</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
