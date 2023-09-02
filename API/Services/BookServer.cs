using System.Text;
using API.Data;
using API.Models;
using API.Services.Interfaces;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using VersOne.Epub;

namespace API.Services;

public class BookServer : IBookServer
{
    public AppDbContext _ctx { get; }
    private const string libPath = "/home/zeus/Katalogue/";

    public BookServer(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    // TODO: Unit Test
    public string GetBookFromStorage(string id)
    {
        // Each directory only has 1 file
        var path = Path.Combine(libPath, id);
        return Directory.GetFiles(path, "*.epub")[0];
    }
    
    public async Task<string> GetEbookChapterBody(string id, int chapter)
    {
        var bookPath = GetBookFromStorage(id);
        var book = await EpubReader.ReadBookAsync(bookPath);
        
        HtmlDocument document = new HtmlDocument();
        StringBuilder sb = new StringBuilder();
        document.LoadHtml(book.ReadingOrder[chapter].Content);
        
        var nodes = document.DocumentNode.SelectNodes("//body");

        foreach (var node in nodes)
        {
            sb.AppendLine(node.InnerHtml);
        }
        return sb.ToString();
    }

    public async Task<string> GetBookCss(string id)
    {
        var bookPath = GetBookFromStorage(id);
        var book = await EpubReader.ReadBookAsync(bookPath);
        StringBuilder sb = new StringBuilder();

        var bookCss = book.Content.Css.Local;
        foreach (var css in bookCss)
        {
            sb.AppendLine(css.Content);
        }

        return sb.ToString();
    }

    // TODO: Navigate to Headings
    public string GetToc(string id)
    {
        var bookPath = GetBookFromStorage(id);
        var book = EpubReader.ReadBook(bookPath);
        var titles = new StringBuilder();
        
        foreach (var item in book.Navigation)
        {
            // Navigation returns Headings
            titles.AppendLine(item.Title);
            
            // NestedItems has Sub-Headings
            foreach (var sub in item.NestedItems)
            {
                titles.AppendLine(sub.Title);
            }
        }
        return titles.ToString();
    }

    public async Task<string> StartBook(string id)
    {
        var bookProgress = await GetProgress(id);
        if (bookProgress == 0)
        {
            MarkStatus(id, ReadingStatus.Reading);
            
        }
        var content = await GetEbookChapterBody(id, bookProgress);
        return content;
    }

    public async Task<string> NextChapter(string id)
    {
        var bookProgress = await GetProgress(id);
        var trackProgress = bookProgress + 1;
        await UpdateProgress(id, trackProgress);
        return await GetEbookChapterBody(id, trackProgress);
    }

    public async Task<int> GetProgress(string id)
    {
        var isValidGuid = Guid.TryParse(id, out Guid newId);
        if (!isValidGuid)
            return 0; // TODO change the return to something better.
        
        var bookProgress = await _ctx.Books.Where(i => i.Id == newId).Select(p => p.Progress).FirstOrDefaultAsync();
        return bookProgress;
    }

    public async Task UpdateProgress(string id, int progress)
    {
        var bookProgress = new Book()
        {
            Id = Guid.Parse(id),
            Progress = progress
        };
        
        _ctx.Books.Attach(bookProgress);
        _ctx.Entry(bookProgress).Property(x => x.Progress).IsModified = true;
        await _ctx.SaveChangesAsync();
    }
    
    public async Task MarkStatus(string id, ReadingStatus status)
    {
        var bookStatus = new Book()
        {
            Id = Guid.Parse(id),
            Status = status
        };
        
        _ctx.Books.Attach(bookStatus);
        _ctx.Entry(bookStatus).Property(x => x.Status).IsModified = true;
        await _ctx.SaveChangesAsync();
    }
}