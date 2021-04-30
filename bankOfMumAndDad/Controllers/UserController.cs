using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Requests;
using bankOfMumAndDad.Responses;
using bankOfMumAndDad.Source;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace bankOfMumAndDad.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetUsers()
        {
            try
            {
                var result = await _context.Users.Where(a => a.Deleted != true).ToListAsync();
                if (!result.Any())
                {
                    return NotFound(new ApiResponse(false, "No users found", new List<object>()));
                }
                else
                {
                    var convertedResult = from user in result
                                          select new UserDTO
                                          {
                                              FirstName = user.FirstName,
                                              LastName = user.LastName,
                                              Username = user.Username,
                                              Password = "********",
                                              Email = user.Email,
                                          };

                    return Ok(new ApiResponse(true, "Users retrieved.", convertedResult.ToList()));
                }
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse>> PostUser(UserDTO postedUser)
        {
            if (!Validation.ValidateString(postedUser.FirstName) ||
                !Validation.ValidateString(postedUser.LastName))
            {
                return BadRequest(new ApiResponse(false, "Validation Error.", new List<Object>()));
            }

            var rng = RandomNumberGenerator.Create();
            var saltBytes = new Byte[16];
            rng.GetBytes(saltBytes);
            var saltText = Convert.ToBase64String(saltBytes);

            var saltedHashedPassword = PasswordHelper.SaltAndHashPassword(postedUser.Password, saltText);

            var user = new User
            {
                FirstName = postedUser.FirstName,
                LastName = postedUser.LastName,
                Email = postedUser.Email,
                Username = postedUser.Username,
                Salt = saltText,
                Password = saltedHashedPassword,
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new ApiResponse(true, "Successfully created account.", new List<Object>()));
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }

        [HttpDelete]
        public async Task<ActionResult<ApiResponse>> DeleteUser([FromBody] IdOnlyRequest deleteRequest)
        {
            var userId = Convert.ToInt64(deleteRequest.Id);

            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null || user.Deleted == true)
                {
                    return NotFound(new ApiResponse(false, "Account not found.", new List<Object>()));
                }

                user.Deleted = true;

                await _context.SaveChangesAsync();
                return Ok(new ApiResponse(true, "User successfully deleted.", new List<Object>()));
            }
            catch (Exception ex)
            {
                this.HttpContext.Response.StatusCode = 500;
                return new ApiResponse(false, ex.Message, new List<Object>());
            }
        }
    }
}
