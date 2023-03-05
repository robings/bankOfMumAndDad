using System;
using System.Threading.Tasks;

namespace bankOfMumAndDad.EventStore
{
	public interface IEventWriter
	{
		public Task WriteEvent(string stream, dynamic evt, string type);
	}
}

