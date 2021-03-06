
using bankOfMumAndDad.Source;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using NUnit.Framework;
using System.Data.Common;
using bankOfMumAndDad.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;
using System;

namespace bankOfMumAndDad.Tests
{
    public class AccountControllerTests
    {
        [Test]
        public async Task testTest()
        {
            await using var connection = new SqliteConnection("DataSource=:memory");
            await using var context = BuildDataContext(connection);

            connection.Open();
            context.Database.EnsureCreated();
            var account = new Account
            {
                FirstName = "Cuthbert",
                LastName = "Dibble",
                OpeningBalance = 0,
                CurrentBalance = 150,
                Deleted = false,
            };

            var account2 = new Account
            {
                FirstName = "Cuthber",
                LastName = "Dibble",
                OpeningBalance = 0,
                CurrentBalance = 150,
                Deleted = false,
            };

            context.Add(account2);
            context.SaveChanges();

            var savedAccount = context.Accounts.FirstAsync().Result;

            Assert.That(savedAccount.FirstName, Is.EqualTo(account.FirstName));
            context.Dispose();
        }

        private static DataContext BuildDataContext(DbConnection connection) => new DataContext(new DbContextOptionsBuilder().UseSqlite(connection).Options);
    }
}
