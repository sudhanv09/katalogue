namespace API.Models;

public class UserWishlist
{
    public Guid Id { get; set; }
    public List<Book> WishList { get; set; }
}