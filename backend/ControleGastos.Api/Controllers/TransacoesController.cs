using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TransacaoResponseDto>>> GetAll()
    {
        var transacoes = await _context.Transacoes
            .Include(t => t.Pessoa)
            .Include(t => t.Categoria)
            .OrderByDescending(t => t.Id)
            .Select(t => new TransacaoResponseDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo.ToString(),
                CategoriaId = t.CategoriaId,
                CategoriaDescricao = t.Categoria.Descricao,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa.Nome
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    [HttpPost]
    public async Task<ActionResult<TransacaoResponseDto>> Create([FromBody] TransacaoDto dto)
    {
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa == null)
            return BadRequest(new { mensagem = "Pessoa não encontrada." });

        var categoria = await _context.Categorias.FindAsync(dto.CategoriaId);
        if (categoria == null)
            return BadRequest(new { mensagem = "Categoria não encontrada." });

        // Menor de 18 só pode ter despesa
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            return BadRequest(new { mensagem = "Menores de idade só podem registrar despesas." });

        // A finalidade da categoria precisa bater com o tipo da transação
        if (!FinalidadeCompativelComTipo(categoria.Finalidade, dto.Tipo))
            return BadRequest(new { mensagem = "A categoria selecionada não é compatível com o tipo da transação." });

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            CategoriaId = dto.CategoriaId,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new TransacaoResponseDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo.ToString(),
            CategoriaId = transacao.CategoriaId,
            CategoriaDescricao = categoria.Descricao,
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa.Nome
        });
    }

    /// <summary>
    /// Verifica compatibilidade entre finalidade da categoria e tipo da transação.
    /// "Ambas" aceita qualquer tipo; caso contrário, precisa ser o mesmo.
    /// </summary>
    private static bool FinalidadeCompativelComTipo(Finalidade finalidade, TipoTransacao tipo)
    {
        if (finalidade == Finalidade.Ambas) return true;
        if (finalidade == Finalidade.Despesa && tipo == TipoTransacao.Despesa) return true;
        if (finalidade == Finalidade.Receita && tipo == TipoTransacao.Receita) return true;
        return false;
    }
}
