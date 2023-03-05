using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventStore.Client;

namespace bankOfMumAndDad.EventStore
{
	public class EventStoreReader : IEventReader
	{
        private EventStoreClient _eventStoreClient;

        public EventStoreReader(EventStoreClient eventStoreClient)
		{
            _eventStoreClient = eventStoreClient;
        }

        public async Task<IEnumerable<ResolvedEvent>> ReadFromStream(string stream)
        {
            var result = _eventStoreClient.ReadStreamAsync(
                Direction.Forwards,
                stream,
                StreamPosition.Start);

            var events = await result.ToListAsync();

            return events;
        }
    }
}

