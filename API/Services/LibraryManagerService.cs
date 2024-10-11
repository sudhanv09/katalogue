using API.Data;
using API.Models;
using API.Services.Interfaces;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class LibraryManagerService : ILibraryService
{
    private AppDbContext Ctx { get; set; }
    private readonly string _libPath = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "/Katalogue/";

    public LibraryManagerService(AppDbContext ctx)
    {
        Ctx = ctx;
    }
    public async Task<List<BookResponse>> GetAllBooks()
    {
        var books = await Ctx.Books.ToListAsync();
        return books.Select(ResolveResponse).ToList();
    }

    public async Task<BookResponse> GetBookById(string id)
    {
        var isValidGuid = Guid.TryParse(id, out var newId);
        if (!isValidGuid)
            return null;
        
        var book = await Ctx.Books.FirstOrDefaultAsync(i => i.Id == newId);
        return ResolveResponse(book);
    }

    public async Task<List<BookResponse>> GetBooksByAuthor(string author)
    {
        var authors = await Ctx.Books.Where(a => a.Author == author).ToListAsync();
        return authors.Select(ResolveResponse).ToList();
    }

    public async Task<BookResponse> GetBookByTitle(string name)
    {
        var title = await Ctx.Books.FirstOrDefaultAsync(a => a.Title == name);
        return ResolveResponse(title);
    }

    public async Task<HashSet<string>> GetAllAuthors()
    {
        var authorlist = await Ctx.Books.Select(a => a.Author).ToListAsync();
        var unique = new HashSet<string>(authorlist);

        return unique;
    }

    public async Task<List<BookResponse>> GetReading()
    {
        var reading = await Ctx.Books.Where(b => b.Status == ReadingStatus.Reading).ToListAsync();
        return reading.Select(ResolveResponse).ToList();
    }

    public async Task<List<BookResponse>> GetUserReadList()
    {
        var readlist = await Ctx.Books.Where(b => b.Status == ReadingStatus.ToRead).ToListAsync();
        return readlist.Select(ResolveResponse).ToList();
    }

    public async Task<List<BookResponse>> GetFinishedList()
    {
        var finished = await Ctx.Books.Where(b => b.Status == ReadingStatus.Finished).ToListAsync();
        return finished.Select(ResolveResponse).ToList();
    }

    public async Task<List<BookResponse>> GetRecentBooks()
    {
        var recent = await Ctx.Books
            .Where(b => b.Status == ReadingStatus.Reading)
            .OrderByDescending(r => r.LastRead)
            .Take(10).
            ToListAsync();
        return recent.Select(ResolveResponse).ToList();
    }

    public async Task<Result> RemoveBook(string id, bool includeFiles)
    {
        var validId = Guid.TryParse(id, out var newId);
        if (!validId) return Result.Fail("Invalid id");

        var book = await Ctx.Books.FindAsync(newId);
        if (book == null) return Result.Fail("Book not found");
        
        // Remove from path
        if (includeFiles)
            Directory.Delete(_libPath + book.Id, true);
        
        Ctx.Books.Remove(book);
        await Ctx.SaveChangesAsync();
        return Result.Ok();
    }

    private BookResponse ResolveResponse(Book book)
    {
        var cover = File.ReadAllBytes(_libPath + book.CoverPath);
        
        return new BookResponse
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Cover = cover,
            Description = book.Description,
            Progress = book.Progress,
            Status = book.Status,
            TotalPages = book.TotalPages,
            LastRead = book.LastRead
        };

    }
}