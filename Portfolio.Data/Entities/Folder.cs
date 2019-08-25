using System.Collections.Generic;

namespace Portfolio.Data.Entities
{
    public class Folder
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }

        public User User { get; set; }

        public List<FolderUpload> FolderUploads { get; set; }
    }
}