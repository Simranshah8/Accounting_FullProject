using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.GateMaster
{

	public class GateEntry
	{

		DA.GateMaster.GateEntryDB db = null;

		int _UserId = 0;

		public GateEntry(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.GateMaster.GateEntryDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.GateMaster.GateEntry beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.GateMaster.GateEntryCollections GetAllTransactionGateEntry(int EntityId,string PassType, ref int TotalRows, int PageNumber = 1, int RowsOfPage = 100, string SearchBy = "")
		{
			return db.getAllTransactionGateEntry(_UserId, EntityId, PassType, ref TotalRows, PageNumber, RowsOfPage, SearchBy);
		}
		public BE.GateMaster.GateEntry GetTransactionGateEntryById(int EntityId, int TranId)
		{
			return db.getTransactionGateEntryById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public BE.GateMaster.GateEntryCollections GetVehiclesForOutWard(int EntityId, String PassType)
		{
			return db.GetVehiclesForOutWard(_UserId, EntityId, PassType);
		}
		public ResponeValues IsValidData(ref BE.GateMaster.GateEntry beData, bool IsModify)
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
				else if (beData.VoucherId == 0 || beData.VoucherId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Voucher ";
				}
				else if (beData.CostClassId == 0 || beData.CostClassId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select CostClass ";
				}
				else if (beData.CostClassId == 0 || beData.CostClassId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select CostClass ";
				}
				else if (beData.VoucherDate.Year < 1901)
				{
					resVal.ResponseMSG = "Please ! Enter  VoucherDate ";
				}
				else if (string.IsNullOrEmpty(beData.PassType))
				{
					resVal.ResponseMSG = "Please ! Enter PassType ";
				}
				else if (string.IsNullOrEmpty(beData.EntryType))
				{
					resVal.ResponseMSG = "Please ! Enter EntryType ";
				}
				else if (beData.InDateTime.Year < 1901)
				{
					resVal.ResponseMSG = "Please ! Enter  InDateTime ";
				}
				else if (string.IsNullOrEmpty(beData.ApprovalStatus))
				{
					resVal.ResponseMSG = "Please ! Enter ApprovalStatus ";
				}
				else if (beData.BranchId == 0 || beData.BranchId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Branch ";
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

