using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class JobWorkOrder
	{

		DA.JobWorkOrderDB db = null;

		int _UserId = 0;

		public JobWorkOrder(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.JobWorkOrderDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.JobWorkOrder beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		
		public ResponeValues IsValidData(ref BE.JobWorkOrder beData, bool IsModify)
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
	}


	public class JobWorksOrder
	{

		DA.JobWorksOrderDB db = null;

		int _UserId = 0;

		public JobWorksOrder(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.JobWorksOrderDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.JobWorksOrder beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.JobWorksOrderCollections GetAllJobWorksOrder(int EntityId)
		{
			return db.getAllJobWorksOrder(_UserId, EntityId);
		}
		public BE.JobWorksOrder GetJobWorksOrderById(int EntityId, int TranId)
		{
			return db.getJobWorksOrderById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.JobWorksOrder beData, bool IsModify)
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
				else if (beData.AutoVoucherNo == 0 || beData.AutoVoucherNo.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select AutoVoucherNo ";
				}
				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
				}
				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
				}
				else if (beData.PartyLedgerId == 0 || beData.PartyLedgerId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Party Ledger ";
				}
				//else if (beData.JobCardId == 0 || beData.JobCardId.HasValue == false)
				//{
				//	resVal.ResponseMSG = "Please ! Select JobCard ";
				//}
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

