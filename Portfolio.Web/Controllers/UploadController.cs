using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Core.Upload;
using Portfolio.Data;
using Portfolio.Data.Entities;
using Portfolio.Data.Extensions;

namespace Portfolio.Web.Controllers
{
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private AppDbContext db;
        private UploadConfig config;

        public UploadController(AppDbContext db, UploadConfig config)
        {
            this.db = db;
            this.config = config;
        }

        [HttpGet("[action]/{userId}")]
        public async Task<List<Upload>> GetUploads([FromRoute]int userId) => await db.GetUploads(userId);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Upload>> GetDeletedUploads([FromRoute]int userId) => await db.GetUploads(userId, true);

        [HttpGet("[action]/{userId}/{search}")]
        public async Task<List<Upload>> SearchUploads([FromRoute]int userId, [FromRoute]string search) => await db.SearchUploads(search, userId);

        [HttpGet("[action]/{userId}/{search}")]
        public async Task<List<Upload>> SearchDeletedUploads([FromRoute]int userId, [FromRoute]string search) => await db.SearchUploads(search, userId, true);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Upload>> GetVideos([FromRoute]int userId) => await db.GetVideos(userId);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Upload>> GetGifs([FromRoute]int userId) => await db.GetGifs(userId);

        [HttpGet("[action]/{uploadId}")]
        public async Task<Upload> GetUpload([FromRoute]int uploadId) => await db.GetUpload(uploadId);

        [HttpGet("[action]/{userId}/{file}")]
        public async Task<Upload> GetUploadByName([FromRoute]int userId, [FromRoute]string file) => await db.GetUpload(file, userId);

        [HttpGet("[action]/{uploadId}")]
        public async Task<List<Folder>> GetUploadFolders([FromRoute]int uploadId) => await db.GetUploadFolders(uploadId);

        [HttpGet("[action]/{userId}/{name}")]
        public async Task<List<Upload>> GetExcludedUploads([FromRoute]int userId, [FromRoute]string name) => await db.GetExcludedUploads(name, userId);

        [HttpPost("[action]/{userId}")]
        [DisableRequestSizeLimit]
        public async Task<List<Upload>> UploadFiles([FromRoute]int userId) => 
            await db.UploadFiles(
                Request.Form.Files,
                config.DirectoryBasePath,
                config.UrlBasePath,
                userId
            );

        [HttpPost("[action]")]
        public async Task ToggleUploadDeleted([FromBody]Upload upload) => await db.ToggleUploadDeleted(upload);

        [HttpPost("[action]")]
        public async Task RemoveUpload([FromBody]Upload upload) => await db.RemoveUpload(upload);
    }
}