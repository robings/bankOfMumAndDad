using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bankOfMumAndDad.Migrations
{
    public partial class AddedDepositEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "OpeningBalance",
                table: "Accounts",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Accounts",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Deposits",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Amount = table.Column<decimal>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    Type = table.Column<string>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false),
                    AccountId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Deposits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Deposits_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Deposits_AccountId",
                table: "Deposits",
                column: "AccountId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Deposits");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Accounts");

            migrationBuilder.AlterColumn<double>(
                name: "OpeningBalance",
                table: "Accounts",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal));
        }
    }
}
