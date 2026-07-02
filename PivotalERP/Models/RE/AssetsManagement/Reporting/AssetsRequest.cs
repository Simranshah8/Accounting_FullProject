using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.AssetManagement
{
    public class AssetsRequest : ResponeValues
    {
        public int? TranId { get; set; }
        public int? ParticularId { get; set; }
        public string Particular { get; set; }
        public int? CategoryId { get; set; }
        public string Category { get; set; }
        public int? PurposeId { get; set; }
        public string Purpose { get; set; }
        public int? QTY { get; set; }
        public DateTime? ReqFrom { get; set; }
        public string ReqFromBS { get; set; }
        public DateTime? ReqTo { get; set; }
        public string ReqToBS { get; set; }
        public DateTime EntryDate { get; set; }
        public string EntryDateBS { get; set; }
        public int? ReqDays { get; set; }
        public string VoucherNo { get; set; }
        public string RequestBy { get; set; }
        public int? AssetReqNo { get; set; }
        public int? RequestById { get; set; }
        public int? UserId { get; set; }
        public int? DepartmentId { get; set; }
        public int? HODId { get; set; }
    }
    public class AssetsRequestCollections : List<AssetsRequest>
    {
        public AssetsRequestCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}