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

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Assignee>()
            .HasIndex(assignee => assignee.Email)
            .IsUnique();

        modelBuilder.Entity<TaskItem>()
            .HasOne(task => task.Project)
            .WithMany()
            .HasForeignKey(task => task.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TaskItem>()
            .HasOne(task => task.Assignee)
            .WithMany()
            .HasForeignKey(task => task.AssigneeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}