using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{

	public class AttendanceRule
	{

		DA.Attendance.AttendanceRuleDB db = null;

		int _UserId = 0;

		public AttendanceRule(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.AttendanceRuleDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Attendance.AttendanceRule beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Attendance.AttendanceRuleCollections GetAllAttendanceRule(int EntityId)
		{
			return db.getAllAttendanceRule(_UserId, EntityId);
		}
		public BE.Attendance.AttendanceRule GetAttendanceRuleById()
		{
			return db.getAttendanceRuleById(_UserId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.Attendance.AttendanceRule beData, bool IsModify)
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
				else if (beData.PermittedLateArrival == 0 || beData.PermittedLateArrival.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Permitted Late Arrival ";
				}
				else if (beData.PermittedEarlyDeparture == 0 || beData.PermittedEarlyDeparture.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select PermittedEarlyDeparture ";
				}
				else if (beData.HalfDayLessThanHr == 0 || beData.HalfDayLessThanHr.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select HalfDayLessThanHr ";
				}
				else if (beData.AbsentiLessThanHr == 0 || beData.AbsentiLessThanHr.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select AbsentiLessThanHr ";
				}
				else if (beData.LateArrival == 0 || beData.LateArrival.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select LateArrival ";
				}
				else if (beData.LateArrivalCut == 0 || beData.LateArrivalCut.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select LateArrivalCut ";
				}
				else if (beData.EarlyDeparture == 0 || beData.EarlyDeparture.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select EarlyDeparture ";
				}
				else if (beData.EarlyDepartureCut == 0 || beData.EarlyDepartureCut.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select EarlyDepartureCut ";
				}
				else if (beData.NoOfLateInAMonth == 0 || beData.NoOfLateInAMonth.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select EarlyDepartureCut ";
				}
				else if (beData.CutDays == 0 || beData.CutDays.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select CutDays ";
				}
				else if (beData.IgnoreOTDLessthan == 0 || beData.IgnoreOTDLessthan.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select IgnoreOTDLessthan ";
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

