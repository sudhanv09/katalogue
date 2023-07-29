using HtmlAgilityPack;

namespace API.Services.Interfaces;

public interface IBookServer
{
   string GetBookFromStorage(string id);
   HtmlDocument GetEbookChapterBody(string id, int chapter);
}