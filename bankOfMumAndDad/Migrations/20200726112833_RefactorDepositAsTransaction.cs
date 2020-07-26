using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bankOfMumAndDad.Migrations
{
    public partial class RefactorDepositAsTransaction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Deposits");

            migrationBuilder.AddColumn<decimal>(
                name: "CurrentBalance",
                table: "Accounts",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Amount = table.Column<decimal>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Comments = table.Column<string>(nullable: true),
                    Deleted = table.Column<bool>(nullable: false),
                    AccountId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_AccountId",
                table: "Transactions",
                column: "AccountId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropColumn(
                name: "CurrentBalance",
                table: "Accounts");

            migrationBuilder.CreateTable(
                name: "Deposits",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountId = table.Column<long>(type: "bigint", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
    }
}
