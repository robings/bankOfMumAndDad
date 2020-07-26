using System;
using bankOfMumAndDad.Entities;
using Microsoft.EntityFrameworkCore;

namespace bankOfMumAndDad.Source
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Deposit> Deposits { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .HasKey(a => a.Id);

            modelBuilder.Entity<Deposit>()
                .HasOne(d => d.Account)
                .WithMany(a => a.Deposits)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
