using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.HR
{
	public class EmployeeJD
	{
		DA.HR.EmployeeJDDB db = null;

		int _UserId = 0;

		public EmployeeJD(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.HR.EmployeeJDDB(hostName, dbName);
		}


		public ResponeValues SaveFormData(BE.HR.EmployeeJD beData)
		{
			bool isModify = beData.EmpJDId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.HR.EmployeeJDCollections GetAllEmployeeJD(int EntityId)
		{
			return db.getAllEmployeeJD(_UserId, EntityId);
		}
		public BE.HR.EmployeeJD GetEmployeeJDById(int EntityId, int EmpJDId)
		{
			return db.getEmployeeJDById(_UserId, EntityId, EmpJDId);
		}
		public ResponeValues DeleteById(int EntityId, int EmpJDId)
		{
			return db.DeleteById(_UserId, EntityId, EmpJDId);
		}
		public ResponeValues IsValidData(ref BE.HR.EmployeeJD beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.EmpJDId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.EmpJDId != 0)
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
				else if (string.IsNullOrEmpty(beData.Division))
				{
					resVal.ResponseMSG = "Please ! Enter Division ";
				}
				else if (string.IsNullOrEmpty(beData.WorkStation))
				{
					resVal.ResponseMSG = "Please ! Enter WorkStation ";
				}
				else if (string.IsNullOrEmpty(beData.ExpYear))
				{
					resVal.ResponseMSG = "Please ! Enter Exprience Year ";
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