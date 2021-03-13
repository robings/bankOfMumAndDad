using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Source;
using bankOfMumAndDad.TokenService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace bankOfMumAndDad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class LoginController : Controller
    {
        // GET: /<controller>/
        private readonly IConfiguration _config;
        private readonly DataContext _context;
        private readonly TokenGenerator _tokenGenerator;

        public LoginController(IConfiguration config, DataContext context)
        {
            _config = config;
            _context = context;
            _tokenGenerator = new TokenGenerator(_config);
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] LoginDTO login)
        {
            IActionResult response = Unauthorized();
            var userAuthenticated = AuthenticateUser(login);

            if (userAuthenticated.Result)
            {
                var tokenString = _tokenGenerator.GenerateJSONWebToken();
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        private async Task<bool> AuthenticateUser(LoginDTO login)
        {
            var userAccount = _context.Users.Where(u => u.Username == login.Username && !u.Deleted).FirstOrDefault();            

            var userAuthenticated = false;

            if (userAccount != null)
            {
                var userPassword = PasswordHelper.SaltAndHashPassword(login.Password, userAccount.Salt);

                if (login.Username == userAccount.Username && userPassword == userAccount.Password)
                {
                    userAuthenticated = true;
                    userAccount.LastSuccessfulLogin = DateTime.UtcNow;
                }
                else
                {
                    if (DateTime.UtcNow - userAccount.LastFailedLogin > TimeSpan.FromHours(24))
                    {
                        userAccount.DelayInMs = 0;
                    }

                    var currentDelay = userAccount.DelayInMs;
                    Thread.Sleep(currentDelay);
                    userAccount.DelayInMs = currentDelay == 0 ? 1000 : currentDelay * 2;
                    userAccount.LastFailedLogin = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return userAuthenticated;
        }
    }
}
