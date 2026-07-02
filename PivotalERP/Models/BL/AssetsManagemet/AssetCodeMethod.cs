using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class AssetCodeMethod
	{

		DA.AssetManagement.AssetCodeMethodDB db = null;

		int _UserId = 0;

		public AssetCodeMethod(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.AssetCodeMethodDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.AssetCodeMethod beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.AssetCodeMethodCollections GetAllAssetCodeMethod(int EntityId)
		{
			return db.getAllAssetCodeMethod(_UserId, EntityId);
		}
		public BE.AssetManagement.AssetCodeMethod GetAssetCodeMethodById(int EntityId, int TranId)
		{
			return db.getAssetCodeMethodById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.AssetCodeMethod beData, bool IsModify)
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
				else if (beData.NumberingMethod == 0 ||  beData.NumberingMethod.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Numbering Method ";
				}
				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
				}
				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
				}
				else if (beData.StartNo == 0 || beData.StartNo.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select StartNo ";
				}
				else if (beData.PadWidth == 0 || beData.PadWidth.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select PadWidth ";
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

