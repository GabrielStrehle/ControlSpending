using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.DTOs;

public class PessoaDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "A idade é obrigatória.")]
    [Range(0, 150, ErrorMessage = "Informe uma idade válida.")]
    public int Idade { get; set; }
}

public class PessoaResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}
