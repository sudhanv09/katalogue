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
    private AppDbContext _ctx { get; }
    private static readonly string _libPath = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "/Katalogue/";

    public BookServer(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    private static string GetBookFromStorage(string id)
    {
        // Each directory has only 1 epub file
        var path = Path.Combine(_libPath, id);
        return Directory.GetFiles(path, "*.epub")[0];
    }
    
    public async Task<string> GetEbookChapterBody(string id, int chapter)
    {
        var bookPath = GetBookFromStorage(id);
        var book = await EpubReader.ReadBookAsync(bookPath);
        
        var document = new HtmlDocument();
        document.LoadHtml(book.ReadingOrder[chapter].Content);
        
        InterceptImgTags(id, document);
        var nodes = document.DocumentNode.SelectNodes("//body");

        var sb = new StringBuilder();
        foreach (var node in nodes)
        {
            sb.AppendLine(node.InnerHtml);
        }
        return sb.ToString();
    }

    private static void InterceptImgTags(string id, HtmlDocument document)
    {
        var imgNodes = document.DocumentNode.SelectNodes("//body//img");
        if (imgNodes != null)
        {
            foreach (var img in imgNodes)
            {
                UpdateImageSource(img, "src", id);
            }
        }
        
        var svgNodes = document.DocumentNode.SelectNodes("//svg//image");
        if (svgNodes != null)
        {
            foreach (var svg in svgNodes)
            {
                UpdateImageSource(svg, "src", id);
                UpdateImageSource(svg, "xlink:href", id);
            }
        }
    }

    private static void UpdateImageSource(HtmlNode node, string attributeName, string id)
    {
        var currSrc = node.GetAttributeValue(attributeName, "");
        if (string.IsNullOrEmpty(currSrc))
            return;

        if (currSrc.Contains('/'))
        {
            var imgName = currSrc.Split('/').Last();
            node.SetAttributeValue(attributeName, $"http://localhost:5050/read/image?img={imgName}&id={id}");
        }
        else
        {
            node.SetAttributeValue(attributeName, $"http://localhost:5050/read/image?img={currSrc}");
        }
    }

    public async Task<string> GetBookCss(string id)
    {
        var bookPath = GetBookFromStorage(id);
        var book = await EpubReader.ReadBookAsync(bookPath);
        var sb = new StringBuilder();

        var bookCss = book.Content.Css.Local;
        foreach (var css in bookCss)
        {
            sb.AppendLine(css.Content);
        }

        return sb.ToString();
    }
    
    public List<string> GetToc(string id)
    {
        var bookPath = GetBookFromStorage(id);
        var book = EpubReader.ReadBook(bookPath);
        var titles = new List<string>();
        
        foreach (var item in book.Navigation)
        {
            // Navigation returns Headings
            titles.Add(item.Title);

            if (item.NestedItems.Count >= 0)
                titles.AddRange(item.NestedItems.Select(sub => sub.Title));
        }
        return titles;
    }

    public async Task<byte[]> GetImageByName(string imgName, string id)
    {
        var path = Path.Combine(_libPath, id);
        var files =  Directory.GetFiles(path, imgName, SearchOption.AllDirectories)
            .Where(s => s.EndsWith(".jpg") || s.EndsWith("jpeg") || s.EndsWith("png"));

        if (!files.Any())
        {
            return null;
        }

        var imgToByte = await File.ReadAllBytesAsync(files.First());
        return imgToByte;
    }

    public async Task<string> StartBook(string id)
    {
        var bookProgress = await GetProgress(id);
        if (bookProgress == 0)
        {
            await MarkStatus(id, ReadingStatus.Reading);
        }

        await UpdateReadTime(id);
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
    
    public async Task<string> PrevChapter(string id)
    {
        var bookProgress = await GetProgress(id);
        var trackProgress = bookProgress - 1;
        await UpdateProgress(id, trackProgress);
        return await GetEbookChapterBody(id, trackProgress);
    }

    private async Task<int> GetProgress(string id)
    {
        var isValidGuid = Guid.TryParse(id, out var newId);
        if (!isValidGuid)
            return 0; // TODO change the return to something better.
        
        var bookProgress = await _ctx.Books
            .Where(i => i.Id == newId)
            .Select(p => p.Progress)
            .FirstOrDefaultAsync();
        return bookProgress;
    }

    private async Task UpdateReadTime(string id)
    {
        var book = await _ctx.Books.FindAsync(Guid.Parse(id));
        if (book != null)
        {
            book.LastRead = DateTime.UtcNow;
            await _ctx.SaveChangesAsync();
        }
    }

    private async Task UpdateProgress(string id, int progress)
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
    
    private async Task MarkStatus(string id, ReadingStatus status)
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