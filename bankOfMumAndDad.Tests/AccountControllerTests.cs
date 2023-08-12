using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bankOfMumAndDad.Controllers;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Events;
using bankOfMumAndDad.EventStore;
using bankOfMumAndDad.Requests;
using bankOfMumAndDad.Responses;
using bankOfMumAndDad.Source;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using NUnit.Framework;

namespace bankOfMumAndDad.Tests
{
    public class AccountControllerTests
    {
        #region Variables
        DataContext _dataContext;
        IEventWriter _mockEventWriter;
        IEventReader _mockEventReader;
        AccountController _accountController;

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
        [SetUp]
        public void Setup()
        {
            var factory = new SqliteInMemoryConnectionFactory();

            _dataContext = factory.CreateSqliteContext();

            _mockEventWriter = Substitute.For<IEventWriter>();
            _mockEventReader = Substitute.For<IEventReader>();
            _accountController = new AccountController(
                _dataContext,
                _mockEventWriter,
                _mockEventReader);
        }

        [TearDown]
        public void TearDown()
        {
            _dataContext.Dispose();
        }

        [Test]
        public async Task GetAccountsGetsAllAccounts()
        {
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

            _dataContext.AddRange(accounts);
            _dataContext.SaveChanges();

            var result = await _accountController.GetAccounts();
            var responseValue = (ApiResponse)((OkObjectResult)result.Result).Value;
            var responseData = responseValue.Data as List<Account>;

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(responseData.Count, Is.EqualTo(3));
            Assert.That(responseData, Is.EqualTo(accounts));
        }

        [Test]
        public async Task GetAccountsWhenSomeAccountsAreSetAsDeletedGetsOnlyNonDeletedAccounts()
        {
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

            _dataContext.AddRange(accounts);
            _dataContext.SaveChanges();

            var result = await _accountController.GetAccounts();
            var responseValue = (ApiResponse)((OkObjectResult)result.Result).Value;
            var responseData = responseValue.Data as List<Account>;

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(responseData.Count, Is.EqualTo(2));
            Assert.That(responseData, Is.EqualTo(expectedAccounts));
        }

        [Test]
        public async Task GetAccountsWhenThereAreNoAccountsReturnsNotFound()
        {
            var result = await _accountController.GetAccounts();

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetAccountsWhenThereAreNoLiveAccountsReturnsNotFound()
        {
            _dataContext.AddRange(_accountsThatAreAllDeleted);
            _dataContext.SaveChanges();

            var result = await _accountController.GetAccounts();

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
        }

        #endregion

        #region GetAccount Tests
        [Test]
        public async Task GetAccountGivenNonExistingIdReturnsNotFound()
        {
            var result = await _accountController.GetAccount(3);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetAccountGivenDeletedAccountIdReturnsNotFound()
        {
            _dataContext.AddRange(_accountsThatAreAllDeleted);
            _dataContext.SaveChanges();

            var result = await _accountController.GetAccount(2);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetAccountGivenExistingAccountReturnsAccount()
        {
            _dataContext.AddRange(_seedDatabaseAccounts);
            _dataContext.SaveChanges();

            var result = await _accountController.GetAccount(2);
            var responseValue = (ApiResponse)((OkObjectResult)result.Result).Value;
            var responseData = responseValue.Data as List<Account>;
            var expectedAccounts = _dataContext.Accounts.Where(a => a.Id == 2).FirstOrDefault();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(responseData.Count, Is.EqualTo(1));
            Assert.That(responseData[0], Is.EqualTo(expectedAccounts));
        }

        #endregion

        #region DeleteAccount Tests
        [Test]
        public async Task DeleteAccountGivenNoDataReturnsBadRequest()
        {
            var result = await _accountController.DeleteAccount(null);
            var apiResponse = (ApiResponse)((BadRequestObjectResult)result.Result).Value;


            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
            Assert.That(apiResponse.Message, Is.EqualTo("No account data received."));
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }


        [Test]
        public async Task DeleteAccountGivenNonExistingIdReturnsNotFound()
        {
            var result = await _accountController.DeleteAccount(new IdOnlyRequest { Id = "3" });

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }

        [Test]
        public async Task DeleteAccountGivenExistingDeletedAccountReturnsNotFound()
        {
            _dataContext.AddRange(_seedDatabaseAccounts);
            _dataContext.SaveChanges();

            var result = await _accountController.DeleteAccount(new IdOnlyRequest { Id = "3" });

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }

        [Test]
        public async Task DeleteAccountGivenExistingAccountSoftDeletesAccount()
        {
            _dataContext.AddRange(_seedDatabaseAccounts);
            _dataContext.SaveChanges();

            var result = await _accountController.DeleteAccount(new IdOnlyRequest { Id = "2" });

            var responseValue = (ApiResponse)((OkObjectResult)result.Result).Value;

            var deletedAccount = await _dataContext.Accounts.Where(a => a.Id == 2).FirstOrDefaultAsync();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(responseValue.Message, Is.EqualTo("Account successfully deleted."));
            Assert.That(deletedAccount.Deleted, Is.EqualTo(true));

            await _mockEventWriter.ReceivedWithAnyArgs(1).WriteEvent(default, default, default);
            await _mockEventWriter.Received(1).WriteEvent($"account-2", Arg.Is<AccountDeleted>(a => a.Id == 2), nameof(AccountDeleted));
        }

        [Test]
        public async Task DeleteAccountGivenExistingAccountWithTransactionsSoftDeletesAccountAndTransactions()
        {
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

            _dataContext.AddRange(_seedDatabaseAccounts);
            _dataContext.AddRange(transactions);
            _dataContext.SaveChanges();

            var result = await _accountController.DeleteAccount(new IdOnlyRequest { Id = "2" });

            var responseValue = (ApiResponse)((OkObjectResult)result.Result).Value;

            var deletedAccount = await _dataContext.Accounts.Where(a => a.Id == 2).FirstOrDefaultAsync();
            var deletedTransactions = await _dataContext.Transactions.Where(t => t.AccountId == 2).ToListAsync();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(responseValue.Message, Is.EqualTo("Account successfully deleted."));
            Assert.That(deletedAccount.Deleted, Is.EqualTo(true));
            Assert.That(deletedTransactions.Count, Is.EqualTo(2));
            deletedTransactions.ForEach(dT => Assert.That(dT.Deleted, Is.EqualTo(true)));

            await _mockEventWriter.ReceivedWithAnyArgs(1).WriteEvent(default, default, default);
            await _mockEventWriter.Received(1).WriteEvent($"account-2", Arg.Is<AccountDeleted>(a => a.Id == 2), nameof(AccountDeleted));
        }
        #endregion

        #region PostAccount Tests
        [Test]
        public async Task PostAccountGivenValidData_WhereDatabaseIsEmpty_AddsAccount()
        {
            var accountToPost = new AccountDTO
            {
                FirstName = "Cuthbert",
                LastName = "Dibble",
                OpeningBalance = "150",
                CurrentBalance = "150",
            };

            Assert.That(await _dataContext.Accounts.CountAsync(), Is.Zero);

            var result = await _accountController.PostAccount(accountToPost);

            var createdAccount = await _dataContext.Accounts.FirstOrDefaultAsync();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(await _dataContext.Accounts.CountAsync(), Is.EqualTo(1));
            Assert.Multiple(() =>
            {
                Assert.That(createdAccount.FirstName, Is.EqualTo(accountToPost.FirstName));
                Assert.That(createdAccount.LastName, Is.EqualTo(accountToPost.LastName));
                Assert.That(createdAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.OpeningBalance)));
                Assert.That(createdAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.CurrentBalance)));
            });

            await _mockEventWriter.ReceivedWithAnyArgs(1).WriteEvent(default, default, default);
            await _mockEventWriter.Received(1).WriteEvent(
                    $"account-{createdAccount.Id}",
                    Arg.Is<AccountCreated>(a => a.Id == createdAccount.Id &&
                        a.FirstName == createdAccount.FirstName &&
                        a.LastName == createdAccount.LastName &&
                        a.OpeningBalance == createdAccount.OpeningBalance),
                    nameof(AccountCreated));
        }

        [Test]
        public async Task PostAccountGivenValidData_WhereDatabaseHasAccounts_AddsAccount()
        {
            await _dataContext.AddRangeAsync(_seedDatabaseAccounts);
            await _dataContext.SaveChangesAsync();

            var accountToPost = new AccountDTO
            {
                FirstName = "Crouching",
                LastName = "Tiger",
                OpeningBalance = "250",
                CurrentBalance = "250",
            };

            var result = await _accountController.PostAccount(accountToPost);

            var createdAccount = _dataContext.Accounts.Where(a => a.FirstName == accountToPost.FirstName).FirstOrDefault();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(_dataContext.Accounts.Count(), Is.EqualTo(4));
            Assert.Multiple(() =>
            {
                Assert.That(createdAccount.FirstName, Is.EqualTo(accountToPost.FirstName));
                Assert.That(createdAccount.LastName, Is.EqualTo(accountToPost.LastName));
                Assert.That(createdAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.OpeningBalance)));
                Assert.That(createdAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(accountToPost.CurrentBalance)));
            });

            await _mockEventWriter.ReceivedWithAnyArgs(1).WriteEvent(default, default, default);
            await _mockEventWriter.Received(1).WriteEvent(
                    $"account-{createdAccount.Id}",
                    Arg.Is<AccountCreated>(a => a.Id == createdAccount.Id &&
                        a.FirstName == createdAccount.FirstName &&
                        a.LastName == createdAccount.LastName &&
                        a.OpeningBalance == createdAccount.OpeningBalance),
                    nameof(AccountCreated));
        }

        [TestCase("Cuthbert<")]
        [TestCase("   /n /t  ")]
        [TestCase("")]
        public async Task PostAccountGivenInvalidData_ReturnsBadRequest(string invalidData)
        {
            var accountToPost = new AccountDTO
            {
                FirstName = invalidData,
                LastName = "Dibble",
                OpeningBalance = "150",
                CurrentBalance = "150",
            };

            var result = await _accountController.PostAccount(accountToPost);
            var responseValue = (ApiResponse)((BadRequestObjectResult)result.Result).Value;

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
            Assert.That(responseValue.Message, Is.EqualTo("Validation Error."));
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }

        [Test]
        public async Task PostAccountGivenNoData_ReturnsBadRequest()
        {
            var result = await _accountController.PostAccount(null);

            var responseValue = (ApiResponse)((BadRequestObjectResult)result.Result).Value;

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
            Assert.That(responseValue.Message, Is.EqualTo("No account data received."));
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }
        #endregion

        #region PutAccount Tests
        [Test]
        public async Task PutAccountGivenNoData_ReturnsBadRequest()
        {
            var result = await _accountController.PatchAccount(1, null);

            var responseValue = (ApiResponse)((BadRequestObjectResult)result.Result).Value;

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
            Assert.That(responseValue.Message, Is.EqualTo("No account data received."));
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }

        [Test]
        public async Task PutAccountGivenNonExistingIdReturnsNotFound()
        {
            var putRequest = new PutRequest
            {
                Id = 4,
                FirstName = "Pew",
                LastName = "McGrew",
            };

            var result = await _accountController.PatchAccount(putRequest.Id, putRequest);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }

        [TestCase("Cuthbert<")]
        [TestCase("   /n /t  ")]
        [TestCase("")]
        public async Task PutAccountGivenInvalidData_ReturnsBadRequest(string invalidData)
        {
            await _dataContext.AddRangeAsync(_seedDatabaseAccounts);
            await _dataContext.SaveChangesAsync();

            var putRequest = new PutRequest
            {
                Id = 3,
                FirstName = invalidData,
                LastName = "McGrew",
            };

            var result = await _accountController.PatchAccount(putRequest.Id, putRequest);

            var responseValue = (ApiResponse)((BadRequestObjectResult)result.Result).Value;

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
            Assert.That(responseValue.Message, Is.EqualTo("Validation Error."));
            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }

        [Test]
        public async Task PutAccountGivenValidRequestToChangeFirstName_UpdatesAccount_WithChangedDataOnly()
        {
            await _dataContext.AddRangeAsync(_seedDatabaseAccounts);
            await _dataContext.SaveChangesAsync();

            var putRequest = new PutRequest
            {
                Id = 3,
                FirstName = "Barney",
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await _accountController.PatchAccount(putRequest.Id, putRequest);

            var editedAccount = _dataContext.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(_dataContext.Accounts.Count(), Is.EqualTo(putRequest.Id));
            Assert.Multiple(() =>
            {
                Assert.That(editedAccount.FirstName, Is.EqualTo(putRequest.FirstName));
                Assert.That(editedAccount.LastName, Is.EqualTo(preEditedAccount.LastName));
                Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
                Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.CurrentBalance)));
            });

            await _mockEventWriter.ReceivedWithAnyArgs(1).WriteEvent(default, default, default);
            await _mockEventWriter.Received(1).WriteEvent(
                    $"account-{putRequest.Id}",
                    Arg.Is<AccountFirstNameChanged>(a => a.Id == preEditedAccount.Id && a.FirstName == putRequest.FirstName),
                    nameof(AccountFirstNameChanged));
        }

        [Test]
        public async Task PutAccountGivenValidRequestToChangeLastName_UpdatesAccount_WithChangedDataOnly()
        {
            await _dataContext.AddRangeAsync(_seedDatabaseAccounts);
            await _dataContext.SaveChangesAsync();

            var putRequest = new PutRequest
            {
                Id = 3,
                LastName = "McGrew",
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await _accountController.PatchAccount(putRequest.Id, putRequest);

            var editedAccount = _dataContext.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.Multiple(() =>
            {
                Assert.That(editedAccount.FirstName, Is.EqualTo(preEditedAccount.FirstName));
                Assert.That(editedAccount.LastName, Is.EqualTo(putRequest.LastName));
                Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
                Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.CurrentBalance)));
            });

            await _mockEventWriter.ReceivedWithAnyArgs(1).WriteEvent(default, default, default);
            await _mockEventWriter.Received().WriteEvent(
                    $"account-{putRequest.Id}",
                    Arg.Is<AccountLastNameChanged>(a => a.Id == preEditedAccount.Id && a.LastName == putRequest.LastName),
                    nameof(AccountLastNameChanged));
        }

        // this is a daft one really, don't have it in a real system
        [Test]
        public async Task PutAccountGivenValidRequestToChangeCurrentBalance_UpdatesAccount_WithChangedDataOnly()
        {
            await _dataContext.AddRangeAsync(_seedDatabaseAccounts);
            await _dataContext.SaveChangesAsync();

            var putRequest = new PutRequest
            {
                Id = 3,
                CurrentBalance = 1000,
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await _accountController.PatchAccount(putRequest.Id, putRequest);

            var editedAccount = _dataContext.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(_dataContext.Accounts.Count(), Is.EqualTo(3));
            Assert.Multiple(() =>
            {
                Assert.That(editedAccount.FirstName, Is.EqualTo(preEditedAccount.FirstName));
                Assert.That(editedAccount.LastName, Is.EqualTo(preEditedAccount.LastName));
                Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
                Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(putRequest.CurrentBalance)));
            });

            await _mockEventWriter.DidNotReceiveWithAnyArgs().WriteEvent(default, default, default);
        }

        [Test]
        public async Task PutAccountGivenValidRequestToChangeMultipleFields_UpdatesAccount_WithChangedDataOnly()
        {
            await _dataContext.AddRangeAsync(_seedDatabaseAccounts);
            await _dataContext.SaveChangesAsync();

            var putRequest = new PutRequest
            {
                Id = 3,
                FirstName = "Barney",
                CurrentBalance = 1000,
            };

            var preEditedAccount = _seedDatabaseAccounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            var result = await _accountController.PatchAccount(putRequest.Id, putRequest);

            var editedAccount = _dataContext.Accounts.Where(a => a.Id == putRequest.Id).FirstOrDefault();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(_dataContext.Accounts.Count(), Is.EqualTo(3));
            Assert.Multiple(() =>
            {
                Assert.That(editedAccount.FirstName, Is.EqualTo(putRequest.FirstName));
                Assert.That(editedAccount.LastName, Is.EqualTo(preEditedAccount.LastName));
                Assert.That(editedAccount.OpeningBalance, Is.EqualTo(Convert.ToDecimal(preEditedAccount.OpeningBalance)));
                Assert.That(editedAccount.CurrentBalance, Is.EqualTo(Convert.ToDecimal(putRequest.CurrentBalance)));
            });

            await _mockEventWriter.ReceivedWithAnyArgs(1).WriteEvent(default, default, default);
            await _mockEventWriter.Received().WriteEvent(
                    $"account-{putRequest.Id}",
                    Arg.Is<AccountFirstNameChanged>(a => a.Id == preEditedAccount.Id && a.FirstName == putRequest.FirstName),
                    nameof(AccountFirstNameChanged));
        }
        #endregion

        #region GetAccountFromEs Tests
        [Test]
        public async Task GetAccountFromEsGivenNonExistingIdReturnsNotFound()
        {
            var result = await _accountController.GetAccountFromEs(3);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetAccountFromEsGivenExistingAccountReturnsAccount()
        {
            await _accountController.GetAccountFromEs(2);
            await _mockEventReader.Received(1).ReadFromStream("account-2");
        }

        #endregion

    }
}
