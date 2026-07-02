using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.GateMaster
{

	public class GateMaster
	{

		DA.GateMaster.GateMasterDB db = null;

		int _UserId = 0;

		public GateMaster(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.GateMaster.GateMasterDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.GateMaster.GateMaster beData)
		{
			bool isModify = beData.GateId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.GateMaster.GateMasterCollections GetAllGateMaster(int EntityId)
		{
			return db.getAllGateMaster(_UserId, EntityId);
		}
		public BE.GateMaster.GateMaster GetGateMasterById(int EntityId, int GateId)
		{
			return db.getGateMasterById(_UserId, EntityId, GateId);
		}
		public ResponeValues DeleteById(int EntityId, int GateId)
		{
			return db.DeleteById(_UserId, EntityId, GateId);
		}
		public ResponeValues IsValidData(ref BE.GateMaster.GateMaster beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.GateId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.GateId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
				}
                else if (beData.VoucherId == 0 || beData.VoucherId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Voucher ";
                }
                else if (string.IsNullOrEmpty(beData.Code))
				{
					resVal.ResponseMSG = "Please ! Enter Code ";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
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

