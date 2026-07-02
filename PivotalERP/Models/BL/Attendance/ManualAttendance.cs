using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{

	public class ManualAttendance
	{

		DA.Attendance.ManualAttendanceDB db = null;

		int _UserId = 0;

		public ManualAttendance(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.ManualAttendanceDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Attendance.ManualAttendance beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
        public BE.Attendance.ManualAttendanceCollections GetAllManualAttendance(int EntityId)
        {
            return db.getAllManualAttendance(_UserId, EntityId);
        }
        public BE.Attendance.ManualAttendance GetManualAttendanceById(int EntityId, int TranId)
		{
			return db.getManualAttendanceById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int MADetailId)
		{
			return db.DeleteById(_UserId, EntityId, MADetailId);
		}
		public ResponeValues IsValidData(ref BE.Attendance.ManualAttendance beData, bool IsModify)
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
				else if (beData.UserId == 0 || beData.UserId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Employee ";
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

