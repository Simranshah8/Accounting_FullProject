using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{
	public class EmployeeWiseWeekend
	{

		DA.Attendance.EmployeeWiseWeekendDB db = null;

		int _UserId = 0;

		public EmployeeWiseWeekend(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.EmployeeWiseWeekendDB(hostName, dbName);
		}
		public BE.Attendance.EmployeeWiseWeekendCollections GetEmployeeWiseWeekend(int YearId, int MonthId, int? BranchId, int? DepartmentId)
		{
			return db.GetEmployeeWiseWeekend(_UserId, YearId, MonthId, BranchId, DepartmentId);
		}
		public ResponeValues SaveUpdate(Dynamic.BE.Attendance.EmployeeWiseWeekendCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();

			foreach (var beData in dataColl)
			{
				if (beData.EmployeeId == 0)
				{
					return resVal;
				}
			}

			resVal = db.SaveEmpWiseWeekend(_UserId, dataColl);

			return resVal;
		}
		public ResponeValues CopyEmpWiseWeekend(int FromYearId, int FromMonthId, int ToYearId, int ToMonthId)
		{
			return db.CopyEmpWiseWeekend(_UserId, FromYearId, FromMonthId, ToYearId, ToMonthId);
		}
		public ResponeValues DeleteById(int BranchId, int DepartmentId, int YearId, int MonthId)
		{
			return db.DeleteById(BranchId, DepartmentId, YearId, MonthId);
		}
	}

}

