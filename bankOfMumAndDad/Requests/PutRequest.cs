using System;
namespace bankOfMumAndDad.Requests
{
    public class PutRequest
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public decimal? CurrentBalance { get; set; }
    }
}
