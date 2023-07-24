using API.Models;

namespace API.Services.Interfaces;

public interface IUploadService
{
    Task<Response> HandleUpload(FileDto files);
}