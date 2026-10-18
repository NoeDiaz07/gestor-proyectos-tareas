using GestorProyectos.Api.Data;
using GestorProyectos.Api.DTOs;
using GestorProyectos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestorProyectos.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(List<TaskResponseDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TaskResponseDto>>> GetAll()
    {
        var tasks = await _context.Tasks
            .AsNoTracking()
            .OrderBy(task => task.Id)
            .Select(task => new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                DueDate = task.DueDate,
                ProjectId = task.ProjectId,
                ProjectName = task.Project.Name,
                AssigneeId = task.AssigneeId,
                AssigneeName = task.Assignee.Name
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(
        typeof(TaskResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskResponseDto>> GetById(int id)
    {
        var task = await _context.Tasks
            .AsNoTracking()
            .Where(task => task.Id == id)
            .Select(task => new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                DueDate = task.DueDate,
                ProjectId = task.ProjectId,
                ProjectName = task.Project.Name,
                AssigneeId = task.AssigneeId,
                AssigneeName = task.Assignee.Name
            })
            .FirstOrDefaultAsync();

        if (task is null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPost]
    [ProducesResponseType(
        typeof(TaskResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails),
        StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TaskResponseDto>> Create(
        CreateTaskDto dto)
    {
        var title = dto.Title.Trim();

        if (string.IsNullOrWhiteSpace(title))
        {
            ModelState.AddModelError(
                nameof(dto.Title),
                "El título es obligatorio.");

            return ValidationProblem(ModelState);
        }

        var project = await _context.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(
                item => item.Id == dto.ProjectId!.Value);

        var assignee = await _context.Assignees
            .AsNoTracking()
            .FirstOrDefaultAsync(
                item => item.Id == dto.AssigneeId!.Value);

        if (project is null)
        {
            ModelState.AddModelError(
                nameof(dto.ProjectId),
                "El proyecto seleccionado no existe.");
        }

        if (assignee is null)
        {
            ModelState.AddModelError(
                nameof(dto.AssigneeId),
                "El responsable seleccionado no existe.");
        }

        if (project is not null
            && dto.DueDate!.Value < project.StartDate)
        {
            ModelState.AddModelError(
                nameof(dto.DueDate),
                "El vencimiento no puede ser anterior al inicio del proyecto.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var task = new TaskItem
        {
            Title = title,
            Description = dto.Description?.Trim(),
            Status = dto.Status,
            DueDate = dto.DueDate!.Value,
            ProjectId = project!.Id,
            AssigneeId = assignee!.Id
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var response = new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId,
            ProjectName = project.Name,
            AssigneeId = task.AssigneeId,
            AssigneeName = assignee.Name
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = task.Id },
            response);
    }
}