using System.Runtime.CompilerServices;

namespace Web
{
    public static class Extensions
    {
        public static T[] Populate<T>(this T[] arr, T value)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                arr[i] = value;
            }

            return arr;
        }
    }
}