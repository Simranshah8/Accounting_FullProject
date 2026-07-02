using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{

	public class AttendanceAppeals
	{

		DA.Attendance.AttendanceAppealsDB db = null;

		int _UserId = 0;

		public AttendanceAppeals(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.AttendanceAppealsDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Attendance.AttendanceAppeals beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Attendance.AttendanceAppealsCollections GetAllAttendanceAppeals(int EntityId)
		{
			return db.getAllAttendanceAppeals(_UserId, EntityId);
		}
		public BE.Attendance.AttendanceAppeals GetAttendanceAppealsById(int EntityId, int TranId)
		{
			return db.getAttendanceAppealsById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public BE.Attendance.AttendanceAppealsCollections GetAttendanceAppealDetails( DateTime? DateFrom, DateTime? DateTo, string ApprovedType, int? EmployeeId, int? BranchId, bool? ShowSelfOnly)
		{
			return db.GetAttendanceAppealDetails(_UserId, DateFrom, DateTo, ApprovedType, EmployeeId, BranchId,ShowSelfOnly);
        }


		public ResponeValues UpdateAttendanceAppeals(BE.Attendance.AttendanceAppeals beData)
		{
			ResponeValues resVal = new ResponeValues();
			if (string.IsNullOrWhiteSpace(beData.ApprovedType) || beData.ApprovedType.Trim() == "")
			{
				resVal.ResponseMSG = "Please! Enter Approved Type.";
				resVal.IsSuccess = false;
				return resVal;
			}
			if (string.IsNullOrWhiteSpace(beData.ApprovedRemarks) || beData.ApprovedRemarks.Trim() == "")
			{
				resVal.ResponseMSG = "Please! Enter Approved Remarks.";
				resVal.IsSuccess = false;
				return resVal;
			}
			return db.UpdateAttendanceAppeals(beData);
		}
		public ResponeValues IsValidData(ref BE.Attendance.AttendanceAppeals beData, bool IsModify)
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
				else if (beData.EmployeeId == 0 || beData.EmployeeId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Employee ";
				}
				else if (beData.AttendanceInOutModeId == 0 || beData.AttendanceInOutModeId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select AttendanceInOutMode ";
				}
				if (!beData.PunchDateTime.HasValue || beData.PunchDateTime.Value.Year < 1900)
				{
					resVal.ResponseMSG = "Please ! Enter  PunchDateTime ";
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

