using System.Linq;
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

            if (userAuthenticated)
            {
                var tokenString = _tokenGenerator.GenerateJSONWebToken();
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        private bool AuthenticateUser(LoginDTO login)
        {
            var userAccount = _context.Users.Where(u => u.Username == login.Username && !u.Deleted).FirstOrDefault();            

            var userAuthenticated = false;

            if (userAccount != null)
            {
                var userPassword = PasswordHelper.SaltAndHashPassword(login.Password, userAccount.Salt);

                if (login.Username == userAccount.Username && userPassword == userAccount.Password)
                {
                    userAuthenticated = true;
                }
            }

            return userAuthenticated;
        }
    }
}
