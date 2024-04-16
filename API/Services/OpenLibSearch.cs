using System.Text.Json;
using System.Web;
using API.Models;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Services;

public class OpenLibSearch : IOpenLibSearch
{
    const string OLUrl = "https://openlibrary.org/search.json";
    
    public async Task<OLSearch> SearchBook(string query)
    {
        var urlString = UrlBuilder(query);
        using (HttpClient client = new HttpClient())
        {
            HttpResponseMessage responseMessage = await client.GetAsync(urlString);

            Stream request = await responseMessage.Content.ReadAsStreamAsync();
            var result = await JsonSerializer.DeserializeAsync<OLSearch>(request);
            return result;
        };
    }
    private static string UrlBuilder(string query)
    {
        var uriBuilder = new UriBuilder(OLUrl);
        var queryString = HttpUtility.ParseQueryString(uriBuilder.Query);
        queryString["q"] = query;
        uriBuilder.Query = queryString.ToString();
        return uriBuilder.ToString();
    }
}