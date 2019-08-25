using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Portfolio.Identity.Mock
{
    public class MockMiddleware
    {
        private readonly RequestDelegate next;

        public MockMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context, IUserProvider provider, IConfiguration config)
        {
            if (!(provider.Initialized))
            {
                var user = string.IsNullOrEmpty(context.Session.GetString("SessionUser")) ?
                    config.GetValue<string>("CurrentUser") :
                    context.Session.GetString("SessionUser");

                var sessionUser = context.Session.GetString("SessionUser");
                await provider.Create(user);

                if (!(context.User.Identity.IsAuthenticated))
                {
                    await provider.AddIdentity(context);
                }
            }

            await next(context);
        }
    }
}