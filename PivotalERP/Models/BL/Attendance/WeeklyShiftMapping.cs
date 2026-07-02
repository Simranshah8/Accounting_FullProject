using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Attendance
{
	public class WeeklyShiftMapping
	{

		DA.Attendance.WeeklyShiftMappingDB db = null;

		int _UserId = 0;

		public WeeklyShiftMapping(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Attendance.WeeklyShiftMappingDB(hostName, dbName);
		}
		public BE.Attendance.WeeklyShiftMappingCollections GetWeeklyShiftMapping(DateTime DateFrom, DateTime DateTo, string BranchIdColl = "", string DepartmentIdColl = "", string DesignationIdColl = "", string CategoryIdColl = "", int? WorkingShiftId = null)
		{
			return db.GetWeeklyShiftMapping(_UserId, DateFrom, DateTo, BranchIdColl, DepartmentIdColl, DesignationIdColl, CategoryIdColl, WorkingShiftId);
		}

		public ResponeValues SaveUpdate(Dynamic.BE.Attendance.WeeklyShiftMappingCollections dataColl)
		{
			ResponeValues resVal = new ResponeValues();

			foreach (var beData in dataColl)
			{
				if (beData.EmployeeId == 0)
				{
					return resVal;
				}
			}

			resVal = db.SaveWeeklyShiftMappingColl(_UserId, dataColl);

			return resVal;
		}
		public ResponeValues DeleteById(int EmployeeId, DateTime DateFrom, DateTime DateTo)
		{
			return db.DeleteById(EmployeeId, DateFrom, DateTo);
		}
	}

}

