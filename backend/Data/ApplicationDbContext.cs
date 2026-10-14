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
}