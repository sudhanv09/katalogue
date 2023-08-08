using System.Threading.Tasks;
using API.Services.Interfaces;
using Xunit;

namespace API.Test.ServicesTest;

public class UploadServiceTest
{
    private readonly IUploadService _upload;
    
    public UploadServiceTest()
    {
        
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
        
        
        
        
        // Act
        
    
        // Assert
    

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