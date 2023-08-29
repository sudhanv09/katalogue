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
    
    public string GetEbookChapterBody(string id, int chapter)
    {
        var bookPath = GetBookFromStorage(id);
        var book = EpubReader.ReadBook(bookPath);
        
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

    public string StartBook(string id)
    {
        var markStart = MarkStatus(id, ReadingStatus.Reading);
        
        // Start from the beginning
        var bookContent = GetEbookChapterBody(id, 0);
        return bookContent;
    }

    public async Task<string> NextChapter(string id)
    {
        var isValidGuid = Guid.TryParse(id, out Guid newId);
        if (!isValidGuid)
            return null;
        
        var bookProgress = await _ctx.Books.Where(i => i.Id == newId).Select(p => p.Progress).FirstOrDefaultAsync();
        var trackProgress = bookProgress + 1;
        await UpdateProgress(id, trackProgress);
        return GetEbookChapterBody(id, trackProgress);
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