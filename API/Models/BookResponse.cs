namespace API.Models;

public class BookResponse
{
    public Guid Id { get; set; }
    public string? Olid { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string? Description { get; set; }
    public byte[]? Cover { get; set; }
    public ReadingStatus Status { get; set; }
    public int Progress { get; set; }
    public int TotalPages { get; set; }
    public DateTime? LastRead { get; set; }
}