using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Expense.Controllers
{
    public class CreationController : Controller
    {
        // GET: Expense/Creation
        public ActionResult ExpenseHeading()
        {
            return View();
        }
    }
}