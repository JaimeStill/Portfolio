using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Data;
using Portfolio.Data.Entities;
using Portfolio.Data.Extensions;

namespace Portfolio.Web.Controllers
{
    [Route("api/[controller]")]
    public class ChannelController : Controller
    {
        private AppDbContext db;

        public ChannelController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public async Task<List<Channel>> GetChannels() => await db.GetChannels();

        [HttpGet("[action]/{search}")]
        public async Task<List<Channel>> SearchChannels([FromRoute]string search) => await db.SearchChannels(search);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Channel>> GetUserCreatedChannels([FromRoute]int userId) => await db.GetUserCreatedChannels(userId);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Channel>> GetDeletedUserCreatedChannels([FromRoute]int userId) => await db.GetUserCreatedChannels(userId, true);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Channel>> GetUserJoinedChannels([FromRoute]int userId) => await db.GetUserJoinedChannels(userId);

        [HttpGet("[action]/{channelId}")]
        public async Task<List<ChannelUser>> GetChannelUsers([FromRoute]int channelId) => await db.GetChannelUsers(channelId);

        [HttpGet("[action]/{channelId}")]
        public async Task<List<ChannelUser>> GetChannelAdmins([FromRoute]int channelId) => await db.GetChannelAdmins(channelId);

        [HttpGet("[action]/{channelId}")]
        public async Task<List<ChannelMessage>> GetChannelMessages([FromRoute]int channelId) => await db.GetChannelMessages(channelId);

        [HttpGet("[action]/{name}")]
        public async Task<Channel> GetChannel([FromRoute]string name) => await db.GetChannel(name);

        [HttpGet("[action]/{channelId}/{userId}")]
        public async Task<ChannelUser> GetChannelUser([FromRoute]int channelId, [FromRoute]int userId) => await db.GetChannelUser(channelId, userId);

        [HttpPost("[action]")]
        public async Task<bool> ValidateChannelName([FromBody]Channel channel) => await db.ValidateChannelName(channel);

        [HttpPost("[action]")]
        public async Task AddChannel([FromBody]Channel channel) => await db.AddChannel(channel);

        [HttpPost("[action]")]
        public async Task UpdateChannel([FromBody]Channel channel) => await db.UpdateChannel(channel);

        [HttpPost("[action]")]
        public async Task ToggleChannelDeleted([FromBody]Channel channel) => await db.ToggleChannelDeleted(channel);

        [HttpPost("[action]")]
        public async Task RemoveChannel([FromBody]Channel channel) => await db.RemoveChannel(channel);

        [HttpPost("[action]/{channelName}")]
        public async Task<ChannelUser> SyncChannelUser([FromRoute]string channelName, [FromBody]User user) => await db.SyncChannelUser(user, channelName);

        [HttpPost("[action]")]
        public async Task AddChannelUser([FromBody]ChannelUser user) => await db.AddChannelUser(user);

        [HttpPost("[action]")]
        public async Task ToggleChannelAdmin([FromBody]ChannelUser user) => await db.AddChannelUser(user);

        [HttpPost("[action]")]
        public async Task RemoveChannelUser([FromBody]ChannelUser user) => await db.RemoveChannelUser(user);

        [HttpPost("[action]")]
        public async Task AddChannelMessage([FromBody]ChannelMessage message) => await db.AddChannelMessage(message);

        [HttpPost("[action]")]
        public async Task UpdateChannelMessage([FromBody]ChannelMessage message) => await db.UpdateChannelMessage(message);

        [HttpPost("[action]")]
        public async Task RemoveChannelMessage([FromBody]ChannelMessage message) => await db.RemoveChannelMessage(message);
    }
}