using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class ManualAttendance : ResponeValues
    {
        public int? TranId { get; set; }
        public int? UserId { get; set; }
        public int? MachineId { get; set; }
        public string UserName { get; set; } = "";
        public string UserFullName { get; set; } = "";
        public string Machine { get; set; } = "";
        public ManualAttendance()
        {
            ManualAttendanceDetailColl = new ManualAttendanceDetailCollections();
        }
        public ManualAttendanceDetailCollections ManualAttendanceDetailColl { get; set; }
        public string AttMode { get; set; } = "";
        public DateTime? AttendanceDate { get; set; } 
        public DateTime? InOutTime { get; set; } 
        public string AttendanceMitti { get; set; } = "";
        public DateTime? OutTime { get; set; } 
        public int? MADetailId { get; set; } 
    }
    public class ManualAttendanceCollections : List<ManualAttendance>
    {
        public ManualAttendanceCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class ManualAttendanceDetail
    {
        public int? MADetailId { get; set; }
        public int? TranId { get; set; }
        public int? InOutMode { get; set; }
        public DateTime? AttendanceDate { get; set; }
        public DateTime? InOutTime { get; set; }
        public DateTime? OutTime { get; set; }
        public string Remarks { get; set; } = "";
    }

    public class ManualAttendanceDetailCollections : System.Collections.Generic.List<ManualAttendanceDetail>
    {

        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }

    }
}