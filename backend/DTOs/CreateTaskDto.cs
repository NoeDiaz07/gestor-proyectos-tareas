using System.ComponentModel.DataAnnotations;

namespace GestorProyectos.Api.DTOs;

public class CreateTaskDto
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression(
        "^Pending$",
        ErrorMessage = "Una tarea nueva debe comenzar en estado Pending.")]
    public string Status { get; set; } = "Pending";

    [Required]
    public DateOnly? DueDate { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int? ProjectId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int? AssigneeId { get; set; }
}