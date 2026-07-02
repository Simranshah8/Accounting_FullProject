using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class AssetRequest
	{

		DA.AssetManagement.AssetRequestDB db = null;

		int _UserId = 0;
		private string hostName = "", dbName = "";
		public AssetRequest(int UserId, string hostName, string dbName)
		{
			this.hostName = hostName;
			this.dbName = dbName;
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetRequestDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetRequest beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetRequestCollections GetAllAssetRequest(int EntityId)
		{
			return db.getAllAssetRequest(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetRequest GetAssetRequestById(int EntityId, int TranId)
		{
			return db.getAssetRequestById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public BE.AssetManagement.HODByDepartmentCollections GetHodListDepartmentWise(int EntityId, int? DepartmentId)
		{
			return db.GetHodListDepartmentWise(_UserId, EntityId, DepartmentId);
		}
		public ResponeValues GetAutoNo(int EntityId)
		{
			return db.GetAutoNo(_UserId, EntityId);
		}

		public RE.AssetManagement.AssetsRequestCollections GetPendingAssetsRquest(string RequestNo, int? RequestBy, int? BranchId, int? DepartmentId, int? RequestUserId)
		{
			return db.GetPendingAssetsRequest(_UserId, RequestNo, RequestBy, BranchId, DepartmentId, RequestUserId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetRequest beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();

			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
					return resVal;
				}
				else if (IsModify && beData.TranId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
					return resVal;
				}
				else if (!IsModify && beData.TranId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
					return resVal;
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
					return resVal;
				}
				else if (beData.AssetsReqDetailsColl == null || beData.AssetsReqDetailsColl.Count == 0)
				{
					resVal.ResponseMSG = "Please Select at least one Detail.";
				}

				else
				{

					if (beData.AssetsReqDetailsColl != null || beData.AssetsReqDetailsColl.Count > 0)
					{
						foreach (var be in beData.AssetsReqDetailsColl)
						{
							if (be.ParticularId == 0 || be.ParticularId.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Particular.";
								return resVal;
							}
							if (be.CategoryId == 0 || be.CategoryId.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Category.";
								return resVal;
							}
							if (be.PurposeId == 0 || be.PurposeId.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Purpose.";
								return resVal;
							}
							if (be.QTY == 0 || be.QTY.HasValue == false)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Qty.";
								return resVal;
							}
							if (!be.ReqFrom.HasValue)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Request From Date.";
								return resVal;
							}
							if (!be.ReqTO.HasValue)
							{
								resVal.IsSuccess = false;
								resVal.ResponseMSG = "Please Select Request To Date.";
								return resVal;
							}
						}
					}

					if (!string.IsNullOrEmpty(hostName) && !string.IsNullOrEmpty(dbName))
					{
						var entityBl = new Dynamic.BusinessLogic.Security.EntityProperties(beData.CUserId, hostName, dbName);
						var isValidEntity = entityBl.IsValidEntity((int)Dynamic.BusinessEntity.Global.FormsEntity.AssetsRequest, beData);
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

