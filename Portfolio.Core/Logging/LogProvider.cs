using Microsoft.AspNetCore.Http;
using Portfolio.Core.Extensions;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Core.Logging
{
    public class LogProvider
    {
        private string logDirectory;
        public string LogDirectory
        { 
            get => logDirectory;
            set
            {
                logDirectory = value;
                LogDirectory.EnsureDirectoryExists();
            } 
        }

        public string GetLogName() => $"log-{DateTime.Now.ToString("yyyy-MM-dd-hh-mm-ss")}.txt";
        
        public async Task CreateLog(HttpContext context, Exception exception)
        {
            var builder = new StringBuilder();
            builder.AppendLine("ContextDetails");
            builder.AppendLine();
            builder.AppendLine(await context.GetContextDetails());
            builder.AppendLine("Exception Details");
            builder.AppendLine(exception.GetExceptionChain());
            
            await builder.WriteLog($@"{LogDirectory}\{GetLogName()}");
        }
    }
}