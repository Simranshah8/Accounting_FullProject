using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Attendance
{
    public class EmployeeDailyAttendance
    {
        public int SNo { get; set; }

        public int UserId { get; set; }
        public int EmployeeId { get; set; }
        public string EmpCode { get; set; }
        public long? EnrollNo { get; set; }
        public string Name { get; set; }
        public string ContactNo { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; } 
        public string In1 { get; set; } 
        public string Out1 { get; set; } 
        public string In2 { get; set; }
        public string Out2 { get; set; }
        public string In3 { get; set; }
        public string Out3 { get; set; }
        public string In4 { get; set; }
        public string Out4 { get; set; }
        public string In5 { get; set; }
        public string Out5 { get; set; }
        public string DateBS { get; set; }
        public string InTime { get; set; }
        public string OutTime { get; set; }
        public string Attendance { get; set; }
        public string Remarks { get; set; } 
        public string InLocation { get; set; }
        public string OutLocation { get; set; }
        public string Category { get; set; }
        public string Color { get; set; } 
        public double WorkingDuration { get; set; }
        public double OTDuration { get; set; }
        public double EarlyInMinutes { get; set; }
        public double LateInMiMinutes { get; set; }
        public double EarlyOutMinutes { get; set; }
        public double DelayOutMinutes { get; set; }
        public double WorkingMinuesAsInOut { get; set; }
        public string WorkingHR { get; set; }
        public string LateInStr { get; set; }
        public string BeforeOutStr { get; set; }
        public string WorkingHRAsInOut { get; set; }
        public string BranchName { get; set; }
        public string BranchAddress { get; set; }
        public string PhotoPath { get; set; }
        public bool AppliedLeave { get; set; }
        public string LeaveReason { get; set; }

        public string WorkingShift { get; set; }
        public string GroupName { get; set; }
        public string LevelName { get; set; }
        public string ServiceType { get; set; }
        public string OTHour { get; set; }
        public string Company { get; set; } 

        public string InPhotoPath { get; set; } 
        public string OutPhotoPath { get; set; }
    }
    public class EmployeeDailyAttendanceCollections : System.Collections.Generic.List<EmployeeDailyAttendance>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
