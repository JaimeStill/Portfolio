using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Data;
using Portfolio.Data.Entities;
using Portfolio.Data.Extensions;
using Portfolio.Identity;

namespace Portfolio.Web.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private AppDbContext db;
        private IUserProvider identity;

        public UserController(AppDbContext db, IUserProvider identity)
        {
            this.db = db;
            this.identity = identity;
        }

        [HttpGet("[action]")]
        public async Task<List<AdUser>> GetDomainUsers() => await identity.GetDomainUsers();

        [HttpGet("[action]/{search}")]
        public async Task<List<AdUser>> SearchDomainUsers([FromRoute]string search) => await identity.SearchDomainUsers(search);

        [HttpGet("[action]")]
        public async Task<List<User>> GetUsers() => await db.GetUsers();

        [HttpGet("[action]")]
        public async Task<List<User>> GetDeletedUsers() => await db.GetUsers(true);

        [HttpGet("[action]/{search}")]
        public async Task<List<User>> SearchUsers([FromRoute]string search) => await db.SearchUsers(search);

        [HttpGet("[action]/{search}")]
        public async Task<List<User>> SearchDeletedUsers([FromRoute]string search) => await db.SearchUsers(search, true);

        [HttpGet("[action]/{id}")]
        public async Task<User> GetUser([FromRoute]int id) => await db.GetUser(id);

        [HttpGet("[action]/{username}")]
        public async Task<User> GetUserByName([FromRoute]string username) => await db.GetUser(username);

        [HttpGet("[action]/{guid}")]
        public async Task<bool> CheckIsAdmin([FromRoute]Guid guid) => await db.CheckIsAdmin(guid);

        [HttpGet("[action]")]
        public async Task<User> SyncUser() => await identity.CurrentUser.SyncUser(db);

        [HttpPost("[action]")]
        public async Task SwitchUser([FromBody]AdUser user)
        {
            await HttpContext.SignOutAsync();
            HttpContext.Session.SetString("SessionUser", user.SamAccountName);
        }

        [HttpPost("[action]")]
        public async Task<bool> ValidateUsername([FromBody]User user) => await db.ValidateUsername(user);

        [HttpPost("[action]")]
        public async Task AddUser([FromBody]AdUser adUser) => await db.AddUser(adUser);

        [HttpPost("[action]")]
        public async Task UpdateUser([FromBody]User user) => await db.UpdateUser(user);

        [HttpPost("[action]")]
        public async Task ToggleUserDeleted([FromBody]User user) => await db.ToggleUserDeleted(user);

        [HttpPost("[action]")]
        public async Task ToggleUserAdmin([FromBody]User user) => await db.ToggleUserAdmin(user);

        [HttpPost("[action]")]
        public async Task RemoveUser([FromBody]User user) => await db.RemoveUser(user);
    }
}