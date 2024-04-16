using System.Drawing;
using API.Data;
using API.Models;
using API.Models.Dto;
using API.Services.Interfaces;
using VersOne.Epub;

namespace API.Services;

public class UploadService : IUploadService
{
    const string libPath = "/home/zeus/Katalogue/";
    private AppDbContext _ctx { get; set; }
    
    public UploadService(AppDbContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task<Response> HandleUpload(FileDto files)
    {
        foreach (var file in files.file)
        {
            if (FileExists(file))
                return new Response { Success = false, ErrorCode = "3", Error = "File already exists" };
         
            var bookData = GetEpubMetadata(file);
            
            // write to dir
            if (!Directory.Exists(libPath))
                Directory.CreateDirectory(libPath);

            var bookPath = Path.Combine(libPath, bookData.Id.ToString());
            var writeDir = Directory.CreateDirectory(bookPath).ToString();
            
            var fullPath = Path.Combine(writeDir, file.FileName);
            await using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            CopyImagesToDisk(file, bookPath);
            
            // write to db
            _ctx.Books.Add(bookData);
            await _ctx.SaveChangesAsync();
        }
        return new Response {Success = true, SuccessMessage = "Uploaded all files successfully"};
    }
    
    private bool FileExists(IFormFile file)
    {
        var bookName = GetEpubMetadata(file);
        var exists = _ctx.Books.Any(t=>t.Title == bookName.Title);
        return exists;
    }

    private static Book GetEpubMetadata(IFormFile file)
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
        return bookData;
    }

    private static void CopyImagesToDisk(IFormFile file, string path)
    {
        var book = EpubReader.ReadBook(file.OpenReadStream());
        var imgList = book.Content.Images.Local;

        // Image path can be folder/image.jpg or image.jpg
        foreach (var img in imgList)
        {
            var tmp = img.Key.Contains('/') ? img.Key.Split('/')[1] : img.Key;
            var writePath = Path.Combine(path, tmp);
            File.WriteAllBytes(writePath, img.Content);
        }
    }
}
