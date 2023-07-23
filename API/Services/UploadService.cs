
using API.Data;
using API.Models;
using API.Services.Interfaces;
using VersOne.Epub;

namespace API.Services;

public class UploadService : IUploadService
{
    private const string libPath = "/hdd/zeus/Katalogue/";
    public AppDbContext _ctx { get; set; }
    
    public UploadService(AppDbContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task<Response> HandleUpload(IFormFile file)
    {
        var bookData = new Book();
        var generateGuid = Guid.NewGuid();
        var epubData = EpubReader.ReadBook(file.OpenReadStream());

        bookData.Id = generateGuid;
        bookData.Title = epubData.Title;
        bookData.Author = epubData.Author;
        bookData.Description = epubData.Description;
        
        // write to db
        
        
        // write to dir
        if (!Directory.Exists(libPath))
            Directory.CreateDirectory(libPath);

        var writeLocation = Directory.CreateDirectory(libPath + $"{generateGuid}/");
        using (var stream = new FileStream(writeLocation.ToString(), FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return new Response { Success = true };
    }
}