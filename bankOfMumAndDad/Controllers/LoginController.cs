using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Source;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace bankOfMumAndDad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        // GET: /<controller>/
        private readonly IConfiguration _config;
        private readonly DataContext _context;

        public LoginController(IConfiguration config, DataContext context)
        {
            _config = config;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] loginDTO login)
        {
            IActionResult response = Unauthorized();
            var userAuthenticated = AuthenticateUser(login);

            if (userAuthenticated)
            {
                var tokenString = GenerateJSONWebToken();
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        private object GenerateJSONWebToken()
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                null,
                expires: DateTime.UtcNow.AddMinutes(5),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool AuthenticateUser(loginDTO login)
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

        public class loginDTO
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}
