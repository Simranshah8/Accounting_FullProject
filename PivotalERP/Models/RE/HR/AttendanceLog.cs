using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR
{
    public class AttendanceLog : ResponeValue
    {
        public int SNO { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? DateAD { get; set; }
        public string DateBS { get; set; } = "";
        public TimeSpan? InTime { get; set; }
        public TimeSpan? OutTime { get; set; }
        public string Attendance { get; set; } = "";
        public string Remarks { get; set; } = "";
        public int TotalDays { get; set; }
        public int TotalWeekEnd { get; set; }
        public int TotalPresent { get; set; }
        public int TotalAbsent { get; set; }
        public int TotalLeave { get; set; }
        public int TotalHoliday { get; set; }
        public string InLocation { get; set; } = "";
        public string OutLocation { get; set; } = "";
        public int WeekendPresent { get; set; }
        public int HolidayPresent { get; set; }
        public int LeavePresent { get; set; }
        public string WorkingHour { get; set; } = "";
        public double? TotalWorkingHour { get; set; }
        public bool IsWeekEnd { get; set; }
        public bool IsHoliday { get; set; }
        public bool IsLeave { get; set; }
        public bool IsPresent { get; set; }
        public string Color { get; set; } = "";
        public string OnDutyTime { get; set; } = "";
        public string OffDutyTime { get; set; } = "";
        public double? WorkingDuration { get; set; }
        public double? OTDuration { get; set; }
        public double? SinglePunchDeduction { get; set; }
        public double? EarlyInMinutes { get; set; }
        public double? LateInMinutes { get; set; }
        public double? EarlyOutMinutes { get; set; }
        public double? DelayOutMinutes { get; set; }
        public int NY { get; set; }
        public int NM { get; set; }
        public int ND { get; set; }
        public string MonthName { get; set; } = "";
        public int DayId { get; set; }
        public int TotalDaysInMonth { get; set; }

    }
    public class AttendanceLogCollections : System.Collections.Generic.List<AttendanceLog>
    {
        public AttendanceLogCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}