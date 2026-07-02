using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class Resource
	{

		DA.ResourceDB db = null;

		int _UserId = 0;

		public Resource(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.ResourceDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Resource beData)
		{
			bool isModify = beData.ResourceId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.ResourceCollections GetAllResource(int EntityId)
		{
			return db.getAllResource(_UserId, EntityId);
		}
		public BE.Resource GetResourceById(int EntityId, int ResourceId)
		{
			return db.getResourceById(_UserId, EntityId, ResourceId);
		}
		public ResponeValues DeleteById(int EntityId, int ResourceId)
		{
			return db.DeleteById(_UserId, EntityId, ResourceId);
		}
		public ResponeValues IsValidData(ref BE.Resource beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ResourceId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ResourceId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.ResourceType == 0)
				{
					resVal.ResponseMSG = "Please ! Select ResourceType ";
				}
				else if (beData.ResourceGroupId == 0)
				{
					resVal.ResponseMSG = "Please ! Select ResourceGroup ";
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

