using API.Models;
using API.Models.Dto;
using FluentResults;
using VersOne.Epub;

namespace API.Services.Interfaces;

public interface IUploadService
{
    Task<Result> HandleUpload(IFormFile files);
}