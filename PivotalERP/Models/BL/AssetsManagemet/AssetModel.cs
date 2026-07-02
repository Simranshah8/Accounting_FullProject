using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.AssetManagement
{
    public class AssetModel
    {
		DA.AssetManagement.AssetModelDB db = null;

		int _UserId = 0;

		public AssetModel(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetModelDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetModel beData)
		{
			bool isModify = beData.AssetModelId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetModelCollections GetAllAssetModel(int EntityId)
		{
			return db.getAllAssetModel(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetModel GetAssetModelById(int EntityId, int AssetModelId)
		{
			return db.getAssetModelById(_UserId, EntityId, AssetModelId);
		}
		public ResponeValues DeleteById(int EntityId, int AssetModelId)
		{
			return db.DeleteById(_UserId, EntityId, AssetModelId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetModel beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.AssetModelId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.AssetModelId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.ModelName))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else if (string.IsNullOrEmpty(beData.ModelCode))
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