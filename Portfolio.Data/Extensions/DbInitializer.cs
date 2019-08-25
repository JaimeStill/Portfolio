using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Portfolio.Data.Entities;
using Portfolio.Identity.Mock;

namespace Portfolio.Data.Extensions
{
    public static class DbInitializer
    {
        private static async Task<User> InitializeSeedUser(this AppDbContext db)
        {
            var user = await db.Users
                .FirstOrDefaultAsync(x => x.Guid == Guid.Parse("f16f6b21-c2d9-4dcf-a8d2-96906ca49872"));
            user.IsAdmin = true;
            await db.SaveChangesAsync();
            return user;            
        }

        public static async Task Initialize(this AppDbContext db)
        {
            Console.WriteLine("Initializing database");
            await db.Database.MigrateAsync();
            Console.WriteLine("Database initialized");

            User user;

            if (! await db.Users.AnyAsync())
            {
                Console.WriteLine("Seeding Users...");
                foreach (var u in MockProvider.AdUsers)
                {
                    Console.WriteLine($"Seeding {u.UserPrincipalName}...");
                    await u.SyncUser(db);
                }

                user = await db.InitializeSeedUser();
            }
            else
            {
                Console.WriteLine("Retrieving Seed User...");
                user = await db.InitializeSeedUser();
            }

            if (! await db.Folders.AnyAsync())
            {
                Console.WriteLine("Seeding Folders...");
                var folders = new List<Folder>
                {
                    new Folder
                    {
                        UserId = user.Id,
                        Name = "project",
                        Description = "Files necessary to execute some project"
                    },
                    new Folder
                    {
                        UserId = user.Id,
                        Name = "personal",
                        Description = "Personal files for safekeeping"
                    },
                    new Folder
                    {
                        UserId = user.Id,
                        Name = "time-capsule",
                        Description = "Store these for posterity. Do not open until 3020!"
                    }
                };

                await db.Folders.AddRangeAsync(folders);
                await db.SaveChangesAsync();
            }

            if (! await db.Channels.AnyAsync())
            {
                Console.WriteLine("Seeding Channels...");
                var channels = new List<Channel>
                {
                    new Channel
                    {
                        UserId = user.Id,
                        Name = "interview",
                        Description = "A channel for showing interview things"
                    },
                    new Channel
                    {
                        UserId = user.Id,
                        Name = "demonstration",
                        Description = "A channel to demo capabilities"
                    }
                };

                await db.Channels.AddRangeAsync(channels);
                await db.SaveChangesAsync();
            }
        }
    }
}