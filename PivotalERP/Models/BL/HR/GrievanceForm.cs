using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.HR
{

	public class GrievanceForm
	{
		DA.HR.GrievanceFormDB db = null;

		int _UserId = 0;

		public GrievanceForm(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.HR.GrievanceFormDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.HR.GrievanceForm beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}

		public BE.HR.GrievanceForm GetGrievanceDetailsById(int EntityId, int TranId)
		{
			return db.getGrievanceDetailsById(_UserId, EntityId, TranId);
		}

		public BE.HR.GrievanceForm GetEmployeeDetByUserId(int EntityId, int? EmpUserId, int EmployeeOrSalesman)
		{
			return db.GetEmployeeDetByUserId(_UserId, EntityId, EmpUserId, EmployeeOrSalesman);
		}
		public ResponeValues IsValidData(ref BE.HR.GrievanceForm beData, bool IsModify)
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
				else if (beData.UserId == 0 || beData.UserId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Employee ";
				}
				else if (beData.GrievanceTypeId == 0 || beData.GrievanceTypeId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select GrievanceType ";
				}
				else if (string.IsNullOrEmpty(beData.Description))
				{
					resVal.ResponseMSG = "Please ! Enter Description ";
				}
				else if (!beData.Declaration.HasValue || beData.Declaration.Value == false)
				{
					resVal.ResponseMSG = "Please ! check on Declaration";
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

