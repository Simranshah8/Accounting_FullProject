using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement
{
    public class AssetIssue: ResponeValues
    {
        public int? TranId { get; set; }
        public int? ParticularId { get; set; }
        public string Particular { get; set; }
        public int? CategoryId { get; set; }
        public string Category { get; set; }
        public int? PurposeId { get; set; }
        public string Purpose { get; set; }
        public int? QTY { get; set; }
        public DateTime EntryDate { get; set; }
        public string EntryDateBS { get; set; }
        public int? IssueDays { get; set; }
        public string VoucherNo { get; set; }
        public string IssueBy { get; set; }
        public int? IssueNo { get; set; }
        public int? IssueById { get; set; }
        public int? UserId { get; set; }
        public int? DepartmentId { get; set; }
        public int? HODId { get; set; }
    }
    public class AssetIssueCollections : List<AssetIssue>
    {
        public AssetIssueCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}