﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("API.Models.Book", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("CoverPath")
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("LastRead")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Olid")
                        .HasColumnType("text");

                    b.Property<int>("Progress")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("TotalPages")
                        .HasColumnType("integer");

                    b.Property<Guid?>("UserWishlistId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("UserWishlistId");

                    b.ToTable("Books");
                });

            modelBuilder.Entity("API.Models.UserWishlist", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.ToTable("Wishlists");
                });

            modelBuilder.Entity("API.Models.Book", b =>
                {
                    b.HasOne("API.Models.UserWishlist", null)
                        .WithMany("WishList")
                        .HasForeignKey("UserWishlistId");
                });

            modelBuilder.Entity("API.Models.UserWishlist", b =>
                {
                    b.Navigation("WishList");
                });
#pragma warning restore 612, 618
        }
    }
}
