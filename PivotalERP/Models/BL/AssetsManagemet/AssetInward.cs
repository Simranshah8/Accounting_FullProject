using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{
	public class AssetInward
	{

		DA.AssetManagement.AssetInwardDB db = null;

		int _UserId = 0;
		private string hostName = "", dbName = "";
		public AssetInward(int UserId, string hostName, string dbName)
		{
			this.hostName = hostName;
			this.dbName = dbName;
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetInwardDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetInward beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetInwardCollections GetAllAssetInward(int EntityId)
		{
			return db.getAllAssetInward(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetInward GetAssetInwardById(int EntityId, int TranId)
		{
			return db.getAssetInwardById(_UserId, EntityId, TranId);
		}

		public BE.AssetManagement.AssetInward getAssetClosingStock(int? EntityId, int? TranId, int? BranchId, DateTime? VoucherDate)
		{
			return db.getAssetClosingStock(_UserId, EntityId, TranId, BranchId, VoucherDate);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}

		public ResponeValues GetAutoInWardNo(int EntityId)
		{
			return db.GetAutoInWardNo(_UserId, EntityId);
		}


		public ResponeValues IsValidData(ref BE.AssetManagement.AssetInward beData, bool IsModify)
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

				else if (string.IsNullOrEmpty(beData.InVoiceNo))
				{
					resVal.ResponseMSG = "Please ! Enter Invoice Number ";
				}

				else if (beData.VendorId == 0 || beData.VendorId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Vendor ";
				}


				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please Select Branch";
				}


				else if (beData.VoucherId == 0 || beData.VoucherId.HasValue == false)
				{
					resVal.ResponseMSG = "Please Select Voucher";
				}

				else if (beData.AssetInwardDetailsColl == null || beData.AssetInwardDetailsColl.Count == 0)
				{
					resVal.ResponseMSG = "Please Select at least one Detail.";
				}



				else
				{
					if (beData.AssetInwardDetailsColl != null || beData.AssetInwardDetailsColl.Count > 0)
					{
						foreach (var be in beData.AssetInwardDetailsColl)
						{
							if (be.ParticularId == 0 || be.ParticularId.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Particular.";
								return resVal;
							}
							if (be.Qty == 0 || be.Qty.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Qty.";
								return resVal;
							}
						}
					}

					if (!string.IsNullOrEmpty(hostName) && !string.IsNullOrEmpty(dbName))
					{
						var entityBl = new Dynamic.BusinessLogic.Security.EntityProperties(beData.CUserId, hostName, dbName);
						var isValidEntity = entityBl.IsValidEntity((int)Dynamic.BusinessEntity.Global.FormsEntity.AssetsInward, beData);
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

