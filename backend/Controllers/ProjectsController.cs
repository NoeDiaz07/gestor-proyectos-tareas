using GestorProyectos.Api.Data;
using GestorProyectos.Api.DTOs;
using GestorProyectos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace GestorProyectos.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectResponseDto>>> GetAll()
    {
        var projects = await _context.Projects
            .AsNoTracking()
            .OrderBy(project => project.Id)
            .Select(project => new ProjectResponseDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                StartDate = project.StartDate
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProjectResponseDto>> GetById(int id)
    {
        var project = await _context.Projects
            .AsNoTracking()
            .Where(project => project.Id == id)
            .Select(project => new ProjectResponseDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                StartDate = project.StartDate
            })
            .FirstOrDefaultAsync();

        if (project is null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    [HttpPost]
    [ProducesResponseType(
        typeof(ProjectResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProjectResponseDto>> Create(
        CreateProjectDto dto)
    {
        var project = new Project
        {
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            StartDate = dto.StartDate!.Value
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        var response = new ProjectResponseDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            StartDate = project.StartDate
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = project.Id },
            response);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(
        typeof(ProjectResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectResponseDto>> Update(
        int id,
        UpdateProjectDto dto)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project is null)
        {
            return NotFound();
        }

        var newStartDate = dto.StartDate!.Value;

        var hasTasksBeforeStartDate = await _context.Tasks
            .AnyAsync(task =>
                task.ProjectId == id
                && task.DueDate < newStartDate);

        if (hasTasksBeforeStartDate)
        {
            ModelState.AddModelError(
                nameof(dto.StartDate),
                "La fecha de inicio no puede ser posterior al vencimiento de una tarea del proyecto.");

            return ValidationProblem(ModelState);
        }

        project.Name = dto.Name.Trim();
        project.Description = dto.Description?.Trim();
        project.StartDate = newStartDate;

        await _context.SaveChangesAsync();

        return Ok(new ProjectResponseDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            StartDate = project.StartDate
        });
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _context.Projects.FindAsync(id);

        if (project is null)
        {
            return NotFound();
        }

        var hasTasks = await _context.Tasks
            .AnyAsync(task => task.ProjectId == id);

        if (hasTasks)
        {
            return Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "No se puede eliminar el proyecto.",
                detail: "El proyecto tiene tareas relacionadas.");
        }

        _context.Projects.Remove(project);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is SqlException sqlException
                && sqlException.Number == 547)
        {
            return Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "No se puede eliminar el proyecto.",
                detail: "El proyecto tiene registros relacionados que impiden eliminarlo.");
        }

        return NoContent();
    }
}