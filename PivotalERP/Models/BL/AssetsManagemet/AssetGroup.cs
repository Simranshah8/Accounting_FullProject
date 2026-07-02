using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.AssetManagement
{
    public class AssetGroup
    {
		DA.AssetManagement.AssetGroupDB db = null;

		int _UserId = 0;

		public AssetGroup(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetGroupDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetGroup beData)
		{
			bool isModify = beData.AssetGroupId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetGroupCollections GetAllAssetGroup(int EntityId)
		{
			return db.getAllAssetGroup(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetGroup GetAssetGroupById(int EntityId, int AssetGroupId)
		{
			return db.getAssetGroupById(_UserId, EntityId, AssetGroupId);
		}
		public ResponeValues DeleteById(int EntityId, int AssetGroupId)
		{
			return db.DeleteById(_UserId, EntityId, AssetGroupId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetGroup beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.AssetGroupId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.AssetGroupId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.GroupName))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else if (string.IsNullOrEmpty(beData.GroupCode))
				{
					resVal.ResponseMSG = "Please ! Enter Code ";
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