using System;
using System.Linq;
using System.Threading.Tasks;
using Portfolio.Core.Sockets;
using Microsoft.AspNetCore.SignalR;

namespace Portfolio.Web.Hubs
{
    public class ChannelHub : Hub
    {
        private SocketGroupProvider provider;

        public ChannelHub(SocketGroupProvider provider)
        {
            this.provider = provider;
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var connections = provider
                .SocketGroups
                .Where(x => x.Connections.Contains(Context.ConnectionId))
                .Select(x => x.Name)
                .ToList();

            foreach (var c in connections)
            {
                await provider.RemoveFromSocketGroup(Context.ConnectionId, c);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, c);
                await Clients.GroupExcept(c, Context.ConnectionId).SendAsync("channelAlert", $"{Context.UserIdentifier} has left {c}");
            }

            await base.OnDisconnectedAsync(ex);
        }

        public async Task triggerJoinChannel(string group)
        {
            await provider.AddToSocketGroup(Context.ConnectionId, group);
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await Clients.GroupExcept(group, Context.ConnectionId).SendAsync("channelAlert", $"{Context.UserIdentifier} has joined {group}");
        }

        public async Task triggerLeaveChannel(string group)
        {
            await provider.RemoveFromSocketGroup(Context.ConnectionId, group);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
            await Clients.GroupExcept(group, Context.ConnectionId).SendAsync("channelAlert", $"{Context.UserIdentifier} has left {group}");
        }

        public async Task triggerChannelMessage(string group)
        {
            await Clients.Group(group).SendAsync("channelMessage");
        }
    }
}