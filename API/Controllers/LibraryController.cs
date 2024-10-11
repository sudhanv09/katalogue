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
    public async Task<IResult> GetAllBooks()
    {
        return Results.Ok(await _lib.GetAllBooks());
    }
    
    /// <summary>
    /// Get Book with Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<IResult> GetTitleById(string id)
    {
        var response = await _lib.GetBookById(id);
        if (response is null)
            return Results.BadRequest("Invalid Id");
        return Results.Ok(response);
    }

    /// <summary>
    /// Get Book By Name
    /// </summary>
    /// <param name="name"></param>
    /// <returns></returns>
    [HttpGet("title")]
    public async Task<IResult> GetTitle(string name)
    {
        var result = await _lib.GetBookByTitle(name);
        if (result is null)
            return Results.NotFound("Incorrect Name");
        
        return Results.Ok(result);
    }

    /// <summary>
    /// Get All titles by author
    /// </summary>
    /// <param name="author"></param>
    /// <returns></returns>
    [HttpGet("author")]
    public async Task<IResult> GetAuthor(string author)
    {
        var result = await _lib.GetBooksByAuthor(author);
        if (result.Count == 0)
            return Results.NotFound("Author Not found");
        return Results.Ok(result);
    }
    
    /// <summary>
    /// Get author list
    /// </summary>
    /// <returns></returns>
    [HttpGet("author/list")]
    public async Task<IResult> GetAuthorList()
    {
        var result = await _lib.GetAllAuthors();
        if (result.Count == 0)
            return Results.NotFound("Empty List");
        return Results.Ok(result);
    }
    
    /// <summary>
    /// Get all books to be read
    /// </summary>
    /// <returns></returns>

    [HttpGet("to-read")]
    public async Task<List<BookResponse>> GetReadList()
    {
        return await _lib.GetUserReadList();
    }
    
    /// <summary>
    /// Get all the books which have been read 
    /// </summary>
    /// <returns></returns>
    [HttpGet("finished")]
    public async Task<List<BookResponse>> GetRead()
    {
        return await _lib.GetFinishedList();
    }
    
    /// <summary>
    /// Get all books currently being read
    /// </summary>
    /// <returns></returns>
    
    [HttpGet("reading")]
    public async Task<List<BookResponse>> GetReading()
    {
        return await _lib.GetReading();
    }
    
    /// <summary>
    /// Get books recently read
    /// </summary>
    /// <returns></returns>
    
    [HttpGet("reading")]
    public async Task<List<BookResponse>> GetRecent()
    {
        return await _lib.GetRecentBooks();
    }
    
    [HttpDelete("remove")]
    public async Task<IResult> RemoveBook(string id, bool includeFile)
    {
        var result = await _lib.RemoveBook(id, includeFile);
        if (result.IsFailed) return Results.Problem();

        return Results.Ok("Item deleted");
    }
}