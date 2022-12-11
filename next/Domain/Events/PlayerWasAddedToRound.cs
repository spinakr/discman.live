namespace Discman.Domain.Events
{
    public class PlayerWasAddedToRound : EventBase
    {
        public Guid RoundId { get; }
        public Guid PlayerId { get; }
        public string Username { get; }

        public PlayerWasAddedToRound(Guid roundId, Guid playerId, string username)
        {
            RoundId = roundId;
            PlayerId = playerId;
            Username = username;
        }
    }
}