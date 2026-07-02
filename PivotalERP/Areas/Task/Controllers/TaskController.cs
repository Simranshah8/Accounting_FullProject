using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Task.Controllers
{
    public class TaskController : Controller
    {
        // GET: Task/Task
        public ActionResult CreateTask()
        {
            return View();
        }

        public ActionResult ViewTask()
        {
            return View();
        }
       
    }
}