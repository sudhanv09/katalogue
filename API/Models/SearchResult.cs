using System.Text.Json.Serialization;

namespace API.Models;

public class SearchResult
{
    [JsonPropertyName("key")]
    public string Key { get; set; }
    [JsonPropertyName("title")]
    public string Title { get; set; }
    [JsonPropertyName("author_name")]
    public List<string> AuthorName { get; set; }
    [JsonPropertyName("first_publish_year")]
    public int FirstPublishedYear { get; set; }
    [JsonPropertyName("number_of_pages_median")]
    public int NumPages { get; set; }
    [JsonPropertyName("cover_i")]
    public int CoverId { get; set; }
    [JsonPropertyName("ratings_average")]
    public double  AvgRating { get; set; }
    [JsonPropertyName("subject")]
    public List<string> Subject { get; set; }
}