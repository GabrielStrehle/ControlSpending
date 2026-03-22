namespace ControleGastos.Api.DTOs;

public class TotalPorPessoaDto
{
    public int PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

public class TotalPorCategoriaDto
{
    public int CategoriaId { get; set; }
    public string CategoriaDescricao { get; set; } = string.Empty;
    public string Finalidade { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

public class TotaisResponseDto<T>
{
    public List<T> Itens { get; set; } = new();
    public decimal TotalGeralReceitas { get; set; }
    public decimal TotalGeralDespesas { get; set; }
    public decimal SaldoLiquido { get; set; }
}
