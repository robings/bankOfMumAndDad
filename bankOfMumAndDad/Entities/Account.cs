using System.Collections.Generic;

namespace bankOfMumAndDad.Entities
{
    public class Account
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public decimal OpeningBalance { get; set; }
        public decimal CurrentBalance { get; set; }
        public bool Deleted { get; set; }

        public List<Transaction> Transactions { get; set; }
    }
}
