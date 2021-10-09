using NUnit.Framework;

namespace bankOfMumAndDad.Tests
{
    public class Tests
    {
        [TestCase("")]
        [TestCase("    \n \t  ")]
        public void ValidateString_GivenNullOrWhitespaceString_ReturnsFalse(string invalidString)
        {
            Assert.That(invalidString.ValidateString(), Is.False);
        }

        [TestCase("Hello Everybody")]
        [TestCase("120")]
        [TestCase("Bibble-bobble")]
        public void ValidateString_GivenValidString_ReturnsTrue(string validString)
        {
            Assert.That(validString.ValidateString(), Is.True);
        }

        [Test]
        public void ValidateString_GivenTooLongString_ReturnsFalse()
        {
            var aVeryLongString = "thequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydogthequickbrownfoxjumpsoverthelazydog";

            Assert.That(aVeryLongString.ValidateString(), Is.False);
        }
    }
}
