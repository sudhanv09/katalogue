using System.Threading.Tasks;
using API.Models;
using API.Services.Interfaces;
using Xunit;

namespace API.Test.ServicesTest;

public class LibraryManagerServiceTest
{
    private readonly ILibraryService _library;
    public LibraryManagerServiceTest()
    {
       
    }

    [Fact]
    public async Task GetBookById_Returns_ValidResponse()
    {
        // Arrange
        
    }
    
    [Fact]
    public async Task GetBookById_Returns_BadRequest()
    {
        // Arrange
        var bookId = "30e1ec20-e97b-4906-a663-147c1f8d02";
        Book returnVal = null;
        
    }

    [Fact]
    public async Task GetBookByTitle_Returns_ValidResponse()
    {
        
    }
}