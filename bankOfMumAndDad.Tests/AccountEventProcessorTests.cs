using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using bankOfMumAndDad.Entities;
using bankOfMumAndDad.Events;
using bankOfMumAndDad.EventStore;
using EventStore.Client;
using NUnit.Framework;

namespace bankOfMumAndDad.Tests
{
	public class AccountEventProcessorTests
	{
        private static long id = 1;
        private static string streamId = $"stream{id}";
        private static AccountCreated accountCreated = new AccountCreated
        {
            Id = id,
            TimeStamp = DateTime.UtcNow,
            FirstName = "InitialFirstName",
            LastName = "InitialLastName",
            OpeningBalance = 100,
        };

        private static AccountLastNameChanged accountLastNameChanged = new AccountLastNameChanged
        {
            Id = id,
            TimeStamp = DateTime.UtcNow,
            LastName = "ChangedLastName",
        };

        private static AccountDeleted accountDeleted = new AccountDeleted
        {
            Id = id,
            TimeStamp = DateTime.UtcNow,
        };

        List<ResolvedEvent> _resolvedEvents = new List<ResolvedEvent>
            {
                new ResolvedEvent(
                    new EventRecord(
                        streamId,
                        new Uuid(),
                        1,
                        Position.Start,
                        new Dictionary<string, string>
                        {
                            { "type", nameof(AccountCreated) },
                            { "created", "1" },
                            { "content-type", "application/json" },
                        },
                        JsonSerializer.SerializeToUtf8Bytes(accountCreated),
                        Array.Empty<byte>()),
                    null,
                    null),
                new ResolvedEvent(
                    new EventRecord(
                        streamId,
                        new Uuid(),
                        2,
                        Position.Start,
                        new Dictionary<string, string>
                        {
                            { "type", nameof(AccountLastNameChanged) },
                            { "created", "2" },
                            { "content-type", "application/json" },
                        },
                        JsonSerializer.SerializeToUtf8Bytes(accountLastNameChanged),
                        Array.Empty<byte>()),
                    null,
                    null),
                new ResolvedEvent(
                    new EventRecord(
                        streamId,
                        new Uuid(),
                        3,
                        Position.Start,
                        new Dictionary<string, string>
                        {
                            { "type", nameof(AccountDeleted) },
                            { "created", "3" },
                            { "content-type", "application/json" },
                        },
                        JsonSerializer.SerializeToUtf8Bytes(accountDeleted),
                        Array.Empty<byte>()),
                    null,
                    null),
            };

        [Test]
        public void GetAccountFromEs_WithInitialEvent_GetsExpectedAccount()
        {
            var @event = _resolvedEvents[0];

            var account = AccountEventProcessor.ProcessEvents(new List<ResolvedEvent> { @event });

            Assert.That(account.Id, Is.EqualTo(id));
            Assert.That(account.OpeningBalance, Is.EqualTo(100));
            Assert.That(account.FirstName, Is.EqualTo("InitialFirstName"));
            Assert.That(account.LastName, Is.EqualTo("InitialLastName"));
            Assert.That(account.Deleted, Is.False);

        }

        [Test]
        public void GetAccountFromEs_WithInitialEvent_AndFirstNameChanged_GetsExpectedAccount()
        {
            var accountFirstNameChanged = new AccountFirstNameChanged
            {
                Id = id,
                TimeStamp = DateTime.UtcNow,
                FirstName = "New first name",
            };

            var @event = _resolvedEvents[0];
            var eventTwo = new ResolvedEvent(
                    new EventRecord(
                        streamId,
                        new Uuid(),
                        2,
                        Position.Start,
                        new Dictionary<string, string>
                        {
                            { "type", nameof(AccountFirstNameChanged) },
                            { "created", "4" },
                            { "content-type", "application/json" },
                        },
                        JsonSerializer.SerializeToUtf8Bytes(accountFirstNameChanged),
                        Array.Empty<byte>()),
                    null,
                    null);

            var account = AccountEventProcessor.ProcessEvents(new List<ResolvedEvent> { @event, eventTwo });

            Assert.That(account.Id, Is.EqualTo(id));
            Assert.That(account.OpeningBalance, Is.EqualTo(100));
            Assert.That(account.FirstName, Is.EqualTo(accountFirstNameChanged.FirstName));
            Assert.That(account.LastName, Is.EqualTo("InitialLastName"));
            Assert.That(account.Deleted, Is.False);

        }

        [Test]
        public void GetAccountFromEs_WithMultipleEvents_GetsExpectedAccount()
        {
            var account = AccountEventProcessor.ProcessEvents(_resolvedEvents);

            Assert.That(account.Id, Is.EqualTo(id));
            Assert.That(account.OpeningBalance, Is.EqualTo(100));
            Assert.That(account.FirstName, Is.EqualTo("InitialFirstName"));
            Assert.That(account.LastName, Is.EqualTo("ChangedLastName"));
            Assert.That(account.Deleted, Is.True);
        }
    }
}

