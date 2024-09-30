using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("/search")]
public class BookSearchController : Controller
{
    private IOpenLibSearch _search { get; set; }
    public BookSearchController(IOpenLibSearch search)
    {
        _search = search;
    }
    
    [HttpGet]
    public async Task<IResult> BookSearch(string query)
    {
        var result = await _search.SearchBook(query);
        return Results.Ok(result);
    }
    
}