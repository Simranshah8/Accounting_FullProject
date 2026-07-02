using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class AssetCategory
	{

		DA.AssetManagement.AssetCategoryDB db = null;

		int _UserId = 0;

		public AssetCategory(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetCategoryDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetCategory beData)
		{
			bool isModify = beData.AssetCategoryId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetCategoryCollections GetAllAssetCategory(int EntityId)
		{
			return db.getAllAssetCategory(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetCategory GetAssetCategoryById(int EntityId, int AssetCategoryId)
		{
			return db.getAssetCategoryById(_UserId, EntityId, AssetCategoryId);
		}
		public ResponeValues DeleteById(int EntityId, int AssetCategoryId)
		{
			return db.DeleteById(_UserId, EntityId, AssetCategoryId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetCategory beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.AssetCategoryId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.AssetCategoryId != 0)
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
				else if (string.IsNullOrEmpty(beData.Code))
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

