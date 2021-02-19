using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Responses;
using bankOfMumAndDad.Source;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bankOfMumAndDad.Controllers
{
    [Route("api/Transaction")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly DataContext _context;
        private decimal runningTotal;

        public TransactionController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Transaction
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse>> GetTransactionsByAccountId(int id)
        {
            try
            {
                if ((!_context.Accounts.Any(e => e.Id == id)) || (_context.Accounts.Any(e => e.Id == id && e.Deleted == true)))
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                var transactions = await _context.Transactions.Where(d => d.AccountId == id).OrderBy(o => o.Date).ToListAsync();

                if (transactions.Count() == 0)
                {
                    return NotFound(new ApiResponse(false, "No transactions found for account.", new List<Object>()));
                }

                var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);

                var transactionsList = processTransactions(transactions, account);

                var response = new ApiResponse(true, "Transaction details returned.", transactionsList);

                return Ok(response);
            }
            catch (Exception)
            {
                this.HttpContext.Response.StatusCode = 500;
                return (new ApiResponse(false, "Server Error", new List<Object>()));
            }
        }

        private TransactionsDTO processTransactions(List<Transaction> transactions, Account account)
        {
            var openingBalance = account.OpeningBalance;
            runningTotal = openingBalance;

            var transactionList = transactions.Select(t => new TransactionListItem
            {
                Amount = t.Amount,
                Type = t.Type,
                Comments = t.Comments,
                Balance = getBalance(t.Amount,t.Type),
                Date = t.Date,
            }).ToArray();

            if (runningTotal != account.CurrentBalance)
            {
                throw new ArithmeticException("Account balance does not tally with transactions");
            }

            return new TransactionsDTO{
                AccountId = account.Id,
                FirstName = account.FirstName,
                LastName = account.LastName,
                OpeningBalance = openingBalance,
                CurrentBalance = account.CurrentBalance,
                Transactions = transactionList,
            };
        }

        private decimal getBalance(decimal amount, TransactionTypes transactionType)
        {
            var updatedBalance = transactionType == TransactionTypes.Deposit ? runningTotal + amount : runningTotal - amount;
            runningTotal = updatedBalance;
            return updatedBalance;
        }

        //// GET: api/Transaction
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ApiResponse>> GetTransactionsByAccountId(int id)
        //{
        //    try
        //    {
        //        if ((!_context.Accounts.Any(e => e.Id == id)) || (_context.Accounts.Any(e => e.Id == id && e.Deleted == true)))
        //        {
        //            return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
        //        }

        //        var transactions = await _context.Transactions.Where(d => d.AccountId == id).OrderBy(o => o.Date).ToListAsync();

        //        if (transactions.Count() == 0)
        //        {
        //            return NotFound(new ApiResponse(false, "No transactions found for account.", new List<Object>()));
        //        }
        //        else
        //        {
        //            return Ok(new ApiResponse(true, "Transaction details returned.", transactions));
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        this.HttpContext.Response.StatusCode = 500;
        //        return new ApiResponse(false, "Server Error", new List<Object>());
        //    }
        //}

        // PUT: api/Transaction
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public ApiResponse PutTransaction()
        {
            this.HttpContext.Response.StatusCode = 405;
            return new ApiResponse(false, "Action not supported", new List<Object>());
        }

        // POST: api/Transaction
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ApiResponse>> PostTransaction(TransactionDTO transaction)
        {
            if (!Validation.ValidateString(transaction.Comments))
            {
                return BadRequest(new ApiResponse(false, "Validation Error.", new List<Object>()));
            }

            Transaction transactionToSave = new Transaction
            {
                AccountId = Convert.ToInt64(transaction.AccountId),
                Amount = Convert.ToDecimal(transaction.Amount),
                Date = Convert.ToDateTime(transaction.Date),
                Comments = transaction.Comments,
                Type = transaction.Type == "0" ? TransactionTypes.Deposit : TransactionTypes.Withdrawal,               
            };

            _context.Transactions.Add(transactionToSave);
            var account = new Account();

            try
            {
                account = await _context.Accounts.FindAsync(transactionToSave.AccountId);
                if (account == null || account.Deleted == true)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                if (transactionToSave.Type == TransactionTypes.Deposit)
                {
                    account.CurrentBalance += transactionToSave.Amount;
                }
                else if (transactionToSave.Type == TransactionTypes.Withdrawal)
                {
                    account.CurrentBalance -= transactionToSave.Amount;
                }
                else
                {
                    return BadRequest(new ApiResponse(false, "Transaction type error.", new List<Object>()));
                }

                await _context.SaveChangesAsync();

                return Ok(new ApiResponse(true, "Successfully added transaction.", new List<Object>()));
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        // DELETE: api/Transaction
        [HttpDelete]
        public ApiResponse DeleteTransaction()
        {
            this.HttpContext.Response.StatusCode = 405;
            return new ApiResponse(false, "Action not supported", new List<Object>());
        }

        private bool TransactionExists(long id)
        {
            return _context.Transactions.Any(e => e.Id == id);
        }
    }
}
