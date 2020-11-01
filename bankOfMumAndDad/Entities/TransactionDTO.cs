using System;
namespace bankOfMumAndDad.Entities
{
    public class TransactionDTO
    {
        public string Amount { get; set; }
        public string Date { get; set; }
        public string Type { get; set; }
        public string Comments { get; set; }
        public string AccountId { get; set; }
    }
}
