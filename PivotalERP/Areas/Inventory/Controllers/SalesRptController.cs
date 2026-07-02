using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;

namespace PivotalERP.Areas.Inventory.Controllers
{
    public class SalesRptController : PivotalERP.Controllers.BaseController
    {
        
        public ActionResult PendingSalesOrder()
        {
            return View();
        }
    }
}