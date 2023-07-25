using API.Models;
using API.Models.Dto;

namespace API.Services.Interfaces;

public interface IUploadService
{
    Task<Response> HandleUpload(FileDto files);
    bool FileExists(IFormFile file);
    Book GetEpubMetadata(IFormFile file);
}