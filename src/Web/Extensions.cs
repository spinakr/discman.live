using System;
using System.Collections.Generic;
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
        
        public static IEnumerable<U> Scan<T, U>(this IEnumerable<T> input, Func<U, T, U> next, U state) {
            yield return state;
            foreach(var item in input) {
                state = next(state, item);
                yield return state;
            }
        }
    }
}