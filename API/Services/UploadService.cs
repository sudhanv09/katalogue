using API.Data;
using API.Models;
using API.Services.Interfaces;
using FluentResults;
using VersOne.Epub;

namespace API.Services;

public class UploadService(AppDbContext ctx) : IUploadService
{
    private static readonly string _libPath = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "/Katalogue/";
    private AppDbContext Ctx { get; set; } = ctx;

    public async Task<Result> HandleUpload(IFormFile file)
    {
            if (FileExists(file))
                return Result.Fail("File already exists");
         
            var bookData = GetEpubMetadata(file);
            
            // write to dir
            if (!Directory.Exists(_libPath))
                Directory.CreateDirectory(_libPath);
            var bookPath = Path.Combine(_libPath, bookData.Id.ToString());
            var writeDir = Directory.CreateDirectory(bookPath).ToString();
            var fullPath = Path.Combine(writeDir, file.FileName);
            
            await using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            CopyImagesToDisk(file, bookPath);
            
            // write to db
            Ctx.Books.Add(bookData);
            await Ctx.SaveChangesAsync();
        
        return Result.Ok();
    }
    
    private bool FileExists(IFormFile file)
    {
        var bookName = GetEpubMetadata(file);
        var exists = Ctx.Books.Any(t=>t.Title == bookName.Title);
        return exists;
    }

    private static Book GetEpubMetadata(IFormFile file)
    {
        var generateGuid = Guid.NewGuid();
        var epubData = EpubReader.ReadBook(file.OpenReadStream());
        var coverName = epubData.Content.Cover?.FilePath.Split('/').Last();
        var coverPath = $"{generateGuid}/{coverName}";
        var pageCount = GetPageCount(epubData);
        
        var bookData = new Book {
            Id = generateGuid,
            Title = epubData.Title,
            Author = epubData.Author,
            Description = epubData.Description,
            CoverPath = coverPath,
            Status = ReadingStatus.ToRead,
            TotalPages = pageCount
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

    private static int GetPageCount(EpubBook book)
    {
        var nav = book.Navigation;
        return nav.Count() > 1 ? nav.Count : nav[0].NestedItems.Count;
    }
}
