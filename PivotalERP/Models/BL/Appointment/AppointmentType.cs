using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Appointment
{
    public class AppointmentType
    {
		DA.Appointment.AppointmentTypeDB db = null;

		int _UserId = 0;

		public AppointmentType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Appointment.AppointmentTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Appointment.AppointmentType beData)
		{
			bool isModify = beData.AppointmentId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Appointment.AppointmentTypeCollection GetAllAppointmentType(int EntityId)
		{
			return db.getAllAppointmentType(_UserId, EntityId);
		}
		public BE.Appointment.AppointmentType GetAppointmentTypeById(int EntityId, int AppointmentId)
		{
			return db.getAppointmentTypeById(_UserId, EntityId, AppointmentId);
		}
		public ResponeValues DeleteById(int EntityId, int AppointmentId)
		{
			return db.DeleteById(_UserId, EntityId, AppointmentId);
		}
		public ResponeValues IsValidData(ref BE.Appointment.AppointmentType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.AppointmentId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.AppointmentId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.AppointmentTypeId == 0 || beData.AppointmentTypeId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select AppointmentType ";
				}
				else if(string.IsNullOrEmpty(beData.OrderNo))
                {
					resVal.ResponseMSG = "Please ! Enter Order No ";
				}
				else if (string.IsNullOrEmpty(beData.Remarks))
				{
					resVal.ResponseMSG = "Please ! Enter Remarks ";
				}
				else
				{
					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}
	}
}