using API.Models;
using API.Models.Dto;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("/upload")]
public class UploadController : Controller
{
    private IUploadService _upload;
    public UploadController(IUploadService upload)
    {
        _upload = upload;
    }
    
    /// <summary>
    /// Add file to library
    /// </summary>
    /// <param name="dto"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<IResult> HandleIncomingFile([FromForm] FileDto dto)
    {
        if (!ModelState.IsValid)
            return Results.BadRequest("No file uploaded");
        
        foreach (var file in dto.file)
        {
            if (Path.GetExtension(file.FileName) != ".epub")
                return Results.BadRequest("Wrong File Extension. Epub Only");
            var response = await _upload.HandleUpload(file);
            if (response.IsFailed)
                return Results.BadRequest("Upload failed");
        }
        
        return Results.Ok();
    }
}