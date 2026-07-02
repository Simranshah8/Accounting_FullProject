using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Attendance
{
    public class EmpDetForAttendanceSummary : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; } = "";
        public long? EnrollNumber { get; set; }
        public string BranchName { get; set; } = "";
        public string Designation { get; set; } = "";
        public string Category { get; set; } = "";
        public string LateIn { get; set; } = "";
        public string EarlyOut { get; set; } = "";
        public string WorkingHour { get; set; } = "";
    }
    public class EmpDetForAttendanceSummaryCollction : List<EmpDetForAttendanceSummary>
    {
        public EmpDetForAttendanceSummaryCollction()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}