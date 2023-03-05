using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Events;
using bankOfMumAndDad.EventStore;
using bankOfMumAndDad.Requests;
using bankOfMumAndDad.Responses;
using bankOfMumAndDad.Source;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bankOfMumAndDad.Controllers
{
    [Route("api/Account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IEventWriter _eventWriter;

        public AccountController(DataContext context, IEventWriter eventWriter)
        {
            _context = context;
            _eventWriter = eventWriter;
        }

        // GET: api/Account
        [HttpGet("all")]
        public async Task<ActionResult<ApiResponse>> GetAccounts()
        {
            try
            {
                var result = await _context.Accounts.Where(a => a.Deleted != true).ToListAsync();
                if (!result.Any())
                {
                    return NotFound(new ApiResponse(false, "No accounts found", result));
                }
                else
                {
                    return Ok(new ApiResponse(true, "Accounts retrieved.", result));
                }
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        // GET: api/Account
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse>> GetAccount(int id)
        {
            try
            {
                var account = await _context.Accounts.Where(a => a.Id == id && a.Deleted != true).ToListAsync();

                if (!account.Any())
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }
                else
                {
                    return Ok(new ApiResponse(true, "Account details returned.", account));
                }
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        // PUT: api/Account/
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ActionResult<ApiResponse>> PutAccount([FromBody] PutRequest putRequest)
        {
            if (putRequest is null)
            {
                return BadRequest(new ApiResponse(false, "No account data received.", new List<Object>()));
            }

            var id = putRequest.Id;
            Account account;

            try
            {
                account = await _context.Accounts.FindAsync(id);
                if (account == null)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                if (putRequest.FirstName != null)
                {
                    if (!putRequest.FirstName.ValidateString())
                    {
                        return BadRequest(new ApiResponse(false, "Validation Error.", new List<Object>()));
                    }

                    account.FirstName = putRequest.FirstName;
                }

                if (putRequest.LastName != null)
                {
                    if (!putRequest.LastName.ValidateString())
                    {
                        return BadRequest(new ApiResponse(false, "Validation Error.", new List<Object>()));
                    }

                    account.LastName = putRequest.LastName;
                }

                account.CurrentBalance = putRequest.CurrentBalance ?? account.CurrentBalance;

                _context.Entry(account).State = EntityState.Modified;
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }


            try
            {
                await _context.SaveChangesAsync();
                return Ok(new ApiResponse(true, "Account details updated.", account));
            }
            catch (Exception ex)
            {
                if (!AccountExists(putRequest.Id))
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }
                else
                {
                    this.HttpContext.Response.StatusCode = 500;
                    return new ApiResponse(false, ex.Message, new List<Object>());
                }
            }
        }

        // POST: api/Account
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ApiResponse>> PostAccount(AccountDTO postedAccount)
        {
            if(postedAccount is null)
            {
                return BadRequest(new ApiResponse(false, "No account data received.", new List<Object>()));
            }

            if (!postedAccount.FirstName.ValidateString() ||
                !postedAccount.LastName.ValidateString())
            {
                return BadRequest(new ApiResponse(false, "Validation Error.", new List<Object>()));
            }

            var account = new Account {
                FirstName = postedAccount.FirstName,
                LastName = postedAccount.LastName,
                OpeningBalance = Convert.ToDecimal(postedAccount.OpeningBalance),
                CurrentBalance = Convert.ToDecimal(postedAccount.CurrentBalance),
            };

            try
            {
                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();

                var accountCreated = new AccountCreated
                {
                    Id = account.Id,
                    TimeStamp = DateTime.UtcNow,
                    FirstName = account.FirstName,
                    LastName = account.LastName,
                    OpeningBalance = account.OpeningBalance,
                };
                await _eventWriter.WriteEvent(
                    $"account-{account.Id}",
                    accountCreated,
                    nameof(AccountCreated));
                var result = CreatedAtAction(nameof(PostAccount), new { id = account.Id }, account).Value;
                return Ok(new ApiResponse(true, "Successfully created account.", result));
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        // SOFT DELETE: api/Account/
        [HttpDelete]
        public async Task<ActionResult<ApiResponse>> DeleteAccount([FromBody] IdOnlyRequest deleteRequest)
        {
            if (deleteRequest is null)
            {
                return BadRequest(new ApiResponse(false, "No account data received.", new List<Object>()));
            }

            var accountId = Convert.ToInt64(deleteRequest.Id);

            try
            {
                var account = await _context.Accounts.FindAsync(accountId);
                if (account == null || account.Deleted == true)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                var transactions = _context.Transactions.Where(t => t.AccountId == accountId);
                if(transactions != null)
                {
                    foreach (var transaction in transactions)
                    {
                        transaction.Deleted = true;
                    }
                }
                
                account.Deleted = true;

                await _context.SaveChangesAsync();

                var accountDeleted = new AccountDeleted
                {
                    Id = accountId,
                    TimeStamp = DateTime.UtcNow,
                };

                await _eventWriter.WriteEvent(
                    $"account-{account.Id}",
                    accountDeleted,
                    nameof(AccountDeleted));

                return Ok(new ApiResponse(true, "Account successfully deleted.", new List<Object>()));
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        // HARD DELETE: api/Account/delete
        [HttpDelete("delete")]
        public async Task<ActionResult<ApiResponse>> HardDeleteAccount([FromBody] IdOnlyRequest deleteRequest)
        {
            var id = deleteRequest.Id;

            try
            {
                var account = await _context.Accounts.FindAsync(id);
                if (account == null)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                _context.Accounts.Remove(account);
                await _context.SaveChangesAsync();
                return Ok(new ApiResponse(true, "Account successfully deleted.", account));
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        private bool AccountExists(long id)
        {
            return _context.Accounts.Any(e => e.Id == id);
        }
    }
}
