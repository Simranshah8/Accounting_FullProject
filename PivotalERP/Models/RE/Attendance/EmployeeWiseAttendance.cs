using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Attendance
{

    public class EmployeeWiseAttendance
    {
        public int SNO { get; set; }
        public int EmployeeId { get; set; }
        public DateTime DateAD { get; set; }
        public string DateBS { get; set; }
        public DateTime? InTime { get; set; }
        public DateTime? OutTime { get; set; }
        public string Attendance { get; set; }
        public string Remarks { get; set; }
        public int TotalDays { get; set; }
        public int TotalWeekEnd { get; set; }
        public int TotalPresent { get; set; }
        public int TotalAbsent { get; set; }
        public int TotalLeave { get; set; }
        public int TotalHoliday { get; set; }
        public string InLocation { get; set; }
        public string OutLocation { get; set; }
        public int WeekendPresent { get; set; }
        public int HolidayPresent { get; set; }
        public int LeavePresent { get; set; }
        public string WorkingHour { get; set; }
        public double TotalWorkingHour { get; set; }
        public bool IsWeekEnd { get; set; }
        public bool IsHoliday { get; set; }
        public bool IsLeave { get; set; }
        public bool IsPresent { get; set; }
        public string Color { get; set; }

        public DateTime OnDutyTime { get; set; }
        public DateTime OffDutyTime { get; set; }
        public double WorkingDuration { get; set; }
        public double OTDuration { get; set; }
        public double SinglePunchDeduction { get; set; }
        public double EarlyInMinutes { get; set; }
        public double LateInMinutes { get; set; }
        public double EarlyOutMinutes { get; set; }
        public double DelayOutMinutes { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public string Branch { get; set; } = "";
        public string Department { get; set; } = "";
        public string Designation { get; set; } = "";

        public long EnrollNumber { get; set; }
        public string Address { get; set; } = "";
        public string ContactNo { get; set; } = "";
        public int DepOrderNo { get; set; }
        public string WorkingShift { get; set; }
        public string GroupName { get; set; }
        public string LevelName { get; set; }
        public string ServiceType { get; set; }
        public string Category { get; set; }

        public string InTimeStr { get; set; }
        public string OutTimeStr { get; set; }
        public string OTHour { get; set; }
        public string Company { get; set; }
        public string LeaveOT { get; set; }
    }
    public class EmployeeWiseAttendanceCollections : System.Collections.Generic.List<EmployeeWiseAttendance> 
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
