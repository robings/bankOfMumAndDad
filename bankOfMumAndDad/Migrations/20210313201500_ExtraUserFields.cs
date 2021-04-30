using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bankOfMumAndDad.Migrations
{
    public partial class ExtraUserFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DelayInMs",
                table: "Users",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastFailedLogin",
                table: "Users",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastSuccessfulLogin",
                table: "Users",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DelayInMs",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastFailedLogin",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastSuccessfulLogin",
                table: "Users");
        }
    }
}
