using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Leave
{
    
    public class LeaveQuotaSummaryLeaveTypeWise
    {
        public int SNo { get; set; }
        public string LeaveName { get; set; } = "";
        public string LeaveCode { get; set; } = "";
        public double OpeningQty { get; set; }
        public double QuotaQty { get; set; }
        public double LeaveQty { get; set; }
        public double Balance { get; set; }
    }
    public class LeaveQuotaSummary : LeaveQuotaSummaryLeaveTypeWise
    {
        public int EmployeeId { get; set; }
        public int LeaveId { get; set; }
        public string EmployeeCode { get; set; } = "";
        public string Name { get; set; } = "";
        public string Branch { get; set; } = "";
        public string Department { get; set; } = "";
        public string Category { get; set; } = "";
        public string OfficeContact { get; set; } = "";
        public string PersonalContact { get; set; } = "";

    }
    public class LeaveQuotaSummaryCollections : System.Collections.Generic.List<LeaveQuotaSummary>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}
