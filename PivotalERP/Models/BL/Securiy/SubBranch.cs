using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BusinessLogic.Security
{

	public class SubBranch
	{

		Dynamic.DataAccess.Security.SubBranchDB db = null;

		int _UserId = 0;

		public SubBranch(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DataAccess.Security.SubBranchDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BusinessEntity.Security.SubBranch beData)
		{
			bool isModify = beData.SubBranchId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BusinessEntity.Security.SubBranchCollections GetAllSubBranch(int EntityId)
		{
			return db.getAllSubBranch(_UserId, EntityId);
		}
		public Dynamic.BusinessEntity.Security.SubBranch GetSubBranchById(int EntityId, int SubBranchId)
		{
			return db.getSubBranchById(_UserId, EntityId, SubBranchId);
		}
		public ResponeValues DeleteById(int EntityId, int SubBranchId)
		{
			return db.DeleteById(_UserId, EntityId, SubBranchId);
		}
		public ResponeValues IsValidData(ref Dynamic.BusinessEntity.Security.SubBranch beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.SubBranchId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.SubBranchId != 0)
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

