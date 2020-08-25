using System.Text.Json.Serialization;

namespace Web.Feeds.Domain
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ItemType
    {
        Round,
        Hole
    }
}