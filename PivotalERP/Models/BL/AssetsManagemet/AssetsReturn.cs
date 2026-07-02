using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class AssetReturn
	{

		DA.AssetManagement.AssetReturnDB db = null;

		int _UserId = 0;
		private string hostName = "", dbName = "";
		public AssetReturn(int UserId, string hostName, string dbName)
		{
			this.hostName = hostName;
			this.dbName = dbName;
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetReturnDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetReturn beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetReturnCollections GetAllAssetReturn(int EntityId)
		{
			return db.getAllAssetReturn(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetReturn GetAssetReturnById(int EntityId, int TranId)
		{
			return db.getAssetReturnById(_UserId, EntityId, TranId);
		}
		
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues GetAutoReturnNo(int EntityId)
		{
			return db.GetAutoReturnNo(_UserId, EntityId);
		}

		public BE.AssetManagement.AssetReturn GetAssetIssueByIssueNo(int EntityId, int IssueNo)
		{
			return db.GetAssetIssueByIssueNo(_UserId, EntityId, IssueNo);
		}

		public ResponeValues IsValidData(ref BE.AssetManagement.AssetReturn beData, bool IsModify)
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
				//else if (beData.IssueNo == 0 || beData.IssueNo.HasValue == false)
				//{
				//	resVal.ResponseMSG = "Please ! Select IssueNo ";
				//}
				//else if (beData.ReturnById == 0 || beData.ReturnById.HasValue == false)
				//{
				//	resVal.ResponseMSG = "Please ! Select Return By  ";
				//}
				else if (beData.AssetReturnDetailsColl == null || beData.AssetReturnDetailsColl.Count == 0)
				{
					resVal.ResponseMSG = "Please Select at least one Detail.";
				}				
				else
				{
					 if (beData.AssetReturnDetailsColl != null || beData.AssetReturnDetailsColl.Count > 0)
					{
						foreach (var be in beData.AssetReturnDetailsColl)
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

						}
					}
					if (!string.IsNullOrEmpty(hostName) && !string.IsNullOrEmpty(dbName))
					{
						var entityBl = new Dynamic.BusinessLogic.Security.EntityProperties(beData.CUserId, hostName, dbName);
						var isValidEntity = entityBl.IsValidEntity((int)Dynamic.BusinessEntity.Global.FormsEntity.AssetsReturn, beData);
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

