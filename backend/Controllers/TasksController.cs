using GestorProyectos.Api.Data;
using GestorProyectos.Api.DTOs;
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
}