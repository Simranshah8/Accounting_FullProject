using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL
{
	public class LCDetails
	{

		DA.LCDetailsDB db = null;

		int _UserId = 0;

		public LCDetails(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.LCDetailsDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.LCDetails beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.LCDetailsCollections GetAllLCDetails(int EntityId)
		{
			return db.getAllLCDetails(_UserId, EntityId);
		}
		public BE.LCDetails GetLCDetailsById(int EntityId, int TranId)
		{
			return db.getLCDetailsById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref BE.LCDetails beData, bool IsModify)
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
				else if (beData.FromTo == 0 /*|| beData.FromTo.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select FromTo ";
				}
				else if (beData.LedgerId == 0 /*|| beData.LedgerId.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select Ledger ";
				}
				else if (string.IsNullOrEmpty(beData.BankName))
				{
					resVal.ResponseMSG = "Please ! Enter BankName ";
				}
				else if (string.IsNullOrEmpty(beData.LCNo))
				{
					resVal.ResponseMSG = "Please ! Enter LCNo ";
				}
				else if (beData.IssuesDate.Year < 1901)
				{
					resVal.ResponseMSG = "Please ! Enter  IssuesDate ";
				}
				else if (beData.ExpiredDate.Year < 1901)
				{
					resVal.ResponseMSG = "Please ! Enter  ExpiredDate ";
				}
				else if (beData.LastDateOfShipment.Year < 1901)
				{
					resVal.ResponseMSG = "Please ! Enter  LastDateOfShipment ";
				}
				else if (beData.PaymentTermsInDays == 0 /*|| beData.PaymentTermsInDays.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select PaymentTermsInDays ";
				}
				else if (beData.UserId == 0 /*|| beData.UserId.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select User ";
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