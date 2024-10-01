using System.Text;
using API.Models;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("/read")]
public class ReadController : Controller
{
    private IBookServer _book { get; set; }
    public ReadController(IBookServer book)
    {
        _book = book;
    }

    /// <summary>
    /// Get specific chapter from a book
    /// </summary>
    /// <param name="id"></param>
    /// <param name="chapter"></param>
    /// <returns></returns>
    [HttpGet("{chapter}")]
    public async Task<IResult> GetChapter(string id, int chapter)
    {
        var bookText = await _book.GetEbookChapterBody(id, chapter);
        var toBytes = Encoding.UTF8.GetBytes(bookText);
        return Results.Content(Encoding.UTF8.GetString(toBytes), "text/html", Encoding.UTF8);
    }
    
    /// <summary>
    /// Get TOC of the book
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("toc")]
    public IResult GetToc(string id)
    {
        var toc = _book.GetToc(id);
        return Results.Ok(toc);
    }

    [HttpGet("image")]
    public async Task<IResult> GetImage(string img, string id)
    {
        var image = await _book.GetImageByName(img, id);
        if (image is null)
        {
            return Results.BadRequest("Not Found");
        }
        return Results.Ok(image);
    }

    /// <summary>
    /// Get css for the book
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("book-css")]
    public async Task<IResult> GetCss(string id)
    {
        var css = await _book.GetBookCss(id);
        return Results.Content(css, "text/css", Encoding.UTF8);
    }
    
    /// <summary>
    /// Start Reading a book from the beginning.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("start")]
    public async Task<IResult> StartBook(string id)
    {
        var start = await _book.StartBook(id);
        return Results.Content(start, "text/html", Encoding.UTF8);
    }
    
    /// <summary>
    /// Go to new chapter in the book
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("next")]
    public async Task<IResult> NextChapter(string id)
    {
        var next = await _book.NextChapter(id);
        return Results.Content(next, "text/html", Encoding.UTF8);
    }

    /// <summary>
    /// Go to prev chapter in the book
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("prev")]
    public async Task<IResult> PrevChapter(string id)
    {
        var prev = await _book.PrevChapter(id);
        return Results.Content(prev, "text/html", Encoding.UTF8);
    }
    
}