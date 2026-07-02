using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class Assetsmaster
	{

		DA.AssetManagement.AssetsmasterDB db = null;

		int _UserId = 0;

		public Assetsmaster(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetsmasterDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.Assetsmaster beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetsmasterCollections GetAllAssetsmaster(int EntityId)
		{
			return db.getAllAssetsmaster(_UserId, EntityId);
		}

		public BE.AssetManagement.AssetsmasterCollections GetAllAssetsProduct(int EntityId)
		{
			return db.GetAllAssetsProduct(_UserId, EntityId);
		}
		public BE.AssetManagement.Assetsmaster GetAssetsmasterById(int EntityId, int TranId)
		{
			return db.getAssetsmasterById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}

		public ResponeValues GetAutoAssetsMasterCode(int EntityId)
		{
			return db.GetAutoAssetsMasterCode(_UserId, EntityId);
		}


		public ResponeValues IsValidData(ref BE.AssetManagement.Assetsmaster beData, bool IsModify)
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
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				
				else if (string.IsNullOrEmpty(beData.Code))
				{
					resVal.ResponseMSG = "Please ! Enter Code ";
				}

				else if (beData.AssetGroupId == 0 || beData.AssetGroupId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Group ";
				}
				else if (beData.StatusId == 0 || beData.StatusId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Status ";
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

