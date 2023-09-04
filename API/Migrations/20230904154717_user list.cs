using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class userlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserWishlistId",
                table: "Books",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Wishlists",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wishlists", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Books_UserWishlistId",
                table: "Books",
                column: "UserWishlistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Wishlists_UserWishlistId",
                table: "Books",
                column: "UserWishlistId",
                principalTable: "Wishlists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Wishlists_UserWishlistId",
                table: "Books");

            migrationBuilder.DropTable(
                name: "Wishlists");

            migrationBuilder.DropIndex(
                name: "IX_Books_UserWishlistId",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "UserWishlistId",
                table: "Books");
        }
    }
}
