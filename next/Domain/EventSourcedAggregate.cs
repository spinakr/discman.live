using System.Text.Json;
using Discman.Domain.Events;

namespace Discman.Domain
{
    public abstract class EventSourcedAggregate
    {
        public Guid Id { get; protected set; }

        public long Version { get; set; }

        public List<object> PendingEvents { get; private set; }

        public void ClearPendingEvents()
        {
            PendingEvents.Clear();
        }

        protected EventSourcedAggregate(IEnumerable<EventBase> events) : this()
        {
            foreach (var @event in events)
            {
                Mutate(@event);
            }
        }

        protected EventSourcedAggregate()
        {
            PendingEvents = new List<object>();
        }

        protected void Append(EventBase @event)
        {
            PendingEvents.Add(@event);
            Mutate(@event);
        }

        private void Mutate(EventBase @event)
        {
            System.Console.WriteLine(@event);
            //Exexute correct method on the aggregate
            ((dynamic)this).Apply((dynamic)@event);
        }
    }
}