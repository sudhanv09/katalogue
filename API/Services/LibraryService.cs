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
        return await _ctx.Books.FirstOrDefaultAsync(i => i.Id.Equals(id));
    }

    public async Task<Book> GetAuthor(string author)
    {
        return await _ctx.Books.FirstOrDefaultAsync(a => a.Author == author);
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

    public async Task MarkStatus(string id, ReadingStatus status)
    {
        var book = await _ctx.Books.FirstOrDefaultAsync(i => i.Id.Equals(id));
        book.Status = status;
        await _ctx.SaveChangesAsync();
    }
}