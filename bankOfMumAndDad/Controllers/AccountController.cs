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
            var response = new ApiResponse();
            try
            {
                var result = await _context.Accounts.ToListAsync();
                if (!result.Any())
                {
                    response.Success = false;
                    response.Message = "No accounts found";
                    response.Data = result;
                    return NotFound(response);
                } else
                {
                    response.Success = true;
                    response.Message = "Accounts retrieved.";
                    response.Data = result;
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Data = new List<Object>();
                this.HttpContext.Response.StatusCode = 500;
                return response;
            }
        }

        // GET: api/Account
        [HttpGet]
        public async Task<ActionResult<Account>> GetAccount([FromBody] IdOnlyRequest getByIdRequest)
        {
            var account = await _context.Accounts.FindAsync(getByIdRequest.Id);

            if (account == null)
            {
                return NotFound();
            }

            return account;
        }

        // PUT: api/Account/
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<IActionResult> PutAccount([FromBody] PutRequest putRequest)
        {
            var id = putRequest.Id;
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            account.FirstName = putRequest.FirstName ?? account.FirstName;

            account.LastName = putRequest.LastName ?? account.LastName;

            _context.Entry(account).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(putRequest.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Account updated");
        }

        // POST: api/Account
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Account>> PostAccount(Account account)
        {
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // return CreatedAtAction("GetAccount", new { id = account.Id }, account);
            return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, account);
        }

        // DELETE: api/Account
        [HttpDelete]
        public async Task<ActionResult<Account>> DeleteAccount([FromBody] IdOnlyRequest deleteRequest)
        {
            var id = deleteRequest.Id;
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return account;
        }

        private bool AccountExists(long id)
        {
            return _context.Accounts.Any(e => e.Id == id);
        }
    }
}
