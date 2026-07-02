using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Hospital.Controllers
{
    public class AppointmentController : Controller
    {
        // GET: Hospital/Appointment
        public ActionResult AppointmentType()
        {
            return View();
        }

        public ActionResult BookingChannel()
        {
            return View();
        }

        public ActionResult DoctorSchedule()
        {
            return View();
        }

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