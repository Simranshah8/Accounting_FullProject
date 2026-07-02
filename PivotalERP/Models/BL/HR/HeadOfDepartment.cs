using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR
{

	public class HeadOfDepartment
	{

		Dynamic.DA.HR.HeadOfDepartmentDB db = null;

		int _UserId = 0;

		public HeadOfDepartment(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DA.HR.HeadOfDepartmentDB(hostName, dbName);
		}
        public ResponeValues SaveFormData(Dynamic.BE.HR.HeadOfDepartment beData)
        {
            bool isModify = beData.TranId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }

        public Dynamic.BE.HR.HeadOfDepartmentCollections GetAllHeadOfDepartment(int EntityId)
		{
			return db.getAllHeadOfDepartment(_UserId, EntityId);
		}
		public Dynamic.BE.HR.HeadOfDepartment GetHeadOfDepartmentById(int EntityId, int TranId)
		{
			return db.getHeadOfDepartmentById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.HR.HeadOfDepartment beData, bool IsModify)
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
				else if (string.IsNullOrEmpty(beData.CompanyRelationshipIds))
				{
					resVal.ResponseMSG = "Please ! Select Company ";
				}
				else if (string.IsNullOrEmpty(beData.BranchIds))
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
				}
				else if (beData.DepartmentId == 0 || beData.DepartmentId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Department ";
				}
				else if (beData.EmployeeId == 0 || beData.EmployeeId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Employee ";
				}
				else if (beData.EmployeeId ==  beData.CoEmployeeId)
				{
					resVal.ResponseMSG = "Employee and Co-Employee cannot be same.";
				}
				else if (!beData.StartDate.HasValue || beData.StartDate.Value.Year < 1900)
				{
					resVal.ResponseMSG = "Please ! Enter Start Date";
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

