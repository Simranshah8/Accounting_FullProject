using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.AssetManagement
{

	public class RepairedInward
	{

		DA.AssetManagement.RepairedInwardDB db = null;

		int _UserId = 0;

		public RepairedInward(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.AssetManagement.RepairedInwardDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.AssetManagement.RepairedInward beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.AssetManagement.RepairedInwardCollections GetAllRepairedInward(int EntityId)
		{
			return db.getAllRepairedInward(_UserId, EntityId);
		}
		public BE.AssetManagement.RepairedInward GetRepairedInwardById(int EntityId, int TranId)
		{
			return db.getRepairedInwardById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues GetAutoRepairedNo(int EntityId)
		{
			return db.GetAutoRepairedNo(_UserId, EntityId);
		}
		public ResponeValues IsValidData(ref BE.AssetManagement.RepairedInward beData, bool IsModify)
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
				else if (beData.VoucherId == 0 || beData.VoucherId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Voucher ";
				}
				else if (beData.CostClassId == 0 || beData.CostClassId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select CostClass ";
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

