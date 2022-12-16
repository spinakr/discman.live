using System;

namespace Web.DomainPrimitives
{
    public class Year
    {
        public Year(int year)
        {
            if (year < 2000 || year > 2100) throw new ArgumentOutOfRangeException(nameof(year), "Year must be between 1900 and 2500");
            Value = year;
        }

        public int Value { get; }

        public static implicit operator int(Year year) => year.Value;
        public static implicit operator Year(int year) => new(year);
    }
}