using Microsoft.EntityFrameworkCore;
using api.Models;


public class ApplicationDbContext : DbContext
{
   public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
      :base(options)
      {
      }
   public DbSet<Document> Documents {get;set;}
   public DbSet<Users> Users { get; set; }
   protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
   {
      optionsBuilder.UseSqlServer("Server=DESKTOP-JBAJDRI\\SQLEXPRESS;Database=EArsivPortal;Trusted_Connection=True;");
   }
}

