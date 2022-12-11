using System.Text.Json;

namespace Discman.Domain.Events;

public abstract class EventBase
{
    public override string ToString()
    {
        return JsonSerializer.Serialize((dynamic)this, new JsonSerializerOptions { WriteIndented = true });
    }
}