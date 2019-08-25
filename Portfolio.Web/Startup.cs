using System;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Portfolio.Core.Extensions;
using Portfolio.Core.Logging;
using Portfolio.Core.Sockets;
using Portfolio.Core.Upload;
using Portfolio.Data;
using Portfolio.Identity;
using Portfolio.Identity.Mock;
using Portfolio.Web.Hubs;

namespace Portfolio.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
            Logger = new LogProvider
            {
                LogDirectory = Configuration.GetValue<string>("LogDirectory") ??
                    $@"{Environment.WebRootPath}\logs"
            };
        }
        public IConfiguration Configuration { get; }
        public IHostingEnvironment Environment { get; }
        public LogProvider Logger { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
                });

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("Default"));
            });

            services.AddSignalR();
            services.AddSingleton<SocketGroupProvider>();

            if (Environment.IsDevelopment())
            {
                services.AddSession(options =>
                {
                    options.IdleTimeout = TimeSpan.FromMinutes(30);
                    options.Cookie.HttpOnly = true;
                    options.Cookie.IsEssential = true;
                });

                services.AddSingleton(new UploadConfig
                {
                    DirectoryBasePath = $@"{Environment.ContentRootPath}/wwwroot/",
                    UrlBasePath = "/"
                });

                services
                    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie();

                services.AddScoped<IUserProvider, MockProvider>();
            }
            else
            {
                services.AddSingleton(new UploadConfig
                {
                    DirectoryBasePath = Configuration.GetValue<string>("AppDirectoryBasePath"),
                    UrlBasePath = Configuration.GetValue<string>("AppUrlBasePath")
                });
                
                services.AddScoped<IUserProvider, AdUserProvider>();
            }

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseDeveloperExceptionPage();

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseSession();
                app.UseAuthentication();
                app.UseMockMiddleware();
            }
            else
            {
                app.UseAdMiddleware();
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Logger.LogDirectory),
                RequestPath = "/logs"
            });

            app.UseDirectoryBrowser(new DirectoryBrowserOptions
            {
                FileProvider = new PhysicalFileProvider(Logger.LogDirectory),
                RequestPath = "/logs"
            });
            
            app.UseExceptionHandler(err => err.HandleError(Logger));

            app.UseSignalR(routes =>
            {
                routes.MapHub<ChannelHub>("/channel-socket");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
