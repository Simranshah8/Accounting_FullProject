using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace PivotalERP
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.MessageHandlers.Add(new APILogHandler());

            config.Routes.MapHttpRoute(
               name: "DefaultApiWithAction",
               routeTemplate: "v1/{controller}/{action}"
           );

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "v1/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);
        }
    }
}
