using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Appointment.Controllers
{
    public class TransactionController : Controller
    {
        // GET: Appointment/Transaction
        public ActionResult PatientRegistration()
        {
            return View();
        }

        public ActionResult NewAppointment()
        {
            return View();
        }

        public ActionResult QuickAppointment()
        {
            return View();
        }

    }
}

