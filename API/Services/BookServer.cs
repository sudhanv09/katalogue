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

    public HtmlDocument GetEbookChapterBody(string id, int chapter)
    {
        var bookPath = GetBookFromStorage(id);
        var book = EpubReader.ReadBook(bookPath);
        HtmlDocument document = new HtmlDocument();
        
        document.LoadHtml(book.ReadingOrder[chapter].Content);
        document.DocumentNode.SelectNodes("//body");

        return document;
    }
    
    
}