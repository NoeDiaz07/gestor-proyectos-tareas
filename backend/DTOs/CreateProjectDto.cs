using System.ComponentModel.DataAnnotations;

namespace GestorProyectos.Api.DTOs;

public class CreateProjectDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public DateOnly? StartDate { get; set; }
}