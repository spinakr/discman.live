using Domain.Primitives;

namespace Discman.Domain.Primitves
{
    public class Username : ValueObject
    {
        public string Value { get; private set; }

        public Username(string value)
        {
            Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}