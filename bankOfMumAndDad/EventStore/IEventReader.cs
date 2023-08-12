using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EventStore.Client;

namespace bankOfMumAndDad.EventStore
{
	public interface IEventReader
	{
		public Task<IEnumerable<ResolvedEvent>> ReadFromStream(string stream);
	}
}

