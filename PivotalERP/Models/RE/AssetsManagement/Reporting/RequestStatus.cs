using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement.Report
{
    public class RequestStatus : ResponeValues
    {
        public int? TranId { get; set; }
        public int? ParticularId { get; set; }
        public int? RequestQty { get; set; }
        public int? IssueQty { get; set; }
        public string IssueNo { get; set; }
        public string AssetReqNo { get; set; }
        public DateTime VoucherDateAD { get; set; }
        public string VoucherMitti { get; set; } = "";
        public string RequestBy { get; set; } = "";
        public string RequestByName { get; set; } = "";
        public string DepartmentName { get; set; } = "";
        public string BranchName { get; set; } = "";
        public string Particular { get; set; } = "";
        public string category { get; set; } = "";
        public string Purpose { get; set; } = "";
        public string ReqStatus { get; set; } = "";
        public string AssetAlias { get; set; } = "";
        public string AssetsCode { get; set; } = "";
        public string SerialNum { get; set; } = "";
        public int? PendingQty { get; set; }
        public string EmployeeCode { get; set; } = "";


    }

    public class RequestStatusCollections : System.Collections.Generic.List<RequestStatus>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";
    }
}