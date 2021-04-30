using System;
namespace bankOfMumAndDad.Entities
{
    public class User
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public string Email { get; set; }
        public DateTime LastSuccessfulLogin { get; set; }
        public DateTime LastFailedLogin { get; set; }
        public int DelayInMs { get; set; }
        public bool Deleted { get; set; }
    }
}
