using System;
using System.Text.RegularExpressions;

namespace bankOfMumAndDad
{
    public static class Validation
    {
        public static bool ValidateString(this string stringToValidate)
        {
            Regex regex = new Regex(@"^[a-zA-Z\d\s-]*$");

            if (stringToValidate.Length > 256 || stringToValidate.Length <= 0 || string.IsNullOrWhiteSpace(stringToValidate))
            {
                return false;
            }

            if (regex.IsMatch(stringToValidate))
            {
                return true;
            }

            return false;
        }
    }
}
