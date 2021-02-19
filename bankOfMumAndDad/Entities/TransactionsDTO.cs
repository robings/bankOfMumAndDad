namespace bankOfMumAndDad.Entities
{
    public class TransactionsDTO
    {
        public long AccountId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public decimal OpeningBalance { get; set; }
        public decimal CurrentBalance { get; set; }

        public TransactionListItem[] Transactions { get; set; }
    }
}
