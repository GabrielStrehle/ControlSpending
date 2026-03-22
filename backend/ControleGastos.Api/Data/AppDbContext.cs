using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Pessoa -> Transações: cascade delete (ao remover pessoa, apaga as transações dela)
        modelBuilder.Entity<Pessoa>(entity =>
        {
            entity.HasMany(p => p.Transacoes)
                  .WithOne(t => t.Pessoa)
                  .HasForeignKey(t => t.PessoaId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Categoria -> Transações: restrict (não permite apagar categoria em uso)
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasMany(c => c.Transacoes)
                  .WithOne(t => t.Categoria)
                  .HasForeignKey(t => t.CategoriaId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Salva enums como string no banco pra ficar legível
        modelBuilder.Entity<Categoria>()
            .Property(c => c.Finalidade)
            .HasConversion<string>();

        modelBuilder.Entity<Transacao>()
            .Property(t => t.Tipo)
            .HasConversion<string>();
    }
}
