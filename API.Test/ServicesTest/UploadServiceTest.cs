using System;
using System.Threading.Tasks;
using API.Models;
using API.Services.Interfaces;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace API.Test.ServicesTest;

public class UploadServiceTest
{
    private readonly IUploadService _upload;
    
    public UploadServiceTest()
    {
        _upload = A.Fake<IUploadService>();
    }

    [Fact]
    public async Task HandleUpload_Returns_ValidResponse()
    {
        // Arrange
        
        // Act
        
        // Assert
    }
    
    [Fact]
    public async Task HandleUpload_Returns_FileExistsError()
    {
        // Arrange
        
        // Act
        
        // Assert
    }

    [Fact]
    public void FileExists_Returns_True()
    {
        // Arrange
        var fakeFormFile = A.Fake<IFormFile>();
        A.CallTo(() => fakeFormFile.FileName).Returns("example.epub");

        // Create some test data for the fake IBookContext
        var fakeBooks = new[]
        {
            new Book { Id = Guid.NewGuid(), Title = "Sample Book 1" },
            new Book { Id = Guid.NewGuid(), Title = "Sample Book 2" },
        };
        
        
        
        // Act
        var result = _upload.FileExists(fakeFormFile);
    
        // Assert
        result.Should().BeTrue();

    }
    
    [Fact]
    public void FileExists_Returns_False()
    {
        // Arrange
        
        // Act
        
        // Assert
    }
    
    [Fact]
    public void GetEpubMetadata_Returns_ValidResult()
    {
        // Arrange
        
        // Act
        
        // Assert
    }
}