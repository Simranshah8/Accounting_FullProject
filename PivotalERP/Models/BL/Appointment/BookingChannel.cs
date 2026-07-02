using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Appointment
{
    public class BookingChannel
    {
		DA.Appointment.BookingChannelDB db = null;

		int _UserId = 0;

		public BookingChannel(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Appointment.BookingChannelDB(hostName, dbName);
		}

		public ResponeValues SaveFormData(BE.Appointment.BookingChannel beData)
		{
			bool isModify = beData.BookingId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Appointment.BookingChannelCollections GetAllBookingChannel(int EntityId)
		{
			return db.getAllBookingChannel(_UserId, EntityId);
		}
		public BE.Appointment.BookingChannel GetBookingChannelById(int EntityId, int BookingId)
		{
			return db.getBookingChannelById(_UserId, EntityId, BookingId);
		}
		public ResponeValues DeleteById(int EntityId, int BookingId)
		{
			return db.DeleteById(_UserId, EntityId, BookingId);
		}
		public ResponeValues IsValidData(ref BE.Appointment.BookingChannel beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.BookingId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.BookingId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.BookingChannelId == 0 || beData.BookingChannelId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select BookingChannel ";
				}
				else if (string.IsNullOrEmpty(beData.OrderNo))
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