using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.AssetManagement
{
    public class AssetType


    {
		DA.AssetManagement.AssetTypeDB db = null;

		int _UserId = 0;

		public AssetType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetType beData)
		{
			bool isModify = beData.AssetTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetTypeCollections GetAllAssetType(int EntityId)
		{
			return db.getAllAssetType(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetType GetAssetTypeById(int EntityId, int AssetTypeId)
		{
			return db.getAssetTypeById(_UserId, EntityId, AssetTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int AssetTypeId)
		{
			return db.DeleteById(_UserId, EntityId, AssetTypeId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.AssetTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.AssetTypeId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.TypeName))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else if (string.IsNullOrEmpty(beData.TypeCode))
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