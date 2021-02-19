using System;
namespace bankOfMumAndDad.Entities
{
    public class TransactionListItem
    {
        public decimal Amount { get; set; }
        public decimal Balance { get; set; }
        public DateTime Date { get; set; }
        public TransactionTypes Type { get; set; }
        public string Comments { get; set; }
    }
}
