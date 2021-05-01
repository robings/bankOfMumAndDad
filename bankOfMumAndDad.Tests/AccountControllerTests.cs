using System.Collections.Generic;
using System.Threading.Tasks;
using bankOfMumAndDad.Controllers;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Responses;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace bankOfMumAndDad.Tests
{
    public class AccountControllerTests
    {
        [Test]
        public async Task GetAccountsGetsAllAccounts()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = false,
                },
                new Account
                {
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = false,
                },
                new Account
                {
                    FirstName = "Pew",
                    LastName = "Pew",
                    OpeningBalance = 0,
                    CurrentBalance = 300,
                    Deleted = false,
                },
            };

            context.AddRange(accounts);
            context.SaveChanges();

            var accountController = new AccountController(context);

            var result = await accountController.GetAccounts();
            
            var response = result.Result as OkObjectResult;
            var responseValue = response.Value as ApiResponse;
            var responseData = responseValue.Data as List<Account>;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(responseData.Count, Is.EqualTo(3));
            Assert.That(responseData, Is.EqualTo(accounts));
        }

        [Test]
        public async Task GetAccountsWhenSomeAccountsAreSetAsDeletedGetsOnlyNonDeletedAccounts()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = false,
                },
                new Account
                {
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = true,
                },
                new Account
                {
                    FirstName = "Pew",
                    LastName = "Pew",
                    OpeningBalance = 0,
                    CurrentBalance = 300,
                    Deleted = false,
                },
            };

            var expectedAccounts = new List<Account>
            {
                accounts[0],
                accounts[2],
            };

            context.AddRange(accounts);
            context.SaveChanges();

            var accountController = new AccountController(context);

            var result = await accountController.GetAccounts();

            var response = result.Result as OkObjectResult;
            var responseValue = response.Value as ApiResponse;
            var responseData = responseValue.Data as List<Account>;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(responseData.Count, Is.EqualTo(2));
            Assert.That(responseData, Is.EqualTo(expectedAccounts));
        }

        [Test]
        public async Task GetAccountsWhenThereAreNoAccountsReturnsNotFound()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var result = await accountController.GetAccounts();

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        [Test]
        public async Task GetAccountsWhenThereAreNoLiveAccountsReturnsNotFound()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = true,
                },
                new Account
                {
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = true,
                },
                new Account
                {
                    FirstName = "Pew",
                    LastName = "Pew",
                    OpeningBalance = 0,
                    CurrentBalance = 300,
                    Deleted = true,
                },
            };

            context.AddRange(accounts);
            context.SaveChanges();

            var accountController = new AccountController(context);

            var result = await accountController.GetAccounts();

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }
    }
}
