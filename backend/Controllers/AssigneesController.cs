using GestorProyectos.Api.Data;
using GestorProyectos.Api.DTOs;
using GestorProyectos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace GestorProyectos.Api.Controllers;

[ApiController]
[Route("api/assignees")]
public class AssigneesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AssigneesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(List<AssigneeResponseDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AssigneeResponseDto>>> GetAll()
    {
        var assignees = await _context.Assignees
            .AsNoTracking()
            .OrderBy(assignee => assignee.Id)
            .Select(assignee => new AssigneeResponseDto
            {
                Id = assignee.Id,
                Name = assignee.Name,
                Email = assignee.Email
            })
            .ToListAsync();

        return Ok(assignees);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(
        typeof(AssigneeResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AssigneeResponseDto>> GetById(int id)
    {
        var assignee = await _context.Assignees
            .AsNoTracking()
            .Where(assignee => assignee.Id == id)
            .Select(assignee => new AssigneeResponseDto
            {
                Id = assignee.Id,
                Name = assignee.Name,
                Email = assignee.Email
            })
            .FirstOrDefaultAsync();

        if (assignee is null)
        {
            return NotFound();
        }

        return Ok(assignee);
    }

    [HttpPost]
    [ProducesResponseType(
        typeof(AssigneeResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AssigneeResponseDto>> Create(
        CreateAssigneeDto dto)
    {
        var name = dto.Name.Trim();
        var email = dto.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(name))
        {
            ModelState.AddModelError(
                nameof(dto.Name),
                "El nombre es obligatorio.");

            return ValidationProblem(ModelState);
        }

        var emailExists = await _context.Assignees
            .AnyAsync(assignee => assignee.Email == email);

        if (emailExists)
        {
            return DuplicateEmailConflict();
        }

        var assignee = new Assignee
        {
            Name = name,
            Email = email
        };

        _context.Assignees.Add(assignee);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is SqlException sqlException
                && (sqlException.Number == 2601
                    || sqlException.Number == 2627))
        {
            return DuplicateEmailConflict();
        }

        var response = new AssigneeResponseDto
        {
            Id = assignee.Id,
            Name = assignee.Name,
            Email = assignee.Email
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = assignee.Id },
            response);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(
        typeof(AssigneeResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AssigneeResponseDto>> Update(
        int id,
        UpdateAssigneeDto dto)
    {
        var assignee = await _context.Assignees.FindAsync(id);

        if (assignee is null)
        {
            return NotFound();
        }

        var name = dto.Name.Trim();
        var email = dto.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(name))
        {
            ModelState.AddModelError(
                nameof(dto.Name),
                "El nombre es obligatorio.");

            return ValidationProblem(ModelState);
        }

        var emailExists = await _context.Assignees
            .AnyAsync(other =>
                other.Id != id && other.Email == email);

        if (emailExists)
        {
            return DuplicateEmailConflict();
        }

        assignee.Name = name;
        assignee.Email = email;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is SqlException sqlException
                && (sqlException.Number == 2601
                    || sqlException.Number == 2627))
        {
            return DuplicateEmailConflict();
        }

        return Ok(new AssigneeResponseDto
        {
            Id = assignee.Id,
            Name = assignee.Name,
            Email = assignee.Email
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
        var assignee = await _context.Assignees.FindAsync(id);

        if (assignee is null)
        {
            return NotFound();
        }

        var hasTasks = await _context.Tasks
            .AnyAsync(task => task.AssigneeId == id);

        if (hasTasks)
        {
            return Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "No se puede eliminar el responsable.",
                detail: "El responsable tiene tareas relacionadas.");
        }

        _context.Assignees.Remove(assignee);

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
                title: "No se puede eliminar el responsable.",
                detail: "El responsable tiene registros relacionados que impiden eliminarlo.");
        }

        return NoContent();
    }

    private ConflictObjectResult DuplicateEmailConflict()
    {
        const string message =
            "Ya existe un responsable con este correo.";

        var problem = new ValidationProblemDetails(
            new Dictionary<string, string[]>
            {
                ["Email"] = new[] { message }
            })
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Correo electrónico duplicado.",
            Detail = message
        };

        return Conflict(problem);
    }
}