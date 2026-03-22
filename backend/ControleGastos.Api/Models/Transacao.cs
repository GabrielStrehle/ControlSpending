using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleGastos.Api.Models;

public class Transacao
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(400)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Valor { get; set; }

    [Required]
    public TipoTransacao Tipo { get; set; }

    [Required]
    public int CategoriaId { get; set; }

    [ForeignKey("CategoriaId")]
    public Categoria Categoria { get; set; } = null!;

    [Required]
    public int PessoaId { get; set; }

    [ForeignKey("PessoaId")]
    public Pessoa Pessoa { get; set; } = null!;
}

public enum TipoTransacao
{
    Despesa = 0,
    Receita = 1
}
