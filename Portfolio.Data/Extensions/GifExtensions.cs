using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Portfolio.Core.Extensions;
using Portfolio.Core.Upload;
using Portfolio.Data.Entities;
using Portfolio.Scripts;
using Portfolio.Scripts.Extensions;

namespace Portfolio.Data.Extensiosn
{
    public static class GifExtensions
    {
        public static async Task<ConsoleOutput> CreateGif(this GifUpload upload, UploadConfig config, IHostingEnvironment env, AppDbContext db)
        {
            var gif = upload.Video.GenerateGifUpload(config.DirectoryBasePath, config.UrlBasePath);
            upload.Options.CompleteGifOptions(upload.Video, gif, env);
            upload.Options.CreateTempDirectory();
            var result = await upload.Options.ConvertToGif();

            if (!result.HasError)
            {
                upload.Options.DeleteTempDirectory();
                gif.Size = gif.Path.GetFileLength();
                await gif.SaveGif(db);
            }
            else if (result.HasError && string.IsNullOrEmpty(result.Error))
            {
                result.Error = "An unidentified error occurred during conversion";
                upload.Options.DeleteTempDirectory();
            }

            return result;
        }

        static Upload GenerateGifUpload(this Upload video, string path, string url)
        {
            var f = video.Name.Replace(".mp4", ".gif").CreateSafeGifName(path, url);

            var gif = new Upload
            {
                UserId = video.UserId,
                Url = $"{url}{f}",
                Path = $"{path}{f}",
                File = f,
                Name = video.Name.Replace(".mp4", ".gif"),
                FileType = "image/gif",
                UploadDate = DateTime.Now,
                IsDeleted = false
            };

            return gif;
        }

        static string CreateSafeGifName(this string gif, string path, string url)
        {
            var increment = 0;
            var fileName = gif.UrlEncode();
            var newName = fileName;

            while (File.Exists(path + newName))
            {
                var extension = fileName.Split('.').Last();
                newName = $"{fileName.Replace($".{extension}", "")}_{++increment}.{extension}";
            }

            return newName;
        }

        static void CompleteGifOptions(this GifOptions options, Upload video, Upload gif, IHostingEnvironment env)
        {
            options.Exec = env.GetExecPath();
            options.Temp = env.GetTempPath();
            options.Origin = video.Path;
            options.Destination = gif.Path;
        }

        static void CreateTempDirectory(this GifOptions options)
        {
            if (!(Directory.Exists(options.Temp)))
            {
                Directory.CreateDirectory(options.Temp);
            }
        }

        static void DeleteTempDirectory(this GifOptions options)
        {
            if (Directory.Exists(options.Temp))
            {
                Directory.Delete(options.Temp, true);
            }
        }

        static string GetExecPath(this IHostingEnvironment env) => $@"{env.WebRootPath}\resources\ffmpeg.exe";
        static string GetTempPath(this IHostingEnvironment env) => $@"{env.WebRootPath}\temp\{Guid.NewGuid().ToString()}\";

        static long GetFileLength(this string path) => new FileInfo(path).Length;

        static async Task SaveGif(this Upload gif, AppDbContext db)
        {
            await db.Uploads.AddAsync(gif);
            await db.SaveChangesAsync();
        }
    }
}