using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BusinessEntity.Security
{
    public class SubBranch : ResponeValues
    {
        public int? SubBranchId { get; set; }
        public int? BranchId { get; set; }
        public string Name { get; set; } = "";
        public string DisplayName { get; set; } = "";
        public string Code { get; set; } = "";
        public string Address { get; set; } = "";
        public string State { get; set; } = "";
        public string PhoneNo { get; set; } = "";
        public string FaxNo { get; set; } = "";
        public string EmailId { get; set; } = "";
        public string WebSite { get; set; } = "";
        public string BranchManager { get; set; } = "";
        public string MobileNo { get; set; } = "";
    }
    public class SubBranchCollections : System.Collections.Generic.List<SubBranch>
    {
        public SubBranchCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}