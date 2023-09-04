using System.Text.Json.Serialization;

namespace API.Models;

public class OLSearch
{
    [JsonPropertyName("numFound")]
    public int NumFound { get; set; }
    [JsonPropertyName("q")]
    public string Query { get; set; }
    [JsonPropertyName("docs")]
    public List<SearchResult> Result { get; set; }
}