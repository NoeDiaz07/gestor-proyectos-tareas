using System.ComponentModel.DataAnnotations;

namespace GestorProyectos.Api.DTOs;

public class UpdateTaskDto
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression(
        "^(Pending|InProgress|Completed)$",
        ErrorMessage = "El estado debe ser Pending, InProgress o Completed.")]
    public string Status { get; set; } = string.Empty;

    [Required]
    public DateOnly? DueDate { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int? ProjectId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int? AssigneeId { get; set; }
}