using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<PessoaResponseDto>>> GetAll()
    {
        var pessoas = await _context.Pessoas
            .OrderBy(p => p.Nome)
            .Select(p => new PessoaResponseDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            })
            .ToListAsync();

        return Ok(pessoas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PessoaResponseDto>> GetById(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null)
            return NotFound(new { mensagem = "Pessoa não encontrada." });

        return Ok(new PessoaResponseDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        });
    }

    [HttpPost]
    public async Task<ActionResult<PessoaResponseDto>> Create([FromBody] PessoaDto dto)
    {
        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        var response = new PessoaResponseDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };

        return CreatedAtAction(nameof(GetById), new { id = pessoa.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PessoaResponseDto>> Update(int id, [FromBody] PessoaDto dto)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null)
            return NotFound(new { mensagem = "Pessoa não encontrada." });

        pessoa.Nome = dto.Nome;
        pessoa.Idade = dto.Idade;
        await _context.SaveChangesAsync();

        return Ok(new PessoaResponseDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        });
    }

    // Cascade delete: o EF já cuida de apagar as transações da pessoa
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null)
            return NotFound(new { mensagem = "Pessoa não encontrada." });

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
