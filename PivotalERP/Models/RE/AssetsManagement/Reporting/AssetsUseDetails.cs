using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement.Report
{
    public class AssetsUseDetails : ResponeValues
    {
        public int? TranId { get; set; }
        public int? CompanyId { get; set; }
        public int? IssueById { get; set; }
        public string FromMitti { get; set; } = "";
        public string TOMitti { get; set; } = "";
        public string Particular { get; set; } = "";
        public string Designation { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public string IssueByName { get; set; } = "";
        public string DepartmentName { get; set; } = "";
        public string Branch { get; set; } = "";
        public string ReceivedStatus { get; set; } = "";
        public string EmployeeCode { get; set; } = "";
    }

    public class AssetsUseDetailsCollections : System.Collections.Generic.List<AssetsUseDetails>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}