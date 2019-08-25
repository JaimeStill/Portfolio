using Microsoft.EntityFrameworkCore;
using Portfolio.Data.Entities;
using System.Linq;

namespace Portfolio.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Channel> Channels { get; set; }
        public DbSet<ChannelMessage> ChannelMessages { get; set; }
        public DbSet<ChannelUser> ChannelUsers { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<FolderUpload> FolderUploads { get; set; }
        public DbSet<Upload> Uploads { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Model
                .GetEntityTypes()
                .ToList()
                .ForEach(x =>
                {
                    modelBuilder
                        .Entity(x.Name)
                        .ToTable(x.Name.Split('.').Last());
                });

            modelBuilder
                .Entity<Upload>()
                .HasMany(x => x.UploadFolders)
                .WithOne(x => x.Upload)
                .HasForeignKey(x => x.UploadId)
                .IsRequired();

            modelBuilder
                .Entity<User>()
                .HasMany(x => x.UserChannels)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired();

            modelBuilder
                .Entity<ChannelMessage>()
                .HasOne(x => x.Channel)
                .WithMany(x => x.ChannelMessages)
                .HasForeignKey(x => x.ChannelId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<ChannelMessage>()
                .HasOne(x => x.User)
                .WithMany(x => x.ChannelMessages)
                .HasForeignKey(x => x.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<ChannelUser>()
                .HasOne(x => x.Channel)
                .WithMany(x => x.ChannelUsers)
                .HasForeignKey(x => x.ChannelId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<ChannelUser>()
                .HasOne(x => x.User)
                .WithMany(x => x.UserChannels)
                .HasForeignKey(x => x.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<FolderUpload>()
                .HasOne(x => x.Folder)
                .WithMany(x => x.FolderUploads)
                .HasForeignKey(x => x.FolderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<FolderUpload>()
                .HasOne(x => x.Upload)
                .WithMany(x => x.UploadFolders)
                .HasForeignKey(x => x.UploadId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
