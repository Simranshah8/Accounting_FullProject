using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.BL
{

	public class ResourceGroup
	{

		DA.ResourceGroupDB db = null;

		int _UserId = 0;

		public ResourceGroup(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.ResourceGroupDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.ResourceGroup beData)
		{
			bool isModify = beData.ResourceGroupId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.ResourceGroupCollections GetAllResourceGroup(int EntityId)
		{
			return db.getAllResourceGroup(_UserId, EntityId);
		}
		public BE.ResourceGroup GetResourceGroupById(int EntityId, int ResourceGroupId)
		{
			return db.getResourceGroupById(_UserId, EntityId, ResourceGroupId);
		}
		public ResponeValues DeleteById(int EntityId, int ResourceGroupId)
		{
			return db.DeleteById(_UserId, EntityId, ResourceGroupId);
		}
		public ResponeValues IsValidData(ref BE.ResourceGroup beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ResourceGroupId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ResourceGroupId != 0)
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

