namespace GestorProyectos.Api.DTOs;

public class TaskResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateOnly DueDate { get; set; }

    public int ProjectId { get; set; }

    public string ProjectName { get; set; } = string.Empty;

    public int AssigneeId { get; set; }

    public string AssigneeName { get; set; } = string.Empty;
}