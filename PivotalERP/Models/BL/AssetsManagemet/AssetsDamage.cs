using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class Assetdamage
	{

		DA.AssetManagement.AssetdamageDB db = null;

		int _UserId = 0;
		private string hostName = "", dbName = "";
		public Assetdamage(int UserId, string hostName, string dbName)
		{
			this.hostName = hostName;
			this.dbName = dbName;
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetdamageDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.Assetdamage beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetdamageCollections GetAllAssetdamage(int EntityId)
		{
			return db.getAllAssetdamage(_UserId, EntityId);
		}
		public BE.AssetManagement.Assetdamage GetAssetdamageById(int EntityId, int TranId)
		{
			return db.getAssetdamageById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}

		public ResponeValues GetAutoDamageNo(int EntityId)
		{
			return db.GetAutoDamageNo(_UserId, EntityId);
		}
		public RE.AssetManagement.AssetsDamageCollections GetPendingDamageDetails(int? VendorId)
        {
			return db.GetPendingDamageDetails(_UserId, VendorId);

		}
		public ResponeValues IsValidData(ref BE.AssetManagement.Assetdamage beData, bool IsModify)
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
				else if (beData.AssetdamageDetailsColl == null || beData.AssetdamageDetailsColl.Count == 0)
				{
					resVal.ResponseMSG = "Please Select at least one Detail.";
				}
				else
				{
					 if (beData.AssetdamageDetailsColl != null || beData.AssetdamageDetailsColl.Count > 0)
					{
						foreach (var be in beData.AssetdamageDetailsColl)
						{
							if (be.ParticularId == 0 || be.ParticularId.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Particular.";
								return resVal;
							}
							if (be.StatusId == 0 || be.StatusId.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Status.";
								return resVal;
							}


						}
					}
					if (!string.IsNullOrEmpty(hostName) && !string.IsNullOrEmpty(dbName))
					{
						var entityBl = new Dynamic.BusinessLogic.Security.EntityProperties(beData.CUserId, hostName, dbName);
						var isValidEntity = entityBl.IsValidEntity((int)Dynamic.BusinessEntity.Global.FormsEntity.AssetsDemage, beData);
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

