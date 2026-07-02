using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR.Report
{
    public class EmpResponsibilityHistory: ResponeValues
    {
        public int EmpJDId { get; set; }
        public string Responsibility { get; set; } = "";
        public string FromMitti { get; set; } = "";
        public string ToMitti { get; set; } = "";
        public int? EmployeeId { get; set; }
        public string JDStatus { get; set; } = "";
    }
    public class EmpResponsibilityHistoryCollections: System.Collections.Generic.List<EmpResponsibilityHistory>
    {
        public string ResponseMSG { get; set; } = "";

        public bool IsSuccess { get; set; }
    }
}