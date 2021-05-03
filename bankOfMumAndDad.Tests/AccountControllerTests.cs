using System;
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
        #region Variables
        List<Account> _seedDatabaseAccounts => new List<Account>
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

        List<Account> _accountsThatAreAllDeleted => new List<Account>
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
        #endregion

        #region GetAccounts Tests
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

            context.AddRange(_accountsThatAreAllDeleted);
            context.SaveChanges();

            var accountController = new AccountController(context);

            var result = await accountController.GetAccounts();

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        #endregion

        #region GetAccount Tests
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

            context.AddRange(_accountsThatAreAllDeleted);
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

            context.AddRange(_seedDatabaseAccounts);
            context.SaveChanges();

            var accountController = new AccountController(context);

            var result = await accountController.GetAccount(2);

            var response = result.Result as OkObjectResult;

            var responseValue = response.Value as ApiResponse;
            var responseData = responseValue.Data as List<Account>;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(responseData.Count, Is.EqualTo(1));
            Assert.That(responseData[0], Is.EqualTo(context.Accounts.Where(a => a.Id == 2).FirstOrDefault()));
        }

        #endregion

        #region DeleteAccount Tests
        [Test]
        public async Task DeleteAccountGivenNoDataReturnsBadRequest()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var result = await accountController.DeleteAccount(null);

            var response = result.Result as BadRequestObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(400));
            var responseValue = response.Value as ApiResponse;

            Assert.That(response.StatusCode, Is.EqualTo(400));
            Assert.That(responseValue.Message, Is.EqualTo("No account data received."));
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

            context.AddRange(_seedDatabaseAccounts);
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

            context.AddRange(_seedDatabaseAccounts);
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

            context.AddRange(_seedDatabaseAccounts);
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
        #endregion

        #region PostAccount Tests
        [Test]
        public async Task PostAccountGivenValidData_WhereDatabaseIsEmpty_AddsAccount()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var accountToPost = new AccountDTO
            {
                FirstName = "Cuthbert",
                LastName = "Dibble",
                OpeningBalance = "150",
                CurrentBalance = "150",
            };

            Assert.That(await context.Accounts.CountAsync(), Is.Zero);

            var result = await accountController.PostAccount(accountToPost);

            var createdAccount = await context.Accounts.FirstOrDefaultAsync();

            var response = result.Result as OkObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(await context.Accounts.CountAsync(), Is.EqualTo(1));
            Assert.That(createdAccount.FirstName, Is.EqualTo(accountToPost.FirstName));
            Assert.That(createdAccount.LastName, Is.EqualTo(accountToPost.LastName));
            Assert.That(createdAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.OpeningBalance)));
            Assert.That(createdAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.CurrentBalance)));
        }

        [Test]
        public async Task PostAccountGivenValidData_WhereDatabaseHasAccounts_AddsAccount()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            await context.AddRangeAsync(_seedDatabaseAccounts);
            await context.SaveChangesAsync();

            var accountController = new AccountController(context);

            var accountToPost = new AccountDTO
            {
                FirstName = "Crouching",
                LastName = "Tiger",
                OpeningBalance = "250",
                CurrentBalance = "250",
            };

            var result = await accountController.PostAccount(accountToPost);

            var createdAccount = context.Accounts.Where(a => a.FirstName == accountToPost.FirstName).FirstOrDefault();

            var response = result.Result as OkObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(context.Accounts.Count(), Is.EqualTo(4));
            Assert.That(createdAccount.FirstName, Is.EqualTo(accountToPost.FirstName));
            Assert.That(createdAccount.LastName, Is.EqualTo(accountToPost.LastName));
            Assert.That(createdAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.OpeningBalance)));
            Assert.That(createdAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.CurrentBalance)));
        }

        [TestCase("Cuthbert<")]
        [TestCase("   /n /t  ")]
        [TestCase("")]
        public async Task PostAccountGivenInValidData_ReturnsBadRequest(string invalidData)
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var accountToPost = new AccountDTO
            {
                FirstName = invalidData,
                LastName = "Dibble",
                OpeningBalance = "150",
                CurrentBalance = "150",
            };

            var result = await accountController.PostAccount(accountToPost);

            var response = result.Result as BadRequestObjectResult;
            var responseValue = response.Value as ApiResponse;


            Assert.That(response.StatusCode, Is.EqualTo(400));
            Assert.That(responseValue.Message, Is.EqualTo("Validation Error."));
        }

        [Test]
        public async Task PostAccountGivenNoData_ReturnsBadRequest()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var result = await accountController.PostAccount(null);

            var response = result.Result as BadRequestObjectResult;
            var responseValue = response.Value as ApiResponse;

            Assert.That(response.StatusCode, Is.EqualTo(400));
            Assert.That(responseValue.Message, Is.EqualTo("No account data received."));
        }
        #endregion

        #region PutAccount Tests
        [Test]
        public async Task PutAccountGivenNoData_ReturnsBadRequest()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var result = await accountController.PutAccount(null);

            var response = result.Result as BadRequestObjectResult;
            var responseValue = response.Value as ApiResponse;

            Assert.That(response.StatusCode, Is.EqualTo(400));
            Assert.That(responseValue.Message, Is.EqualTo("No account data received."));
        }

        [Test]
        public async Task PutAccountGivenNonExistingIdReturnsNotFound()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            var putRequest = new PutRequest
            {
                Id = 4,
                FirstName = "Pew",
                LastName = "McGrew",
            };

            var result = await accountController.PutAccount(putRequest);

            var response = result.Result as NotFoundObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(404));
        }

        [TestCase("Cuthbert<")]
        [TestCase("   /n /t  ")]
        [TestCase("")]
        public async Task PutAccountGivenInValidData_ReturnsBadRequest(string invalidData)
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            var accountController = new AccountController(context);

            await context.AddRangeAsync(_seedDatabaseAccounts);
            await context.SaveChangesAsync();

            var putRequest = new PutRequest
            {
                Id = 3,
                FirstName = invalidData,
                LastName = "McGrew",
            };

            var result = await accountController.PutAccount(putRequest);

            var response = result.Result as BadRequestObjectResult;
            var responseValue = response.Value as ApiResponse;


            Assert.That(response.StatusCode, Is.EqualTo(400));
            Assert.That(responseValue.Message, Is.EqualTo("Validation Error."));
        }

        [Test]
        public async Task PutAccountGivenValidRequestToChangeFirstName_UpdatesAccount_WithChangedDataOnly()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            await context.AddRangeAsync(_seedDatabaseAccounts);
            await context.SaveChangesAsync();

            var accountController = new AccountController(context);

            var putRequest = new PutRequest
            {
                Id = 3,
                FirstName = "Barney",
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await accountController.PutAccount(putRequest);

            var editedAccount = context.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var response = result.Result as OkObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(context.Accounts.Count(), Is.EqualTo(3));
            Assert.That(editedAccount.FirstName, Is.EqualTo(putRequest.FirstName));
            Assert.That(editedAccount.LastName, Is.EqualTo(preEditedAccount.LastName));
            Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
            Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.CurrentBalance)));
        }

        [Test]
        public async Task PutAccountGivenValidRequestToChangeLastName_UpdatesAccount_WithChangedDataOnly()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            await context.AddRangeAsync(_seedDatabaseAccounts);
            await context.SaveChangesAsync();

            var accountController = new AccountController(context);

            var putRequest = new PutRequest
            {
                Id = 3,
                LastName = "McGrew",
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await accountController.PutAccount(putRequest);

            var editedAccount = context.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var response = result.Result as OkObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(context.Accounts.Count(), Is.EqualTo(3));
            Assert.That(editedAccount.FirstName, Is.EqualTo(preEditedAccount.FirstName));
            Assert.That(editedAccount.LastName, Is.EqualTo(putRequest.LastName));
            Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
            Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.CurrentBalance)));
        }

        [Test]
        public async Task PutAccountGivenValidRequestToChangeCurrentBalance_UpdatesAccount_WithChangedDataOnly()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            await context.AddRangeAsync(_seedDatabaseAccounts);
            await context.SaveChangesAsync();

            var accountController = new AccountController(context);

            var putRequest = new PutRequest
            {
                Id = 3,
                CurrentBalance = 1000,
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await accountController.PutAccount(putRequest);
            
            var editedAccount = context.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var response = result.Result as OkObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(context.Accounts.Count(), Is.EqualTo(3));
            Assert.That(editedAccount.FirstName, Is.EqualTo(preEditedAccount.FirstName));
            Assert.That(editedAccount.LastName, Is.EqualTo(preEditedAccount.LastName));
            Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
            Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(putRequest.CurrentBalance)));
        }

        [Test]
        public async Task PutAccountGivenValidRequestToChangeMultipleFields_UpdatesAccount_WithChangedDataOnly()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            var context = factory.CreateSqliteContext();

            await context.AddRangeAsync(_seedDatabaseAccounts);
            await context.SaveChangesAsync();

            var accountController = new AccountController(context);

            var putRequest = new PutRequest
            {
                Id = 3,
                FirstName = "Barney",
                CurrentBalance = 1000,
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await accountController.PutAccount(putRequest);

            var editedAccount = context.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var response = result.Result as OkObjectResult;

            Assert.That(response.StatusCode, Is.EqualTo(200));
            Assert.That(context.Accounts.Count(), Is.EqualTo(3));
            Assert.That(editedAccount.FirstName, Is.EqualTo(putRequest.FirstName));
            Assert.That(editedAccount.LastName, Is.EqualTo(preEditedAccount.LastName));
            Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
            Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(putRequest.CurrentBalance)));
        }
        #endregion
    }
}
