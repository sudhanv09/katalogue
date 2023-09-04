using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("/search")]
public class BookSearchController : Controller
{
    public IOpenLibSearch _search { get; set; }
    public BookSearchController(IOpenLibSearch search)
    {
        _search = search;
    }
    
    [HttpGet]
    public async Task<IActionResult> BookSearch(string query)
    {
        var result = await _search.SearchBook(query);
        return Ok(result);
    }
    
}