using API.Models;
using FluentResults;

namespace API.Services.Interfaces;

public interface ILibraryService
{
    Task<List<BookResponse>> GetAllBooks();
    Task<BookResponse> GetBookById(string id);
    Task<List<BookResponse>> GetBooksByAuthor(string author);
    Task<BookResponse> GetBookByTitle(string name);
    Task<HashSet<string>> GetAllAuthors();
    Task<List<BookResponse>> GetReading();
    Task<List<BookResponse>> GetUserReadList();
    Task<List<BookResponse>> GetFinishedList();
    Task<Result> RemoveBook(string id, bool includeFile);

}