using API.Models;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("library")]
public class LibraryController : Controller
{
    public LibraryController(ILibraryService lib)
    {
        _lib = lib;
    }
    public ILibraryService _lib { get; set; }
    
    [HttpGet]
    public async Task<IActionResult> GetAllBooks()
    {
        return Ok(await _lib.GetAllBooks());
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTitleById(string id)
    {
        var response = await _lib.GetBookById(id);
        if (response == null)
            return BadRequest("Invalid Id");
        return Ok(response);
    }

    [HttpGet("title")]
    public async Task<IActionResult> GetTitle(string name)
    {
        var result = await _lib.GetBookByTitle(name);
        if (result is null)
            return NotFound("Incorrect Name");
        
        return Ok(result);
    }

    [HttpGet("author")]
    public async Task<IActionResult> GetAuthor(string author)
    {
        var result = await _lib.GetBooksByAuthor(author);
        if (result.Count == 0)
            return NotFound("Author Not found");
        return Ok(result);
    }

    [HttpGet("to-read")]
    public async Task<List<Book>> GetReadList()
    {
        return await _lib.GetUserReadList();
    }
    
    [HttpGet("finished")]
    public async Task<List<Book>> GetRead()
    {
        return await _lib.GetFinishedList();
    }
    
    [HttpGet("reading")]
    public async Task<List<Book>> GetReading()
    {
        return await _lib.GetReading();
    }
}