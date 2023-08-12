using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Events;
using EventStore.Client;

namespace bankOfMumAndDad.EventStore
{
	public static class AccountEventProcessor
	{
		public static Account ProcessEvents(IEnumerable<ResolvedEvent> events)
		{
			var account = new Account();

			foreach (var @event in events)
			{
				ProcessEvent(@event, account);
			}

			return account;
		}

        private static void ProcessEvent(ResolvedEvent @event, Account account)
        {
            switch (@event.Event.EventType)
            {
                case nameof(AccountCreated):
                    var entity = JsonSerializer.Deserialize<AccountCreated>(Encoding.UTF8.GetString(@event.Event.Data.ToArray()));
                    account.Id = entity.Id;
                    account.FirstName = entity.FirstName;
                    account.LastName = entity.LastName;
                    account.OpeningBalance = entity.OpeningBalance;
                    account.CurrentBalance = entity.OpeningBalance;
                    break;
                case nameof(AccountDeleted):
                    account.Deleted = true;
                    break;
                case nameof(AccountFirstNameChanged):
                    var accountFirstNameChanged = JsonSerializer.Deserialize<AccountFirstNameChanged>(Encoding.UTF8.GetString(@event.Event.Data.ToArray()));
                    account.FirstName = accountFirstNameChanged.FirstName;
                    break;
                case nameof(AccountLastNameChanged):
                    var accountLastNameChanged = JsonSerializer.Deserialize<AccountLastNameChanged>(Encoding.UTF8.GetString(@event.Event.Data.ToArray()));
                    account.LastName = accountLastNameChanged.LastName;
                    break;
                default:
                    break;
            };
        }
    }
}

