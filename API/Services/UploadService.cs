
using API.Data;
using API.Models;
using API.Services.Interfaces;
using VersOne.Epub;

namespace API.Services;

public class UploadService : IUploadService
{
    private const string libPath = "/home/zeus/Katalogue/";
    public AppDbContext _ctx { get; set; }
    
    public UploadService(AppDbContext ctx)
    {
        _ctx = ctx;
    }
    
    /*
     * HandleUpload has 2 functions. 
     * Save uploaded file to localstorage and track the file with DB
     */
    public async Task<Response> HandleUpload(FileDto files)
    {
        foreach (var file in files.file)
        {
            var generateGuid = Guid.NewGuid();
            var epubData = EpubReader.ReadBook(file.OpenReadStream());
        
            var bookData = new Book {
                Id = generateGuid,
                Title = epubData.Title,
                Author = epubData.Author,
                Description = epubData.Description,
                Status = ReadingStatus.ToRead
            };
        
            // write to db
            // _ctx.Books.Add(bookData);
            // await _ctx.SaveChangesAsync();
        
            // write to dir
            if (!Directory.Exists(libPath))
                Directory.CreateDirectory(libPath);
            
            var writeLocation = Directory.CreateDirectory(Path.Combine(libPath, generateGuid.ToString())).ToString();
            var fullPath = Path.Combine(writeLocation, file.FileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
        return new Response { Success = true };
    }
}