using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Expense
{

	public class TranExpenseClaim
	{

		DA.Expense.TranExpenseClaimDB db = null;

		int _UserId = 0;

		public TranExpenseClaim(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Expense.TranExpenseClaimDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Expense.TranExpenseClaim beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public ResponeValues UpdateStatus(BE.Expense.TranExpenseClaim beData)
		{
			bool isModify = beData.TranId > 0;
			return db.UpdateStatus(beData, isModify);
			
		}
		public ResponeValues UpdateAcClearance(BE.Expense.TranExpenseClaim beData)
		{
			bool isModify = beData.TranId > 0;
			return db.UpdateAcClearance(beData, isModify);
			
		}
		public BE.Expense.TranExpenseClaimCollections GetAllTranExpenseClaim(int EntityId, DateTime? DateFrom, DateTime? DateTo, int? EmployeeId, int? StatusId)
		{
			return db.getAllTranExpenseClaim(_UserId, EntityId, DateFrom, DateTo, EmployeeId, StatusId);
		}
		public BE.Expense.TranExpenseClaim GetTranExpenseClaimById(int EntityId, int TranId)
		{
			return db.getTranExpenseClaimById(_UserId, EntityId, TranId);
		}
		public ResponeValue UpdateSubmitStatus(int TranId)
		{
			return db.UpdateSubmitStatus(_UserId, TranId);
		}
			public ResponeValues IsValidData(ref BE.Expense.TranExpenseClaim beData, bool IsModify)
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
                else if (beData.ExpenseClaimForId == 0 || beData.ExpenseClaimForId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Employee ";
                }
				else if (!beData.ExpenseTypeId.HasValue || beData.ExpenseTypeId==0)
                {
					resVal.ResponseMSG = "Please ! Select Expenses Type";
                }
				//else if(beData.DetailsColl==null || beData.DetailsColl.Count == 0)
    //            {
				//	resVal.ResponseMSG = "Please ! Enter Expenses Details";
    //            }
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

