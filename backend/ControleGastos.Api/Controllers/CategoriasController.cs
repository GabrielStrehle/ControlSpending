using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoriaResponseDto>>> GetAll()
    {
        var categorias = await _context.Categorias
            .OrderBy(c => c.Descricao)
            .Select(c => new CategoriaResponseDto
            {
                Id = c.Id,
                Descricao = c.Descricao,
                Finalidade = c.Finalidade.ToString()
            })
            .ToListAsync();

        return Ok(categorias);
    }

    [HttpPost]
    public async Task<ActionResult<CategoriaResponseDto>> Create([FromBody] CategoriaDto dto)
    {
        var categoria = new Categoria
        {
            Descricao = dto.Descricao,
            Finalidade = dto.Finalidade
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        var response = new CategoriaResponseDto
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = categoria.Finalidade.ToString()
        };

        return CreatedAtAction(nameof(GetAll), response);
    }
}
