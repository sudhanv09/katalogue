using System;
using System.Threading.Tasks;
using API.Controllers;
using API.Models;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Test.ServicesTest;

public class LibraryServiceTest
{
    private readonly ILibraryService _library;
    public LibraryServiceTest()
    {
        _library = A.Fake<ILibraryService>();
    }

    [Fact]
    public async Task GetBookById_Returns_ValidResponse()
    {
        // Arrange
        var bookId = Guid.NewGuid();
        var bookData = A.Fake<Book>();

        A.CallTo(() => _library.GetBookById(bookId.ToString())).Returns(bookData);
        var controller = new LibraryController(_library);

        // Act
        var result = controller.GetTitleById(bookId.ToString()).Result;
        
        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }
    
    [Fact]
    public async Task GetBookById_Returns_BadRequest()
    {
        // Arrange
        var bookId = "30e1ec20-e97b-4906-a663-147c1f8d02";
        Book returnVal = null;
        A.CallTo(() => _library.GetBookById(bookId.ToString())).Returns(returnVal);
        var controller = new LibraryController(_library);

        // Act
        var result = controller.GetTitleById(bookId).Result;
        
        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GetBookByTitle_Returns_ValidResponse()
    {
        
    }
}