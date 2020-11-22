using System;
using System.Security.Cryptography;
using System.Text;

namespace bankOfMumAndDad.Controllers
{
    public static class PasswordHelper
    {
        public static string SaltAndHashPassword(string password, string salt)
        {
            var sha = SHA256.Create();
            var saltedPassword = password + salt;
            return Convert.ToBase64String(
                sha.ComputeHash(Encoding.Unicode.GetBytes(saltedPassword)));
        }
    }
}
