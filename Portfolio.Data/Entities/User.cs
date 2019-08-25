using System;
using System.Collections.Generic;

namespace Portfolio.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string SocketName { get; set; }
        public string Theme { get; set; }
        public string Sidepanel { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsDeleted { get; set; }

        public List<Channel> Channels { get; set; }
        public List<ChannelMessage> ChannelMessages { get; set; }
        public List<ChannelUser> UserChannels { get; set; }
        public List<Folder> Folders { get; set; }
        public List<Upload> Uploads { get; set; }
    }
}