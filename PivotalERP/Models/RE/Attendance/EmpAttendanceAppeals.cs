using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Attendance
{
    public class EmpAttendanceAppeals : ResponeValues
    {
        public EmpAttendanceAppeals()
        {
            Branch = "";
            Department = "";
            Designation = "";
            EmployeeCode = "";
            Name = "";
            InOutMode = "";
            PunchDateTimeAD = "";
            PunchDateTimeBS = "";
            Reason = "";
            LogDateTimeAD = "";
            LogDateTimeBS = "";
            Location = "";
            ApprovedTypeName = "";
            ApprovedByUser = "";
            ApprovedRemarks = "";
            ApprovedDateTimeAD = "";
            ApprovedDateTimeBS = "";
            EmailId = "";
            ContactNo = "";
            ApprovedType = BE.Attendance.APPROVEDTYPES.NOT_APPROVED.ToString();
        }

        public int? SNo { get; set; }
        public int? TranId { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string EmployeeCode { get; set; }
        public string Name { get; set; }
        public string InOutMode { get; set; }
        public string PunchDateTimeAD { get; set; }
        public string PunchDateTimeBS { get; set; }
        public string Reason { get; set; }
        public string LogDateTimeAD { get; set; }
        public string LogDateTimeBS { get; set; }
        public string Location { get; set; }
        public string ApprovedTypeName { get; set; }
        public string ApprovedByUser { get; set; }
        public string ApprovedRemarks { get; set; }
        public string ApprovedDateTimeAD { get; set; }
        public string ApprovedDateTimeBS { get; set; }
        public string EmailId { get; set; }
        public string ContactNo { get; set; }
        public string AttendanceMode { get; set; }

        public int? EmployeeId { get; set; }
        public int? AttendanceInOutModeId { get; set; }
        public DateTime? PunchDateTime { get; set; }
        public string PunchDateBS { get; set; }
        public string ApprovedType { get; set; }
        public int? ApprovedTypeId { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedDateTime { get; set; }
        public string ApprovedLogMiti { get; set; }
        public double? Lat { get; set; }
        public double? Lan { get; set; }
        public DateTime? LogDateTime { get; set; }
        public string LogMiti { get; set; }
        public string BranchName { get; set; }
        public string BranchAddress { get; set; }
    }
    public class EmpAttendanceAppealsCollections : System.Collections.Generic.List<EmpAttendanceAppeals>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}
