using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Source;
using bankOfMumAndDad.Requests;
using bankOfMumAndDad.Responses;

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
                var result = await _context.Accounts.ToListAsync();
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
        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetAccount([FromBody] IdOnlyRequest getByIdRequest)
        {
            try
            {
                var account = await _context.Accounts.FindAsync(getByIdRequest.Id);

                if (account == null)
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

                account.FirstName = putRequest.FirstName ?? account.FirstName;

                account.LastName = putRequest.LastName ?? account.LastName;

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
        public async Task<ActionResult<ApiResponse>> PostAccount(Account account)
        {
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

        // DELETE: api/Account
        [HttpDelete]
        public async Task<ActionResult<ApiResponse>> DeleteAccount([FromBody] IdOnlyRequest deleteRequest)
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
