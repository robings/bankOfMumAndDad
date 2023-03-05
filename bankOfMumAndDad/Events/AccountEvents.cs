using System;
namespace bankOfMumAndDad.Events
{
	public record AccountCreated
	{
        public long Id { get; init; }
        public DateTime TimeStamp { get; init; }
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public decimal OpeningBalance { get; init; }
    }

    public record AccountDeleted
    {
        public long Id { get; init; }
        public DateTime TimeStamp { get; init; }
    }
}

