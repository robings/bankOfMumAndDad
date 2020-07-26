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

namespace bankOfMumAndDad.Controllers
{
    [Route("api/Deposit")]
    [ApiController]
    public class DepositController : ControllerBase
    {
        private readonly DataContext _context;

        public DepositController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Deposit
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Deposit>>> GetDeposits([FromBody] IdOnlyRequest getByAccountIdRequest)
        {
            return await _context.Deposits.Where(d => d.AccountId == getByAccountIdRequest.Id).ToListAsync();
        }

        // PUT: api/Deposit/
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public ContentResult PutDeposit()
        {
            return Content("Action not supported");
        }

        // POST: api/Deposit
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Deposit>> PostDeposit(Deposit deposit)
        {
            _context.Deposits.Add(deposit);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/Deposit/
        [HttpDelete]
        public ContentResult DeleteDeposit()
        {
            return Content("Action not supported");
        }

        private bool DepositExists(long id)
        {
            return _context.Deposits.Any(e => e.Id == id);
        }
    }
}
