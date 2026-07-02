
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace PivotalERP
{
    public class MvcApplication : System.Web.HttpApplication
    {   
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

           //GlobalConfiguration.Configuration.Formatters.Add
           // (new FormMultipartEncodedMediaTypeFormatter(new MultipartFormatterSettings()));
        }
        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {
            var authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null && !string.IsNullOrEmpty(authCookie.Value))
            {
                try
                {
                    FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                    if (authTicket != null && !authTicket.Expired)
                    {
                        SessionContext sessContext = new SessionContext();
                        Dynamic.BusinessEntity.Security.User loginUser = sessContext.GetUserData();
                        Dynamic.BusinessEntity.Security.WebUser user = new Dynamic.BusinessEntity.Security.WebUser(loginUser.UserName);
                        user.Address = loginUser.Address;
                        user.FirstName = loginUser.FirstName;
                        user.LastName = loginUser.LastName;
                        user.GroupId = loginUser.GroupId;
                        user.UserId = loginUser.UserId;
                        user.UserName = loginUser.UserName;
                        user.PublicIP = loginUser.PublicIP;
                        user.MacAddress = loginUser.MacAddress;
                        user.DBName = loginUser.DBName;
                        user.HostName = loginUser.HostName;
                        user.UserWiseSecurity = loginUser.UserWiseSecurity;
                        user.InBuilt = loginUser.InBuilt;
                        HttpContext.Current.User = user;
                    }
                }
                catch { }

            }
        }
    }
}
