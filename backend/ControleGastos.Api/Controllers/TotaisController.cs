using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("por-pessoa")]
    public async Task<ActionResult<TotaisResponseDto<TotalPorPessoaDto>>> GetTotaisPorPessoa()
    {
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        var itens = pessoas.Select(p =>
        {
            var receitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

            return new TotalPorPessoaDto
            {
                PessoaId = p.Id,
                PessoaNome = p.Nome,
                TotalReceitas = receitas,
                TotalDespesas = despesas,
                Saldo = receitas - despesas
            };
        }).ToList();

        return Ok(new TotaisResponseDto<TotalPorPessoaDto>
        {
            Itens = itens,
            TotalGeralReceitas = itens.Sum(i => i.TotalReceitas),
            TotalGeralDespesas = itens.Sum(i => i.TotalDespesas),
            SaldoLiquido = itens.Sum(i => i.Saldo)
        });
    }

    [HttpGet("por-categoria")]
    public async Task<ActionResult<TotaisResponseDto<TotalPorCategoriaDto>>> GetTotaisPorCategoria()
    {
        var categorias = await _context.Categorias
            .Include(c => c.Transacoes)
            .OrderBy(c => c.Descricao)
            .ToListAsync();

        var itens = categorias.Select(c =>
        {
            var receitas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

            return new TotalPorCategoriaDto
            {
                CategoriaId = c.Id,
                CategoriaDescricao = c.Descricao,
                Finalidade = c.Finalidade.ToString(),
                TotalReceitas = receitas,
                TotalDespesas = despesas,
                Saldo = receitas - despesas
            };
        }).ToList();

        return Ok(new TotaisResponseDto<TotalPorCategoriaDto>
        {
            Itens = itens,
            TotalGeralReceitas = itens.Sum(i => i.TotalReceitas),
            TotalGeralDespesas = itens.Sum(i => i.TotalDespesas),
            SaldoLiquido = itens.Sum(i => i.Saldo)
        });
    }
}
