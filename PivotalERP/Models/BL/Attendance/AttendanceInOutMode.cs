using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{

	public class AttendanceInOutMode
	{

		DA.Attendance.AttendanceInOutModeDB db = null;

		int _UserId = 0;

		public AttendanceInOutMode(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.AttendanceInOutModeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Attendance.AttendanceInOutMode beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Attendance.AttendanceInOutModeCollections GetAllAttendanceInOutMode(int EntityId)
		{
			return db.getAllAttendanceInOutMode(_UserId, EntityId);
		}
		public BE.Attendance.AttendanceInOutMode GetAttendanceInOutModeById(int EntityId, int TranId)
		{
			return db.getAttendanceInOutModeById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.Attendance.AttendanceInOutMode beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TranId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TranId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else if (beData.PerDay == 0 || beData.PerDay.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select PerDay ";
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

