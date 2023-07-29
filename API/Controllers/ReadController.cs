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

    [HttpGet("{chapter}")]
    public IActionResult GetChapter(string id, int chapter)
    {
        var bookText = _book.GetEbookChapterBody(id, chapter);
        var toBytes = Encoding.UTF8.GetBytes(bookText);

        return Content(Encoding.UTF8.GetString(toBytes), "text/html", Encoding.UTF8);
    }
    
    [HttpGet("toc")]
    public IActionResult GetToc(string id)
    {
        var Toc = _book.GetToc(id);
        return Ok(Toc);
    }
    

}