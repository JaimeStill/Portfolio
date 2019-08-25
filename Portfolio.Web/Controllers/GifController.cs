using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Core.Upload;
using Portfolio.Data;
using Portfolio.Data.Extensiosn;
using Portfolio.Scripts;

namespace Portfolio.Web.Controllers
{
    [Route("api/[controller]")]
    public class GifController : Controller
    {
        private AppDbContext db;
        private UploadConfig config;
        private IHostingEnvironment env;

        public GifController(AppDbContext db, UploadConfig config, IHostingEnvironment env)
        {
            this.db = db;
            this.config = config;
            this.env = env;
        }

        [HttpGet("[action]")]
        public List<string> GetFlagOptions() => Scripts.Extensions.GifExtensions.GetFlagOptions();

        [HttpGet("[action]")]
        public List<string> GetLogOptions() => Scripts.Extensions.GifExtensions.GetLogOptions();

        [HttpPost("[action]")]
        public async Task<ConsoleOutput> CreateGif([FromBody]GifUpload upload) => await upload.CreateGif(config, env, db);
    }
}