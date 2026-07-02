using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class LeaveType : ResponeValues
    {
        public LeaveType()
        {
            Name = "";
            Code = "";
            CarriedForward = true;
            Remarks = "";
            ApplicableForId = LEAVETYPEAPPLICABLEFOR.EMPLOYEE;
        }
        public int? LeaveTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IncludeWeeklyOff { get; set; }
        public bool IncludeHoliday { get; set; }
        public bool CarriedForward { get; set; }
        public bool PaidLeave { get; set; }
        public string Remarks { get; set; }
        public int SNo { get; set; }

        public LEAVETYPEAPPLICABLEFOR ApplicableForId { get; set; }
        public string UserName { get; set; }
    }
    public class LeaveTypeCollections : System.Collections.Generic.List<LeaveType> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public enum LEAVETYPEAPPLICABLEFOR
    {
        EMPLOYEE=1,
        SALESMAN=2,
        BOTH=3
    }

    public class ImportLeaveQuotaOpening
    {
        public string FiscalYear { get; set; }
        public string EmpCode { get; set; }
        public string LeaveType { get; set; }
        public double Quota { get; set; }
        public double Opening { get; set; }
    }
}
