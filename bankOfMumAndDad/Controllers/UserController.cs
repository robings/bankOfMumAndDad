﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
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
                    return NotFound(new ApiResponse(false, "No users found", result));
                }
                else
                {
                    return Ok(new ApiResponse(true, "Users retrieved.", result));
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

            var saltedHashedPassword = SaltAndHashPassword(postedUser.Password, saltText);

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

        private static string SaltAndHashPassword(string password, string salt)
        {
            var sha = SHA256.Create();
            var saltedPassword = password + salt;
            return Convert.ToBase64String(
                sha.ComputeHash(Encoding.Unicode.GetBytes(saltedPassword)));
        }
    }
}
