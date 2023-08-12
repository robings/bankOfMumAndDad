using System;
using System.Text.Json;
using System.Threading.Tasks;
using EventStore.Client;

namespace bankOfMumAndDad.EventStore
{
	public class EventStoreWriter: IEventWriter
	{
		private EventStoreClient _eventStoreClient;

		public EventStoreWriter(EventStoreClient eventStoreClient)
		{
			_eventStoreClient = eventStoreClient;
		}

        public async Task WriteEvent(string stream, dynamic evt, string type)
        {
            var eventData = new EventData(
                Uuid.NewUuid(),
                type,
                JsonSerializer.SerializeToUtf8Bytes(evt)
            );

            await _eventStoreClient.AppendToStreamAsync(
                stream,
                StreamState.Any,
                new[] { eventData });
        }
    }
}

