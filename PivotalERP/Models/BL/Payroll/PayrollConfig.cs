using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Payroll
{

	public class PayrollConfig
	{

		DA.Payroll.PayrollConfigDB db = null;

		int _UserId = 0;

		public PayrollConfig(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Payroll.PayrollConfigDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Payroll.PayrollConfig beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
        
        public BE.Payroll.PayrollConfig GetPayrollConfig(int EntityId)
        {
            return db.getPayrollConfig(_UserId, EntityId);
        }

		//Added By suresh for pay slip get
		public BE.Payroll.PaySlipReportCollections GetPaySlipsReport(int EntityId)
		{
			return db.getAllPaySlipReport(_UserId, EntityId);
		}

		//Ends
		public ResponeValues IsValidData(ref BE.Payroll.PayrollConfig beData, bool IsModify)
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

}

