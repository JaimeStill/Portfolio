using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Data;
using Portfolio.Data.Entities;
using Portfolio.Data.Extensions;

namespace Portfolio.Web.Controllers
{
    [Route("api/[controller]")]
    public class FolderController : Controller
    {
        private AppDbContext db;

        public FolderController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]/{userId}")]
        public async Task<List<Folder>> GetFolders([FromRoute]int userId) => await db.GetFolders(userId);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Folder>> GetDeletedFolders([FromRoute]int userId) => await db.GetFolders(userId, true);

        [HttpGet("[action]/{userId}/{search}")]
        public async Task<List<Folder>> SearchFolders([FromRoute]int userId, [FromRoute]string search) => await db.SearchFolders(search, userId);

        [HttpGet("[action]/{userId}/{search}")]
        public async Task<List<Folder>> SearchDeletedFolders([FromRoute]int userId, [FromRoute]string search) => await db.SearchFolders(search, userId, true);

        [HttpGet("[action]/{id}")]
        public async Task<Folder> GetFolder([FromRoute]int id) => await db.GetFolder(id);

        [HttpGet("[action]/{userId}/{name}")]
        public async Task<Folder> GetFolderByName([FromRoute]int userId, [FromRoute]string name) => await db.GetFolder(name, userId);

        [HttpGet("[action]/{userId}/{name}")]
        public async Task<List<Upload>> GetFolderUploads([FromRoute]int userId, [FromRoute]string name) => await db.GetFolderUploads(name, userId);

        [HttpGet("[action]/{userId}/{file}")]
        public async Task<List<Folder>> GetExcludedFolders([FromRoute]int userId, [FromRoute]string file) => await db.GetExcludedFolders(file, userId);

        [HttpPost("[action]/{userId}")]
        public async Task<bool> ValidateFolderName([FromRoute]int userId, [FromBody]Folder folder) => await db.ValidateFolderName(folder, userId);

        [HttpPost("[action]")]
        public async Task AddFolder([FromBody]Folder folder) => await db.AddFolder(folder);

        [HttpPost("[action]")]
        public async Task UpdateFolder([FromBody]Folder folder) => await db.UpdateFolder(folder);

        [HttpPost("[action]")]
        public async Task ToggleFolderDeleted([FromBody]Folder folder) => await db.ToggleFolderDeleted(folder);

        [HttpPost("[action]")]
        public async Task RemoveFolder([FromBody]Folder folder) => await db.RemoveFolder(folder);

        [HttpPost("[action]")]
        public async Task AddFolderUploads([FromBody]List<FolderUpload> folderUploads) => await db.AddFolderUploads(folderUploads);

        [HttpPost("[action]/{name}")]
        public async Task RemoveFolderUpload([FromRoute]string name, [FromBody]Upload upload) => await db.RemoveFolderUpload(name, upload);
    }
}