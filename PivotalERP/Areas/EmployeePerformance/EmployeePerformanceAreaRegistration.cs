using System.Web.Mvc;

namespace PivotalERP.Areas.EmployeePerformance
{
    public class EmployeePerformanceAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "EmployeePerformance";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "EmployeePerformance_default",
                "EmployeePerformance/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}