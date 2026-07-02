using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class LeaveBalanceSummary
    {
        DA.Attendance.LeaveBalanceSummaryDB db = null;
        int _UserId = 0;
        public LeaveBalanceSummary(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.LeaveBalanceSummaryDB(hostName, dbName);
        }
        public BE.Attendance.LeaveBalanceSummaryCollections GetLeaveBalanaceSummary(string BranchIdColl = "", string DepartmentIdColl = "", string CategoryIdColl = "", int? ForUserId = null, int? PeriodId = null,int EmployeeOrSalesman = 1, int? LeaveTypeId = null)
        {
            return db.GetLeaveBalanaceSummary(_UserId, BranchIdColl, DepartmentIdColl, CategoryIdColl, ForUserId, PeriodId, EmployeeOrSalesman, LeaveTypeId);
        }
    }
}
