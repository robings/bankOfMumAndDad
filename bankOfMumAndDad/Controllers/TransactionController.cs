using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Requests;
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

                var transactions = await _context.Transactions.Where(d => d.AccountId == id).ToListAsync();

                if (transactions.Count() == 0)
                {
                    return NotFound(new ApiResponse(false, "No transactions found for account.", new List<Object>()));
                }
                else
                {
                    return Ok(new ApiResponse(true, "Transaction details returned.", transactions));
                }
            }
            catch (Exception)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, "Server Error", new List<Object>());
            }
        }

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
        public async Task<ActionResult<ApiResponse>> PostTransaction(Transaction transaction)
        {
            if (!Validation.ValidateString(transaction.Comments))
            {
                return BadRequest(new ApiResponse(false, "Validation Error.", new List<Object>()));
            }

            _context.Transactions.Add(transaction);
            var account = new Account();

            try
            {
                account = await _context.Accounts.FindAsync(transaction.AccountId);
                if (account == null || account.Deleted == true)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                if (transaction.Type == TransactionTypes.Deposit)
                {
                    account.CurrentBalance += transaction.Amount;
                }
                else if (transaction.Type == TransactionTypes.Withdrawal)
                {
                    account.CurrentBalance -= transaction.Amount;
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
