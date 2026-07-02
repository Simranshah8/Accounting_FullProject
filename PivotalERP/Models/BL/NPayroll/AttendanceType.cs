using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.NPayroll
{

	public class AttendanceType
	{

		DA.NPayroll.AttendanceTypeDB db = null;

		int _UserId = 0;

		public AttendanceType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.NPayroll.AttendanceTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.NPayroll.AttendanceType beData)
		{
			bool isModify = beData.AttendanceTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.NPayroll.AttendanceTypeCollections GetAllAttendanceType(int EntityId)
		{
			return db.getAllAttendanceType(_UserId, EntityId);
		}
		public Dynamic.BE.NPayroll.AttendanceTypeCollections getAttendanceTypeForTran()
		{
			return db.getAttendanceTypeForTran(_UserId);
		}
			public Dynamic.BE.NPayroll.AttendanceType GetAttendanceTypeById(int EntityId, int AttendanceTypeId)
		{
			return db.getAttendanceTypeById(_UserId, EntityId, AttendanceTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int AttendanceTypeId)
		{
			return db.DeleteById(_UserId, EntityId, AttendanceTypeId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.NPayroll.AttendanceType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.AttendanceTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.AttendanceTypeId != 0)
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
				else if (beData.Types == 0 )
				{
					resVal.ResponseMSG = "Please ! Select Types ";
				}
				
				else if (beData.PeriodType == 0 )
				{
					resVal.ResponseMSG = "Please ! Select PeriodType ";
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

