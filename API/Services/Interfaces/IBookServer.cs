using HtmlAgilityPack;

namespace API.Services.Interfaces;

public interface IBookServer
{
   string GetBookFromStorage(string id);
   string GetEbookChapterBody(string id, int chapter);
   string GetToc(string id);
}