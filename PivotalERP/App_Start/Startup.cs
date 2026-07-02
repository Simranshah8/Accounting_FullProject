using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using PivotalERP.Provider;

[assembly: OwinStartup(typeof(PivotalERP.App_Start.Startup))]
namespace PivotalERP.App_Start
{
    public class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public void Configuration(IAppBuilder app)
        {
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/v1/token"),
                Provider = new OAuthCustomeTokenProvider(), // We will create
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(180),
                AllowInsecureHttp = true,
                RefreshTokenProvider = new OAuthCustomRefreshTokenProvider(), // We will create
                //AuthenticationType="post"                                 
            };

            OAuthCustomeTokenProvider.OAuthOptions = Startup.OAuthOptions;
            app.UseOAuthAuthorizationServer(OAuthOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
            //ScheduleJobs.JobScheduler.Start();
        }
    }
}