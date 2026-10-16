using GestorProyectos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GestorProyectos.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();

    public DbSet<Assignee> Assignees => Set<Assignee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Assignee>()
            .HasIndex(assignee => assignee.Email)
            .IsUnique();
    }
}