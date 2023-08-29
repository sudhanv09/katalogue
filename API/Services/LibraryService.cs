using API.Data;
using API.Models;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class LibraryService : ILibraryService
{
    private AppDbContext _ctx { get; set; }

    public LibraryService(AppDbContext ctx)
    {
        _ctx = ctx;
    }
    public async Task<List<Book>> GetAllBooks()
    {
        return await _ctx.Books.ToListAsync();
    }

    public async Task<Book> GetBookById(string id)
    {
        var isValidGuid = Guid.TryParse(id, out Guid newId);
        if (!isValidGuid)
            return null;
        return await _ctx.Books.FirstOrDefaultAsync(i => i.Id == newId);
    }

    public async Task<List<Book>> GetBooksByAuthor(string author)
    {
        return await _ctx.Books.Where(a => a.Author == author).ToListAsync();
    }

    public async Task<Book> GetBookByTitle(string name)
    {
        return await _ctx.Books.FirstOrDefaultAsync(a => a.Title == name);
    }

    public async Task<HashSet<string>> GetAllAuthors()
    {
        var authorlist = await _ctx.Books.Select(a => a.Author).ToListAsync();
        var unique = new HashSet<string>(authorlist);

        return unique;
    }

    public async Task<List<Book>> GetReading()
    {
        return await _ctx.Books.Where(b => b.Status == ReadingStatus.Reading).ToListAsync();
    }

    public async Task<List<Book>> GetUserReadList()
    {
        return await _ctx.Books.Where(b => b.Status == ReadingStatus.ToRead).ToListAsync();
    }

    public async Task<List<Book>> GetFinishedList()
    {
        return await _ctx.Books.Where(b => b.Status == ReadingStatus.Finished).ToListAsync();
    }

    
}