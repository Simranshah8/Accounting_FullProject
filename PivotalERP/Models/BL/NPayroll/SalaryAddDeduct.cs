using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.NPayroll
{

	public class SalaryAddDeduct
	{

		DA.NPayroll.SalaryAddDeductDB db = null;

		int _UserId = 0;

		public SalaryAddDeduct(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.NPayroll.SalaryAddDeductDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.NPayroll.SalaryAddDeduct beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.NPayroll.SalaryAddDeductCollections GetAllSalaryAddDeduct(int EntityId)
		{
			return db.getAllSalaryAddDeduct(_UserId, EntityId);
		}
		public Dynamic.BE.NPayroll.SalaryAddDeduct GetSalaryAddDeductById(int EntityId, int TranId)
		{
			return db.getSalaryAddDeductById(_UserId, EntityId, TranId);
		}
		public ResponeValues DeleteById(int EntityId, int TranId)
		{
			return db.DeleteById(_UserId, EntityId, TranId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.NPayroll.SalaryAddDeduct beData, bool IsModify)
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
				//else if (beData.EmployeeId == 0 )
				//{
				//	resVal.ResponseMSG = "Please ! Select Employee ";
				//}
				else if (beData.PayHeadingId == 0)
				{
					resVal.ResponseMSG = "Please ! Select PayHeading ";
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

