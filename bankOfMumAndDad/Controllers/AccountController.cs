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
    [Route("api/Account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;

        public AccountController(DataContext context)
        {
            _context = context;
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
            var id = putRequest.Id;
            var account = new Account();

            try
            {
                account = await _context.Accounts.FindAsync(id);
                if (account == null)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                if (putRequest.FirstName != null)
                {
                    if (!Validation.ValidateString(putRequest.FirstName))
                    {
                        return BadRequest(new ApiResponse(false, "Validation Error.", new List<Object>()));
                    }

                    account.FirstName = putRequest.FirstName;
                }

                if (putRequest.LastName != null)
                {
                    if (!Validation.ValidateString(putRequest.LastName))
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
            if (!Validation.ValidateString(postedAccount.FirstName) ||
                !Validation.ValidateString(postedAccount.LastName))
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
                var result = CreatedAtAction(nameof(GetAccount), new { id = account.Id }, account).Value;
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
            try
            {
                var account = await _context.Accounts.FindAsync(deleteRequest.Id);
                if (account == null || account.Deleted == true)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                var transactions = _context.Transactions.Where(t => t.AccountId == deleteRequest.Id);
                if(transactions != null)
                {
                    foreach (var transaction in transactions)
                    {
                        transaction.Deleted = true;
                    }
                }
                
                account.Deleted = true;

                await _context.SaveChangesAsync();
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
