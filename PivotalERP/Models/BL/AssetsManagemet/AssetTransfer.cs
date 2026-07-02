using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class AssetTransfer
	{

		DA.AssetManagement.AssetTransferDB db = null;

		int _UserId = 0;
		private string hostName = "", dbName = "";
		public AssetTransfer(int UserId, string hostName, string dbName)
		{
			this.hostName = hostName;
			this.dbName = dbName;
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetTransferDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetTransfer beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetTransferCollections GetAllAssetTransfer(int EntityId)
		{
			return db.getAllAssetTransfer(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetTransfer GetAssetTransferById(int EntityId, int TranId)
		{
			return db.getAssetTransferById(_UserId, EntityId, TranId);
		}

		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues GetAutoTransferNo(int EntityId)
		{
			return db.GetAutoTransferNo(_UserId, EntityId);
		}

		public BE.AssetManagement.ParticularByBranchCollections getParticularByBranch(int EntityId, int FromBranchId)
		{
			return db.getParticularByBranch(_UserId, EntityId, FromBranchId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetTransfer beData, bool IsModify)
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
				else if (beData.FromBranchId == 0 || beData.FromBranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select FromBranch ";
				}
				else if (beData.ToBranchId == 0 || beData.ToBranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select ToBranch ";
				}
				else
				{
					if (!string.IsNullOrEmpty(hostName) && !string.IsNullOrEmpty(dbName))
					{
						var entityBl = new Dynamic.BusinessLogic.Security.EntityProperties(beData.CUserId, hostName, dbName);
						var isValidEntity = entityBl.IsValidEntity((int)Dynamic.BusinessEntity.Global.FormsEntity.AssetsTransfer, beData);
						if (!isValidEntity.IsSuccess)
							return isValidEntity;
					}

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

