using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Appointment.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: Appointment/Creation
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


		#region "AppointmentType"
		[HttpPost]
		public JsonNetResult SaveAppointmentType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Appointment.AppointmentType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.AppointmentId.HasValue)
						beData.AppointmentId = 0;

					resVal = new Dynamic.BL.Appointment.AppointmentType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

				}
				else
				{
					resVal.ResponseMSG = "Blank Data Can't be Accept";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAllAppointmentType()
		{
			var dataColl = new Dynamic.BL.Appointment.AppointmentType(User.UserId, User.HostName, User.DBName).GetAllAppointmentType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAppointmentTypeById(int AppointmentId)
		{
			var dataColl = new Dynamic.BL.Appointment.AppointmentType(User.UserId, User.HostName, User.DBName).GetAppointmentTypeById(0, AppointmentId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelAppointmentType(int AppointmentId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Appointment.AppointmentType(User.UserId, User.HostName, User.DBName).DeleteById(0, AppointmentId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion



		#region "BookingChannel"
		[HttpPost]
		public JsonNetResult SaveBookingChannel()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Appointment.BookingChannel>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.BookingId.HasValue)
						beData.BookingId = 0;

					resVal = new Dynamic.BL.Appointment.BookingChannel(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

				}
				else
				{
					resVal.ResponseMSG = "Blank Data Can't be Accept";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAllBookingChannel()
		{
			var dataColl = new Dynamic.BL.Appointment.BookingChannel(User.UserId, User.HostName, User.DBName).GetAllBookingChannel(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetBookingChannelById(int BookingId)
		{
			var dataColl = new Dynamic.BL.Appointment.BookingChannel(User.UserId, User.HostName, User.DBName).GetBookingChannelById(0, BookingId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelBookingChannel(int BookingId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Appointment.BookingChannel(User.UserId, User.HostName, User.DBName).DeleteById(0, BookingId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


	}
}