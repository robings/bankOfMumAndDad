using System;
namespace bankOfMumAndDad.Entities
{
    public class Transaction
    {
        public long Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public TransactionTypes Type { get; set; }
        public string Comments { get; set; }
        public bool Deleted { get; set; }

        public long AccountId { get; set; }
        public Account Account { get; set; }
    }
}
