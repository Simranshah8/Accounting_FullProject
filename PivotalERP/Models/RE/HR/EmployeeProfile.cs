using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.HR
{
    public class EmployeeProfile : ResponeValue
    {
        public int EmployeeId { get; set; }
        public string EmpCode { get; set; } = "";
        public long? EnrollNumber { get; set; }
        public string Name { get; set; } = "";
        public string EmailId { get; set; } = "";
        public string OfficeContactNo { get; set; } = "";
        public string PersonalContactNo { get; set; } = "";
        public string Address { get; set; } = "";
        public string PhotoPath { get; set; } = "";
        public byte[] PhotoB { get; set; }
        public string Branch { get; set; } = "";
        public string Department { get; set; } = "";
        public string Designation { get; set; } = "";
        public string Grade { get; set; } = "";
        public bool ActiveSelfi { get; set; }
        public int AttendanceStatus { get; set; }
        public bool NeedRemarks { get; set; }
        public bool AllowAttendance { get; set; }
        public bool IsSuperVisor { get; set; }
        public string HeadQuarter { get; set; } = "";
        public string HOD { get; set; } = "";
        public string SuperVisor1 { get; set; } = "";
        public string SuperVisor2 { get; set; } = "";
        public string SuperVisor3 { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public bool IsLeft { get; set; }
        public string SubBranch { get; set; } = "";
        public DateTime? Dateofjoining { get; set; }
        public string Mitiofjoining { get; set; } = "";
        public double Lat { get; set; }
        public double Lan { get; set; }
        public string ServicePeriod { get; set; }
        public bool AllowGpsTrack { get; set; } = true;

    }
    public class EmployeeProfileCollections : System.Collections.Generic.List<EmployeeProfile>
    {
        public EmployeeProfileCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public DateTime? ExpireDateTime { get; set; }
        public bool IsSuccess { get; set; }
    }
}
