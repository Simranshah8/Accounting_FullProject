using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.NPayroll
{

	public class EmployeeGroup
	{

		DA.NPayroll.EmployeeGroupDB db = null;

		int _UserId = 0;

		public EmployeeGroup(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.NPayroll.EmployeeGroupDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.NPayroll.EmployeeGroup beData)
		{
			bool isModify = beData.EmployeeGroupId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.NPayroll.EmployeeGroupCollections GetAllEmployeeGroup(int EntityId)
		{
			return db.getAllEmployeeGroup(_UserId, EntityId);
		}
		public Dynamic.BE.NPayroll.EmployeeGroup GetEmployeeGroupById(int EntityId, int EmployeeGroupId)
		{
			return db.getEmployeeGroupById(_UserId, EntityId, EmployeeGroupId);
		}
		public ResponeValues DeleteById(int EntityId, int EmployeeGroupId)
		{
			return db.DeleteById(_UserId, EntityId, EmployeeGroupId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.NPayroll.EmployeeGroup beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.EmployeeGroupId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.EmployeeGroupId != 0)
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
				else if (beData.BaseGroupId == 0)
				{
					resVal.ResponseMSG = "Please ! Select BaseGroup ";
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

