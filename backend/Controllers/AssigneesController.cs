using GestorProyectos.Api.Data;
using GestorProyectos.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
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
}