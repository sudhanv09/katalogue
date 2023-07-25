namespace API.Models;

public class Response
{
    public bool Success { get; set; }
    public string? SuccessMessage { get; set; }
    public string ErrorCode { get; set; }
    public string Error { get; set; }
}