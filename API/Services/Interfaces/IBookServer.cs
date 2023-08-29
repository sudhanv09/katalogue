using API.Models;
using HtmlAgilityPack;

namespace API.Services.Interfaces;

public interface IBookServer
{
   string GetBookFromStorage(string id);
   string GetEbookChapterBody(string id, int chapter);
   string GetToc(string id);
   string StartBook(string id);
   Task<string> NextChapter(string id);
   Task UpdateProgress(string id, int progress);
   Task MarkStatus(string id, ReadingStatus status);
}