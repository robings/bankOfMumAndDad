using NUnit.Framework;

namespace bankOfMumAndDad.Tests
{
    public class Tests
    {
        [TestCase("")]
        [TestCase("    \n \t  ")]
        public void ValidateString_GivenNullOrWhitespaceString_ReturnsFalse(string invalidString)
        {
            Assert.That(Validation.ValidateString(invalidString), Is.False);
        }

        [TestCase("Hello Everybody")]
        [TestCase("120")]
        [TestCase("Bibble-bobble")]
        public void ValidateString_GivenValidString_ReturnsTrue(string validString)
        {
            Assert.That(Validation.ValidateString(validString), Is.True);
        }

        [Test]
        public void ValidateString_GivenTooLongString_ReturnsFalse()
        {
            var aVeryLongString = "thequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydog";

            Assert.That(Validation.ValidateString(aVeryLongString), Is.False);
        }
    }
}
