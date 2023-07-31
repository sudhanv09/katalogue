using System.Text;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("/read")]
public class ReadController : Controller
{
    public IBookServer _book { get; set; }
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
    public IActionResult GetChapter(string id, int chapter)
    {
        var bookText = _book.GetEbookChapterBody(id, chapter);
        var toBytes = Encoding.UTF8.GetBytes(bookText);

        return Content(Encoding.UTF8.GetString(toBytes), "text/html", Encoding.UTF8);
    }
    
    /// <summary>
    /// Get TOC of the book
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    
    [HttpGet("toc")]
    public IActionResult GetToc(string id)
    {
        var Toc = _book.GetToc(id);
        return Ok(Toc);
    }
    

}