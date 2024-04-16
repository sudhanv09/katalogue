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
    
    
    /// <summary>
    /// Get all the books in your library
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<IActionResult> GetAllBooks()
    {
        return Ok(await _lib.GetAllBooks());
    }
    
    /// <summary>
    /// Get Book with Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTitleById(string id)
    {
        var response = await _lib.GetBookById(id);
        if (response is null)
            return BadRequest("Invalid Id");
        return Ok(response);
    }

    /// <summary>
    /// Get Book By Name
    /// </summary>
    /// <param name="name"></param>
    /// <returns></returns>
    [HttpGet("title")]
    public async Task<IActionResult> GetTitle(string name)
    {
        var result = await _lib.GetBookByTitle(name);
        if (result is null)
            return NotFound("Incorrect Name");
        
        return Ok(result);
    }

    /// <summary>
    /// Get All titles by author
    /// </summary>
    /// <param name="author"></param>
    /// <returns></returns>
    [HttpGet("author")]
    public async Task<IActionResult> GetAuthor(string author)
    {
        var result = await _lib.GetBooksByAuthor(author);
        if (result.Count == 0)
            return NotFound("Author Not found");
        return Ok(result);
    }
    
    /// <summary>
    /// Get author list
    /// </summary>
    /// <returns></returns>
    [HttpGet("authorlist")]
    public async Task<IActionResult> GetAuthorList()
    {
        var result = await _lib.GetAllAuthors();
        if (result.Count == 0)
            return NotFound("Empty List");
        return Ok(result);
    }
    
    /// <summary>
    /// Get all books to be read
    /// </summary>
    /// <returns></returns>

    [HttpGet("to-read")]
    public async Task<List<Book>> GetReadList()
    {
        return await _lib.GetUserReadList();
    }
    
    /// <summary>
    /// Get all the books which have been read 
    /// </summary>
    /// <returns></returns>
    [HttpGet("finished")]
    public async Task<List<Book>> GetRead()
    {
        return await _lib.GetFinishedList();
    }
    
    /// <summary>
    /// Get all books currently being read
    /// </summary>
    /// <returns></returns>
    
    [HttpGet("reading")]
    public async Task<List<Book>> GetReading()
    {
        return await _lib.GetReading();
    }
}