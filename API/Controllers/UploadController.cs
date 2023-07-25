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
    
    [HttpPost]
    public async Task<IActionResult> HandleIncomingFile([FromForm] FileDto dto)
    {
        if (dto is null)
            return BadRequest(new Response{Success = false, ErrorCode = "1", Error = "No file uploaded"});
        
        foreach (var file in dto.file)
        {
            if (Path.GetExtension(file.FileName) != ".epub")
                return BadRequest(new Response { Success = false, ErrorCode = "2", Error = "Wrong File Extension. Epub Only" });
        }
        
        var response = await _upload.HandleUpload(dto);
        if (!response.Success)
            return BadRequest(new Response { Error = "some shit happened" });
        
        return Ok(response);
    }
}