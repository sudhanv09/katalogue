using System.Text;
using API.Services.Interfaces;
using HtmlAgilityPack;
using VersOne.Epub;

namespace API.Services;

public class BookServer : IBookServer
{
    private const string libPath = "/home/zeus/Katalogue/";

    // TODO: Unit Test
    public string GetBookFromStorage(string id)
    {
        // Each directory only has 1 file
        return Directory.GetFiles(Path.Combine(libPath, id))[0];
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
}