using System.Web.Mvc;

namespace PivotalERP.Areas.ComplaintTicket
{
    public class ComplaintTicketAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ComplaintTicket";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "ComplaintTicket_default",
                "ComplaintTicket/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}