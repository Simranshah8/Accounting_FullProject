using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{

	public class LeaveQuotaByEmp
	{

		DA.Attendance.LeaveQuotaByEmpDB db = null;

		int _UserId = 0;

		public LeaveQuotaByEmp(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.LeaveQuotaByEmpDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Attendance.LeaveQuotaByEmp beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Attendance.LeaveQuotaByEmpCollections GetAllLeaveQuotaByEmp()
		{
			return db.getAllLeaveQuotaByEmp(_UserId);
		}
		public BE.Attendance.LeaveQuotaByEmp GetLeaveQuotaByEmpById(int UsersId, int PeriodId)
		{
			return db.getLeaveQuotaByEmpById(_UserId, UsersId, PeriodId);
		}
		public ResponeValues DeleteById(int? TranId, int? PeriodId)
		{
			return db.DeleteById(_UserId,  TranId, PeriodId);
		}
		public ResponeValues IsValidData(ref BE.Attendance.LeaveQuotaByEmp beData, bool IsModify)
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
				else if (beData.PeriodId == 0 || beData.PeriodId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Period ";
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

		public BE.Attendance.LeaveQuotaByEmpCollections getAllEmpLeaveQuota(int? BranchId, int? DepartmentId, int? CategoryId, int PeriodId,int EmployeeOrSalesman)
		{
			return db.getAllEmpLeaveQuota(_UserId, BranchId, DepartmentId, CategoryId, PeriodId, EmployeeOrSalesman);
		}
		public ResponeValues SaveUpdate(Dynamic.BE.Attendance.LeaveQuotaByEmpCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();

			foreach (var beData in dataColl)
			{
				if (beData.PeriodId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Period to save Leave Oepning ";
					return resVal;
				}
               
            }
			

			resVal = db.SaveUpdateLeaveQuotaColl(_UserId, dataColl);

			return resVal;
		}
	}

}

