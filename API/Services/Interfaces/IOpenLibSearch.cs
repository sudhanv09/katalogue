using API.Models;

namespace API.Services.Interfaces;

public interface IOpenLibSearch
{
    Task<OLSearch> SearchBook(string query);
}