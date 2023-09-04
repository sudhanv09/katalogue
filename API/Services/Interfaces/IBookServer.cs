using API.Models;
using HtmlAgilityPack;

namespace API.Services.Interfaces;

public interface IBookServer
{
   string GetBookFromStorage(string id);
   Task<string> GetEbookChapterBody(string id, int chapter);
   Task<string> GetBookCss(string id);
   List<string> GetToc(string id);
   Task<string> StartBook(string id);
   Task<string> NextChapter(string id);
   Task UpdateProgress(string id, int progress);
   Task MarkStatus(string id, ReadingStatus status);
}