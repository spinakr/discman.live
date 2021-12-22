using System.Security.Cryptography;

namespace Web.Users
{
    public class SaltSeasonedHashedPassword
    {
        private const int SaltSize = 24;
        private const int HashSize = 24;
        private const int Iterations = 100000;

        public byte[] Hash { get; private set; }
        public byte[] Salt { get; private set; }

        public SaltSeasonedHashedPassword(string input)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[SaltSize];
            rng.GetBytes(salt);

            var pbkdf2 = new Rfc2898DeriveBytes(input, salt, Iterations);
            Hash = pbkdf2.GetBytes(HashSize);
            Salt = salt;
        }

        public SaltSeasonedHashedPassword(string password, byte[] salt)
        {
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations);
            Hash = pbkdf2.GetBytes(HashSize);
            Salt = salt;
        }
    }
}