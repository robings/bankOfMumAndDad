using System;
using bankOfMumAndDad.Source;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace bankOfMumAndDad.Tests
{
    public class SqliteInMemoryConnectionFactory : IDisposable
    {
        private bool disposedValue = false;

        public DataContext CreateSqliteContext()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            var options = new DbContextOptionsBuilder().UseSqlite(connection).Options;

            var context = new DataContext(options);

            if (context != null)
            {
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();
            }

            return context;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
    }   
}
