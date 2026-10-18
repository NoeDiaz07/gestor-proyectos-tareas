using System.ComponentModel.DataAnnotations;

namespace GestorProyectos.Api.Models;

public class TaskItem
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending";

    public DateOnly DueDate { get; set; }

    public int ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    public int AssigneeId { get; set; }

    public Assignee Assignee { get; set; } = null!;
}