using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Lab.Controllers
{
    public class ReportController : PivotalERP.Controllers.BaseController
    {
        // GET: Lab/Report
       

        public ActionResult FinalReports()
        {
            return View();
        }

       
    }
}