using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class AssetOpening
	{

		DA.AssetManagement.AssetOpeningDB db = null;

		int _UserId = 0;

		public AssetOpening(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetOpeningDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetOpening beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetOpeningCollections GetAllAssetOpening(int EntityId)
		{
			return db.getAllAssetOpening(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetOpening GetAssetOpeningById(int EntityId, int TranId)
		{
			return db.getAssetOpeningById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}

		public RE.AssetManagement.Report.AssetsOpeningListCollections GetAssetsOpeningList(int EntityId, DateTime? DateFrom, DateTime? DateTo)
		{
			return db.GetAssetsOpeningList(_UserId, EntityId, DateFrom, DateTo);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetOpening beData, bool IsModify)
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

		public BE.AssetManagement.AssetOpening GetAssetOpeningByBranch(int EntityId, int TranId, int BranchId)
		{
			return db.GetAssetOpeningByBranch(_UserId, EntityId, TranId, BranchId);
		}

	}

}

