﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bankOfMumAndDad.Controllers;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Requests;
using bankOfMumAndDad.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [Test]
        public async Task GetAccountGivenNonExistingIdReturnsNotFound()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var result = await accountController.GetAccount(3);

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        [Test]
        public async Task GetAccountGivenDeletedAccountIdReturnsNotFound()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    Id = 1,
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = true,
                },
                new Account
                {
                    Id = 2,
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = true,
                },
                new Account
                {
                    Id = 3,
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

            var result = await accountController.GetAccount(2);

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        [Test]
        public async Task GetAccountGivenExistingAccountReturnsAccount()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    Id = 1,
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = false,
                },
                new Account
                {
                    Id = 2,
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = false,
                },
                new Account
                {
                    Id = 3,
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

            var result = await accountController.GetAccount(2);

            var response = result.Result as OkObjectResult;

            var responseValue = response.Value as ApiResponse;
            var responseData = responseValue.Data as List<Account>;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(responseData.Count, Is.EqualTo(1));
            Assert.That(responseData[0], Is.EqualTo(accounts[1]));
        }

        [Test]
        public async Task DeleteAccountGivenNonExistingIdReturnsNotFound()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var result = await accountController.DeleteAccount(new IdOnlyRequest { Id = "3" });

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        [Test]
        public async Task DeleteAccountGivenExistingDeletedAccountReturnsNotFound()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    Id = 1,
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = false,
                },
                new Account
                {
                    Id = 2,
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = false,
                },
                new Account
                {
                    Id = 3,
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

            var result = await accountController.DeleteAccount(new IdOnlyRequest { Id = "3" });

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        [Test]
        public async Task DeleteAccountGivenExistingAccountSoftDeletesAccount()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    Id = 1,
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = false,
                },
                new Account
                {
                    Id = 2,
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = false,
                },
                new Account
                {
                    Id = 3,
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

            var result = await accountController.DeleteAccount(new IdOnlyRequest { Id = "2" });

            var response = result.Result as OkObjectResult;

            var responseValue = response.Value as ApiResponse;
            
            var deletedAccount = await context.Accounts.Where(a => a.Id == 2).FirstOrDefaultAsync();

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(responseValue.Message, Is.EqualTo("Account successfully deleted."));
            Assert.That(deletedAccount.Deleted, Is.EqualTo(true));
        }

        [Test]
        public async Task DeleteAccountGivenExistingAccountWithTransactionsSoftDeletesAccountAndTransactions()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accounts = new List<Account>
            {
                new Account
                {
                    Id = 1,
                    FirstName = "Cuthbert",
                    LastName = "Dibble",
                    OpeningBalance = 0,
                    CurrentBalance = 150,
                    Deleted = false,
                },
                new Account
                {
                    Id = 2,
                    FirstName = "Barney",
                    LastName = "McGrew",
                    OpeningBalance = 0,
                    CurrentBalance = 200,
                    Deleted = false,
                },
                new Account
                {
                    Id = 3,
                    FirstName = "Pew",
                    LastName = "Pew",
                    OpeningBalance = 0,
                    CurrentBalance = 300,
                    Deleted = true,
                },
            };

            var transactions = new List<Transaction>
            {
                new Transaction
                {
                    Amount = 10,
                    Date = DateTime.Now,
                    Type = TransactionTypes.Withdrawal,
                    Deleted = false,
                    AccountId = 2,
                },
                new Transaction
                {
                    Amount = 10,
                    Date = DateTime.Now,
                    Type = TransactionTypes.Deposit,
                    Deleted = false,
                    AccountId = 2,
                },
                new Transaction
                {
                    Amount = 50,
                    Date = DateTime.Now,
                    Type = TransactionTypes.Deposit,
                    Deleted = false,
                    AccountId = 3,
                },
            };

            context.AddRange(accounts);
            context.AddRange(transactions);
            context.SaveChanges();

            var accountController = new AccountController(context);

            var result = await accountController.DeleteAccount(new IdOnlyRequest { Id = "2" });

            var response = result.Result as OkObjectResult;

            var responseValue = response.Value as ApiResponse;

            var deletedAccount = await context.Accounts.Where(a => a.Id == 2).FirstOrDefaultAsync();
            var deletedTransactions = await context.Transactions.Where(t => t.AccountId == 2).ToListAsync();

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(responseValue.Message, Is.EqualTo("Account successfully deleted."));
            Assert.That(deletedAccount.Deleted, Is.EqualTo(true));
            Assert.That(deletedTransactions.Count, Is.EqualTo(2));
            deletedTransactions.ForEach(dT => Assert.That(dT.Deleted, Is.EqualTo(true)));
        }

    }
}