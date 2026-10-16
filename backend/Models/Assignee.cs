using System.ComponentModel.DataAnnotations;

namespace GestorProyectos.Api.Models;

public class Assignee
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(254)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}