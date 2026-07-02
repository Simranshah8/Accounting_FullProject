using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BL
{

	public class TransactionComplain
	{

		DA.TransactionComplainDB db = null;

		int _UserId = 0;

		public TransactionComplain(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.TransactionComplainDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.TransactionComplain beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.TransactionComplainCollections GetAllTransactionComplain(int EntityId)
		{
			return db.getAllTransactionComplain(_UserId, EntityId);
		}
		public BE.TransactionComplain GetTransactionComplainById(int EntityId, int TranId)
		{
			return db.getTransactionComplainById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}

		public ResponeValues GetAutoVoucherNo(int EntityId)
		{
			return db.GetAutoVoucherNo(_UserId, EntityId);
		}

		public ResponeValues IsValidData(ref BE.TransactionComplain beData, bool IsModify)
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
				//else if (beData.VoucherId == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select Voucher ";
				//}
				//else if (beData.CostClassId == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select CostClass ";
				//}
				//else if (beData.BranchId == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select Branch ";
				//}
				//else if (beData.AutoVoucherNo == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select AutoVoucherNo ";
				//}
				//else if (string.IsNullOrEmpty(beData.AutoManualNo))
				//{
				//	resVal.ResponseMSG = "Please ! Enter AutoManualNo ";
				//}
				else if (beData.TicketForId == 0)
				{
					resVal.ResponseMSG = "Please ! Select TicketFor ";
				}
				//else if (beData.LedgerId == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select Ledger ";
				//}
				else if (beData.SourceId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Source ";
				}
				else if (beData.NatureId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Nature ";
				}
				//else if (beData.VehicleId == 0)
				//{
				//	resVal.ResponseMSG = "Please ! Select Vehicle ";
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

