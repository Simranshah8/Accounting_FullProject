using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Attendance
{
    public class EmpDetForAttendanceSummary
    {

        Dynamic.DA.Attendance.EmpDetForAttendanceSummaryDB db = null;
        int _UserId = 0;
        public EmpDetForAttendanceSummary(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.EmpDetForAttendanceSummaryDB(hostName, dbName);
        }
        public Dynamic.BE.Attendance.EmpDetForAttendanceSummary GetEmpDetForAttendanceSummary(DateTime? FromDate, int EmployeeId)
        {
            return db.GetEmpDetForAttendanceSummary(_UserId, FromDate, EmployeeId);
        }
    }
}