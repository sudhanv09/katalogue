using API.Models;

namespace API.Services.Interfaces;

public interface ILibraryService
{
    Task<List<Book>> GetAllBooks();
    Task<Book> GetBookById(string id);
    Task<List<Book>> GetBooksByAuthor(string author);
    Task<Book> GetBookByTitle(string name);
    
    Task<List<Book>> GetReading();
    Task<List<Book>> GetUserReadList();
    Task<List<Book>> GetFinishedList();

    Task MarkStatus(string id, ReadingStatus status);
}