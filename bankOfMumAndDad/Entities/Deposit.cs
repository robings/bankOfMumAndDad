using System;
namespace bankOfMumAndDad.Entities
{
    public class Deposit
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; }
        public bool Deleted { get; set; }

        public long AccountId { get; set; }
        public Account Account { get; set; }
    }
}
