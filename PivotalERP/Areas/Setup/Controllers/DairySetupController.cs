using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Setup.Controllers
{
    public class DairySetupController : Controller
    {
        // GET: Setup/DairySetup
        public ActionResult DairyPurchaseSetup()
        {
            return View();
        }
        public ActionResult DairyPurchaseInvoice()
        {
            return View();
        }
        public ActionResult DairyPurchaseReport()
        {
            return View();
        }
    }
}