using FluentResults;

namespace API.Services.Interfaces;

public interface IUploadService
{
    Task<Result> HandleUpload(IFormFile files);
}