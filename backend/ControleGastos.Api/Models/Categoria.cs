using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models;

public class Categoria
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(400)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public Finalidade Finalidade { get; set; }

    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}

public enum Finalidade
{
    Despesa = 0,
    Receita = 1,
    Ambas = 2
}
